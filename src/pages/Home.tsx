import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Github, Twitter, Mail } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeatureSection />
      
      {/* CTA Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Prêt à commencer ?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Rejoignez des milliers d'utilisateurs qui font confiance à Royal Chatflow 
              pour leurs communications sécurisées.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                asChild 
                size="lg" 
                className="gradient-primary text-lg px-12 py-6 hover-lift"
              >
                <Link to="/auth">
                  Créer un compte gratuit
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="text-lg px-12 py-6 hover-lift"
              >
                <Link to="/chat">Essayer la démo</Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Gratuit pour toujours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Aucune carte requise</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Configuration en 2 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-border bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 text-gradient">Royal Chatflow</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                La plateforme de messagerie sécurisée nouvelle génération. 
                Communiquez librement avec la technologie de chiffrement la plus avancée.
              </p>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="hover-lift">
                  <Github className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover-lift">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover-lift">
                  <Mail className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">Fonctionnalités</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Sécurité</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">API</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">Centre d'aide</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Nous contacter</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Statut</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Communauté</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">
              © 2024 Royal Chatflow. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0 text-muted-foreground">
              <Link to="#" className="hover:text-primary transition-colors">Confidentialité</Link>
              <Link to="#" className="hover:text-primary transition-colors">Conditions</Link>
              <Link to="#" className="hover:text-primary transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;