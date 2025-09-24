import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'sticker';
  file_url?: string;
  read_at?: string;
  sent_at: string;
  sender?: {
    username: string;
    avatar_url?: string;
  };
}

export const useRealtimeMessages = (conversationId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  // Charger les messages existants
  const loadMessages = async (convId: string) => {
    if (!convId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages' as any)
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(username, avatar_url)
        `)
        .eq('conversation_id', convId)
        .order('sent_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Envoyer un nouveau message
  const sendMessage = async (content: string, messageType: Message['message_type'] = 'text', fileUrl?: string) => {
    if (!conversationId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('messages' as any)
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
          message_type: messageType,
          file_url: fileUrl
        });

      if (error) throw error;

      // Mettre à jour la conversation avec le dernier message
      await supabase
        .from('conversations' as any)
        .update({
          last_message: content,
          last_message_at: new Date().toISOString()
        })
        .eq('id', conversationId);

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive"
      });
    }
  };

  // Marquer les messages comme lus
  const markAsRead = async (messageIds: string[]) => {
    try {
      const { error } = await supabase
        .from('messages' as any)
        .update({ read_at: new Date().toISOString() })
        .in('id', messageIds)
        .is('read_at', null);

      if (error) throw error;
    } catch (error: any) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  // Supprimer un message
  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages' as any)
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le message",
        variant: "destructive"
      });
    }
  };

  // Écouter les nouveaux messages en temps réel
  useEffect(() => {
    if (!conversationId) return;

    loadMessages(conversationId);

    // Channel pour les messages temps réel
    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        async (payload) => {
          const newMessage = payload.new as Message;
          
          // Récupérer les infos du sender
          const { data: sender } = await supabase
            .from('profiles' as any)
            .select('username, avatar_url')
            .eq('id', newMessage.sender_id)
            .single();

          setMessages(prev => [...prev, { ...newMessage, sender }]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          const updatedMessage = payload.new as Message;
          setMessages(prev => prev.map(msg => 
            msg.id === updatedMessage.id ? { ...msg, ...updatedMessage } : msg
          ));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  return {
    messages,
    loading,
    isTyping,
    sendMessage,
    markAsRead,
    deleteMessage,
    setIsTyping
  };
};