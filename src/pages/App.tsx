import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Chat from "./Chat";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    // For now, we'll just redirect to chat
    // In a real app, you'd check authentication state here
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [navigate]);

  return <Chat />;
};

export default App;