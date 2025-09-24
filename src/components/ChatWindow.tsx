import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Send,
  Mic,
  CheckCheck,
  Check
} from "lucide-react";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { useUserPresence } from "@/hooks/useUserPresence";
import { useVoiceCalls } from "@/hooks/useVoiceCalls";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ChatWindowProps {
  conversationId?: string;
}

const ChatWindow = ({ conversationId }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [recipientProfile, setRecipientProfile] = useState<any>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { 
    messages, 
    loading, 
    isTyping, 
    sendMessage, 
    markAsRead
  } = useRealtimeMessages(conversationId);
  const { onlineUsers, updateTypingStatus } = useUserPresence();
  const { startCall } = useVoiceCalls();

  // Récupérer les infos du destinataire de la conversation
  useEffect(() => {
    const fetchRecipientProfile = async () => {
      if (!conversationId || !user) return;

      try {
        const { data: conversation } = await supabase
          .from('conversations' as any)
          .select('participant_1, participant_2')
          .eq('id', conversationId)
          .single();

        if (!conversation) return;

        const recipientId = conversation.participant_1 === user.id 
          ? conversation.participant_2 
          : conversation.participant_1;

        const { data: profile } = await supabase
          .from('profiles' as any)
          .select('*')
          .eq('id', recipientId)
          .single();

        setRecipientProfile(profile);
      } catch (error) {
        console.error('Erreur récupération profil:', error);
      }
    };

    fetchRecipientProfile();
  }, [conversationId, user]);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Marquer les messages comme lus
  useEffect(() => {
    if (messages.length > 0 && user) {
      const unreadMessages = messages
        .filter(msg => msg.sender_id !== user.id && !msg.read_at)
        .map(msg => msg.id);
      
      if (unreadMessages.length > 0) {
        markAsRead(unreadMessages);
      }
    }
  }, [messages, user, markAsRead]);

  // Show welcome message if no conversation is selected
  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-chat-background">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-primary rounded-full" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-foreground">
            Bienvenue sur Royal Chatflow
          </h2>
          <p className="text-muted-foreground">
            Sélectionnez une conversation pour commencer à chatter
          </p>
        </div>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const isRecipientOnline = recipientProfile && onlineUsers.some(u => u.userId === recipientProfile.id);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-500';
      case 'away': return 'bg-amber-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-chat-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarImage src={recipientProfile?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>
                {recipientProfile?.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            {isRecipientOnline && (
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(recipientProfile?.status || 'offline')}`} />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {recipientProfile?.username || 'Utilisateur'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isRecipientOnline ? 
                (isTyping ? 'Tape...' : 'En ligne') : 
                `Vu ${format(new Date(recipientProfile?.last_seen || Date.now()), 'HH:mm', { locale: fr })}`
              }
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="hover-lift">
            <Search className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover-lift"
            onClick={() => recipientProfile && startCall(recipientProfile.id, 'voice')}
          >
            <Phone className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover-lift"
            onClick={() => recipientProfile && startCall(recipientProfile.id, 'video')}
          >
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover-lift">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-2" ref={scrollAreaRef}>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwn = message.sender_id === user?.id;
              const messageTime = format(new Date(message.sent_at), 'HH:mm', { locale: fr });
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-end space-x-2 max-w-[70%] ${isOwn ? "flex-row-reverse space-x-reverse" : ""}`}>
                    {!isOwn && (
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={message.sender?.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {message.sender?.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwn
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-card-foreground"
                      } shadow-sm`}
                    >
                      {message.message_type === 'text' && (
                        <p className="text-sm">{message.content}</p>
                      )}
                      
                      {message.message_type === 'image' && (
                        <div className="space-y-2">
                          <img 
                            src={message.file_url} 
                            alt="Image partagée" 
                            className="max-w-full h-auto rounded-lg"
                          />
                          {message.content && <p className="text-sm">{message.content}</p>}
                        </div>
                      )}
                      
                      <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
                        isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}>
                        <span>{messageTime}</span>
                        {isOwn && (
                          <div className="flex">
                            {message.read_at ? (
                              <CheckCheck className="w-3 h-3 text-blue-400" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-2 max-w-[70%]">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={recipientProfile?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">
                      {recipientProfile?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-card text-card-foreground rounded-2xl px-4 py-2 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input area */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="hover-lift">
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 flex items-center bg-chat-input rounded-full px-4 py-2">
            <Input
              placeholder="Tapez votre message..."
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button variant="ghost" size="icon" className="ml-2">
              <Smile className="w-5 h-5" />
            </Button>
          </div>
          
          {newMessage.trim() ? (
            <Button onClick={handleSendMessage} className="rounded-full hover-lift">
              <Send className="w-5 h-5" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="hover-lift">
              <Mic className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;