import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Call {
  id: string;
  caller_id: string;
  recipient_id: string;
  call_type: 'voice' | 'video';
  status: 'ringing' | 'answered' | 'ended' | 'rejected' | 'missed';
  started_at: string;
  answered_at?: string;
  ended_at?: string;
  duration_seconds: number;
}

export const useVoiceCalls = () => {
  const [currentCall, setCurrentCall] = useState<Call | null>(null);
  const [incomingCall, setIncomingCall] = useState<Call | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  
  const { toast } = useToast();

  // Configuration WebRTC
  const rtcConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  // Initier un appel
  const startCall = async (recipientId: string, callType: 'voice' | 'video' = 'voice') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Créer l'appel dans la base de données
      const { data: call, error } = await supabase
        .from('calls' as any)
        .insert({
          caller_id: user.id,
          recipient_id: recipientId,
          call_type: callType,
          status: 'ringing'
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentCall(call);
      await setupLocalMedia(callType === 'video');
      await createPeerConnection(call.id, true); // true = caller
      
      toast({
        title: "Appel en cours",
        description: "Appel en cours de connexion..."
      });

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible d'initier l'appel",
        variant: "destructive"
      });
    }
  };

  // Répondre à un appel
  const answerCall = async (call: Call) => {
    try {
      // Mettre à jour le statut de l'appel
      const { error } = await supabase
        .from('calls' as any)
        .update({
          status: 'answered',
          answered_at: new Date().toISOString()
        })
        .eq('id', call.id);

      if (error) throw error;

      setCurrentCall(call);
      setIncomingCall(null);
      setIsCallActive(true);
      
      await setupLocalMedia(call.call_type === 'video');
      await createPeerConnection(call.id, false); // false = receiver

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de répondre à l'appel",
        variant: "destructive"
      });
    }
  };

  // Rejeter un appel
  const rejectCall = async (call: Call) => {
    try {
      const { error } = await supabase
        .from('calls' as any)
        .update({
          status: 'rejected',
          ended_at: new Date().toISOString()
        })
        .eq('id', call.id);

      if (error) throw error;

      setIncomingCall(null);
      cleanupCall();

    } catch (error: any) {
      console.error('Erreur rejet appel:', error);
    }
  };

  // Terminer un appel
  const endCall = async () => {
    if (!currentCall) return;

    try {
      const duration = Math.floor((Date.now() - new Date(currentCall.answered_at || currentCall.started_at).getTime()) / 1000);
      
      const { error } = await supabase
        .from('calls' as any)
        .update({
          status: 'ended',
          ended_at: new Date().toISOString(),
          duration_seconds: duration
        })
        .eq('id', currentCall.id);

      if (error) throw error;

      cleanupCall();
      
      toast({
        title: "Appel terminé",
        description: `Durée: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`
      });

    } catch (error: any) {
      console.error('Erreur fin appel:', error);
      cleanupCall();
    }
  };

  // Configurer les médias locaux (micro/caméra)
  const setupLocalMedia = async (includeVideo: boolean) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: includeVideo
      });

      localStreamRef.current = stream;
      
      if (localVideoRef.current && includeVideo) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      toast({
        title: "Erreur média",
        description: "Impossible d'accéder au microphone/caméra",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Créer la connexion WebRTC
  const createPeerConnection = async (callId: string, isInitiator: boolean) => {
    const peerConnection = new RTCPeerConnection(rtcConfiguration);
    peerConnectionRef.current = peerConnection;

    // Ajouter le stream local
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current!);
      });
    }

    // Gérer le stream distant
    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Gérer les candidats ICE
    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        // Envoyer le candidat ICE à l'autre pair via Supabase Realtime
        await supabase.channel(`call-${callId}`)
          .send({
            type: 'broadcast',
            event: 'ice-candidate',
            payload: {
              candidate: event.candidate,
              from: isInitiator ? 'caller' : 'receiver'
            }
          });
      }
    };

    if (isInitiator) {
      // Créer l'offre
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      // Envoyer l'offre
      await supabase.channel(`call-${callId}`)
        .send({
          type: 'broadcast',
          event: 'offer',
          payload: { offer }
        });
    }

    // Écouter les événements WebRTC
    const channel = supabase.channel(`call-${callId}`)
      .on('broadcast', { event: 'offer' }, async ({ payload }) => {
        if (!isInitiator && peerConnection) {
          await peerConnection.setRemoteDescription(payload.offer);
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          
          // Envoyer la réponse
          await supabase.channel(`call-${callId}`)
            .send({
              type: 'broadcast',
              event: 'answer',
              payload: { answer }
            });
        }
      })
      .on('broadcast', { event: 'answer' }, async ({ payload }) => {
        if (isInitiator && peerConnection) {
          await peerConnection.setRemoteDescription(payload.answer);
          setIsCallActive(true);
        }
      })
      .on('broadcast', { event: 'ice-candidate' }, async ({ payload }) => {
        if (peerConnection && payload.from !== (isInitiator ? 'caller' : 'receiver')) {
          await peerConnection.addIceCandidate(payload.candidate);
        }
      })
      .subscribe();

    return channel;
  };

  // Basculer le son
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  // Basculer la vidéo
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  // Nettoyer les ressources
  const cleanupCall = () => {
    // Fermer la connexion peer
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Arrêter les streams
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Réinitialiser les états
    setCurrentCall(null);
    setIncomingCall(null);
    setIsCallActive(false);
    setIsMuted(false);
    setIsVideoEnabled(true);

    // Nettoyer les références vidéo
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  // Écouter les appels entrants
  useEffect(() => {
    const { data: { user } } = supabase.auth.getUser();
    
    const channel = supabase
      .channel('incoming-calls')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'calls',
          filter: `recipient_id=eq.${user?.then(u => u.user?.id)}`
        },
        (payload) => {
          const call = payload.new as Call;
          if (call.status === 'ringing') {
            setIncomingCall(call);
            
            // Son de notification d'appel entrant
            const audio = new Audio('/notification-sound.mp3');
            audio.play().catch(console.error);
            
            toast({
              title: "Appel entrant",
              description: "Vous recevez un appel"
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      cleanupCall();
    };
  }, []);

  return {
    currentCall,
    incomingCall,
    isCallActive,
    isMuted,
    isVideoEnabled,
    localVideoRef,
    remoteVideoRef,
    startCall,
    answerCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo
  };
};