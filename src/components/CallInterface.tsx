import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Volume2
} from "lucide-react";
import { useVoiceCalls } from "@/hooks/useVoiceCalls";
import { cn } from "@/lib/utils";

const CallInterface = () => {
  const {
    currentCall,
    incomingCall,
    isCallActive,
    isMuted,
    isVideoEnabled,
    localVideoRef,
    remoteVideoRef,
    answerCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo
  } = useVoiceCalls();

  // Interface pour appel entrant
  if (incomingCall && !currentCall) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="w-full max-w-sm mx-4 p-8 text-center space-y-6">
          <div className="space-y-4">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-2xl">
                {incomingCall.caller_id.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">Appel entrant</h2>
              <p className="text-muted-foreground">
                {incomingCall.call_type === 'video' ? 'Appel vidéo' : 'Appel vocal'}
              </p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button
              variant="destructive"
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={() => rejectCall(incomingCall)}
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
            <Button
              variant="default"
              size="lg"
              className="rounded-full w-14 h-14 bg-emerald-500 hover:bg-emerald-600"
              onClick={() => answerCall(incomingCall)}
            >
              <Phone className="w-6 h-6" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Interface pendant l'appel
  if (currentCall && isCallActive) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        {/* Vidéos */}
        {currentCall.call_type === 'video' && (
          <div className="flex-1 relative">
            {/* Vidéo distante */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Vidéo locale (en overlay) */}
            <div className="absolute top-4 right-4 w-32 h-24 bg-background rounded-lg overflow-hidden border">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Infos de l'appel (pour appels vocaux seulement) */}
        {currentCall.call_type === 'voice' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-6">
              <Avatar className="w-32 h-32 mx-auto">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-4xl">
                  {currentCall.recipient_id.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">Appel en cours</h2>
                <p className="text-muted-foreground">Connecté</p>
              </div>
            </div>
          </div>
        )}

        {/* Contrôles d'appel */}
        <div className="p-6 bg-card/50 backdrop-blur-sm">
          <div className="flex justify-center space-x-4">
            {/* Bouton micro */}
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={toggleMute}
            >
              {isMuted ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </Button>

            {/* Bouton vidéo (si appel vidéo) */}
            {currentCall.call_type === 'video' && (
              <Button
                variant={!isVideoEnabled ? "destructive" : "secondary"}
                size="lg"
                className="rounded-full w-14 h-14"
                onClick={toggleVideo}
              >
                {isVideoEnabled ? (
                  <Video className="w-6 h-6" />
                ) : (
                  <VideoOff className="w-6 h-6" />
                )}
              </Button>
            )}

            {/* Bouton haut-parleur */}
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full w-14 h-14"
            >
              <Volume2 className="w-6 h-6" />
            </Button>

            {/* Bouton raccrocher */}
            <Button
              variant="destructive"
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={endCall}
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CallInterface;