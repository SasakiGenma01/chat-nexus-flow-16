import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Phone, 
  Video, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Smile,
  Mic,
  Search
} from "lucide-react";
import { useState } from "react";

// Mock chat messages
const messages = [
  {
    id: 1,
    text: "Salut ! Comment ça va ?",
    time: "14:30",
    sent: false,
    delivered: true,
    read: true
  },
  {
    id: 2,
    text: "Ça va très bien, merci ! Et toi ?",
    time: "14:31",
    sent: true,
    delivered: true,
    read: true
  },
  {
    id: 3,
    text: "Super ! J'ai vu que tu travaillais sur le nouveau projet. Comment ça avance ?",
    time: "14:32",
    sent: false,
    delivered: true,
    read: true
  },
  {
    id: 4,
    text: "Ça avance bien ! On devrait livrer la première version la semaine prochaine. Je te tiens au courant 👍",
    time: "14:35",
    sent: true,
    delivered: true,
    read: false
  }
];

interface ChatWindowProps {
  conversationId?: number;
}

const ChatWindow = ({ conversationId }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would send the message to your backend
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 mx-auto">
            <Send className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Bienvenue sur Royal Chatflow</h3>
          <p className="text-muted-foreground">Sélectionnez une conversation pour commencer à chatter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="gradient-primary text-white font-semibold">
                AM
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background"></div>
          </div>
          <div>
            <h3 className="font-semibold">Alice Martin</h3>
            <p className="text-sm text-muted-foreground">En ligne</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hover-lift">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover-lift">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover-lift">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover-lift">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sent ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className={`max-w-xs lg:max-w-md ${
                message.sent 
                  ? 'chat-bubble-sent' 
                  : 'chat-bubble-received'
              }`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
                <div className={`flex items-center justify-end gap-1 mt-2 text-xs ${
                  message.sent ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  <span>{message.time}</span>
                  {message.sent && (
                    <div className="flex">
                      <div className={`w-3 h-3 ${message.delivered ? 'text-primary-foreground' : 'text-primary-foreground/50'}`}>
                        ✓
                      </div>
                      {message.read && (
                        <div className="w-3 h-3 text-primary-foreground -ml-1">✓</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="chat-bubble-received">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hover-lift">
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Tapez votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-20 bg-chat-input"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Smile className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {newMessage.trim() ? (
            <Button onClick={handleSendMessage} className="gradient-primary hover-lift">
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