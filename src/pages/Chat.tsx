import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState<number>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSelectConversation = (conversationId: number) => {
    setSelectedConversation(conversationId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${isMobile ? 'fixed left-0 top-0 h-full z-50' : 'relative'}
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          w-80 transition-transform duration-300 ease-in-out
          border-r border-border bg-chat-sidebar
        `}
      >
        {/* Mobile Close Button */}
        {isMobile && (
          <div className="flex justify-end p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="hover-lift"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}
        
        <Sidebar
          onSelectConversation={handleSelectConversation}
          selectedConversation={selectedConversation}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 border-b border-border bg-card">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="hover-lift"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="font-semibold text-lg">Royal Chatflow</h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        )}

        {/* Chat Window */}
        <ChatWindow conversationId={selectedConversation} />
      </div>
    </div>
  );
};

export default Chat;