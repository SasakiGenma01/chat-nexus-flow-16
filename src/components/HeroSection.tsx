import { Button } from "@/components/ui/button";
import { Shield, MessageCircle, Video, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-chat.jpg";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-hero opacity-10"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gradient">Royal</span>{" "}
              <span className="text-foreground">Chatflow</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Messagerie sécurisée de nouvelle génération avec appels vocaux et vidéo. 
              Communiquez en toute sécurité avec un chiffrement de bout en bout.
            </p>
            
            {/* Feature Icons */}
            <div className="flex flex-wrap gap-6 mb-8 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-5 h-5 text-primary" />
                <span>Chiffrement E2E</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span>Messages instantanés</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Video className="w-5 h-5 text-primary" />
                <span>Appels HD</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock className="w-5 h-5 text-primary" />
                <span>100% Privé</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg" 
                className="gradient-primary text-lg px-8 py-6 hover-lift"
              >
                <Link to="/auth">Commencer maintenant</Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 hover-lift"
              >
                <Link to="/chat">Voir la démo</Link>
              </Button>
            </div>
          </div>
          
          {/* Right Content - Hero Image */}
          <div className="relative animate-scale-in">
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Royal Chatflow - Interface de messagerie moderne"
                className="w-full h-auto rounded-2xl shadow-2xl hover-lift"
              />
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-primary text-primary-foreground rounded-2xl p-4 animate-bounce-in shadow-lg">
                <MessageCircle className="w-8 h-8" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground rounded-2xl p-4 animate-bounce-in shadow-lg" style={{animationDelay: '0.2s'}}>
                <Shield className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-slide-up">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">256-bit</div>
            <div className="text-muted-foreground">Chiffrement</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
            <div className="text-muted-foreground">Disponibilité</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-muted-foreground">Support</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">GDPR</div>
            <div className="text-muted-foreground">Conforme</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;