import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  MessageCircle, 
  Users, 
  Settings, 
  Plus,
  Archive,
  Bell
} from "lucide-react";
import { useState } from "react";

// Mock data for conversations
const conversations = [
  {
    id: 1,
    name: "Alice Martin",
    lastMessage: "Salut ! Comment ça va ?",
    time: "14:30",
    unread: 2,
    avatar: "",
    online: true
  },
  {
    id: 2,
    name: "Équipe Projet",
    lastMessage: "La réunion est reportée à demain",
    time: "13:45",
    unread: 0,
    avatar: "",
    online: false,
    isGroup: true
  },
  {
    id: 3,
    name: "Bob Johnson",
    lastMessage: "Parfait, à tout à l'heure !",
    time: "12:20",
    unread: 0,
    avatar: "",
    online: true
  },
  {
    id: 4,
    name: "Sarah Chen",
    lastMessage: "J'ai envoyé les documents",
    time: "11:30",
    unread: 1,
    avatar: "",
    online: false
  },
  {
    id: 5,
    name: "Tech Startup",
    lastMessage: "Nouveau produit lancé ! 🚀",
    time: "Hier",
    unread: 0,
    avatar: "",
    online: false,
    isGroup: true
  }
];

interface SidebarProps {
  onSelectConversation?: (conversationId: number) => void;
  selectedConversation?: number;
}

const Sidebar = ({ onSelectConversation, selectedConversation }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full bg-chat-sidebar border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Royal Chatflow</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover-lift">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover-lift">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50"
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center p-2 bg-muted/30">
        <Button variant="ghost" size="sm" className="flex-1">
          <MessageCircle className="w-4 h-4 mr-2" />
          Discussions
        </Button>
        <Button variant="ghost" size="sm" className="flex-1">
          <Users className="w-4 h-4 mr-2" />
          Groupes
        </Button>
        <Button variant="ghost" size="sm" className="flex-1">
          <Archive className="w-4 h-4 mr-2" />
          Archivées
        </Button>
      </div>

      <Separator />

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation?.(conversation.id)}
              className={`
                flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-muted/50
                ${selectedConversation === conversation.id ? 'bg-primary/10 border-l-4 border-primary' : ''}
              `}
            >
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={conversation.avatar} />
                  <AvatarFallback className="gradient-primary text-white font-semibold">
                    {conversation.isGroup ? (
                      <Users className="w-6 h-6" />
                    ) : (
                      conversation.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                    )}
                  </AvatarFallback>
                </Avatar>
                {conversation.online && !conversation.isGroup && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium truncate">{conversation.name}</h4>
                  <span className="text-xs text-muted-foreground">{conversation.time}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate mt-1">
                  {conversation.lastMessage}
                </p>
              </div>
              
              {conversation.unread > 0 && (
                <div className="bg-primary text-primary-foreground text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
                  {conversation.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="gradient-primary text-white font-semibold">
                VU
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">Votre nom</p>
            <p className="text-xs text-muted-foreground">En ligne</p>
          </div>
          <Button variant="ghost" size="icon" className="hover-lift">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;