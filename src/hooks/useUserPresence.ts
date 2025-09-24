import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserPresence {
  userId: string;
  username: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen: string;
  isTyping?: boolean;
}

export const useUserPresence = () => {
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [currentUserStatus, setCurrentUserStatus] = useState<'online' | 'offline' | 'away' | 'busy'>('offline');

  // Mettre à jour le statut de l'utilisateur actuel
  const updateUserStatus = async (status: UserPresence['status']) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles' as any)
        .update({
          status,
          is_online: status === 'online',
          last_seen: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      setCurrentUserStatus(status);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  // Heartbeat pour maintenir le statut en ligne
  const sendHeartbeat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('profiles' as any)
        .update({
          last_seen: new Date().toISOString(),
          is_online: true
        })
        .eq('id', user.id);
    } catch (error) {
      console.error('Erreur heartbeat:', error);
    }
  };

  // Marquer comme "en train d'écrire"
  const setTypingStatus = async (conversationId: string, isTyping: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase.channel(`typing-${conversationId}`);
      
      if (isTyping) {
        await channel.track({
          user_id: user.id,
          typing: true,
          timestamp: Date.now()
        });
      } else {
        await channel.untrack();
      }
    } catch (error) {
      console.error('Erreur statut typing:', error);
    }
  };

  // Écouter les changements de présence
  useEffect(() => {
    // Mettre l'utilisateur en ligne au démarrage
    updateUserStatus('online');

    // Heartbeat toutes les 30 secondes
    const heartbeatInterval = setInterval(sendHeartbeat, 30000);

    // Écouter les changements de statut des autres utilisateurs
    const channel = supabase
      .channel('user-presence')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          const profile = payload.new as any;
          if (profile && profile.is_online) {
            setOnlineUsers(prev => {
              const existing = prev.find(u => u.userId === profile.id);
              const userData: UserPresence = {
                userId: profile.id,
                username: profile.username,
                status: profile.status,
                lastSeen: profile.last_seen
              };

              if (existing) {
                return prev.map(u => u.userId === profile.id ? userData : u);
              } else {
                return [...prev, userData];
              }
            });
          } else if (payload.eventType === 'DELETE' || !profile?.is_online) {
            setOnlineUsers(prev => prev.filter(u => u.userId !== profile?.id));
          }
        }
      )
      .subscribe();

    // Nettoyer au démontage
    return () => {
      updateUserStatus('offline');
      clearInterval(heartbeatInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  // Marquer comme hors ligne quand la page se ferme
  useEffect(() => {
    const handleBeforeUnload = () => {
      updateUserStatus('offline');
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateUserStatus('away');
      } else {
        updateUserStatus('online');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    onlineUsers,
    currentUserStatus,
    updateUserStatus,
    setTypingStatus
  };
};