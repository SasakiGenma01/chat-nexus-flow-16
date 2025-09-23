import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageSquare, 
  Video, 
  Shield, 
  Smartphone, 
  Cloud, 
  Users,
  Zap,
  Globe,
  Lock
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Messages instantanés",
    description: "Envoyez et recevez des messages en temps réel avec confirmation de lecture et statuts en ligne.",
    gradient: "gradient-primary"
  },
  {
    icon: Video,
    title: "Appels vocaux & vidéo",
    description: "Appels haute qualité avec WebRTC pour une communication claire et fluide partout dans le monde.",
    gradient: "gradient-accent"
  },
  {
    icon: Shield,
    title: "Chiffrement de bout en bout",
    description: "Vos conversations sont protégées par un chiffrement E2E militaire que seuls vous et vos contacts peuvent lire.",
    gradient: "gradient-primary"
  },
  {
    icon: Smartphone,
    title: "Application PWA",
    description: "Installez Royal Chatflow comme une app native sur tous vos appareils avec synchronisation complète.",
    gradient: "gradient-accent"
  },
  {
    icon: Cloud,
    title: "Stockage sécurisé",
    description: "Sauvegarde automatique et synchronisation de vos messages sur tous vos appareils connectés.",
    gradient: "gradient-primary"
  },
  {
    icon: Users,
    title: "Groupes & chaînes",
    description: "Créez des groupes jusqu'à 200 000 membres et des chaînes pour diffuser vos messages.",
    gradient: "gradient-accent"
  },
  {
    icon: Zap,
    title: "Performance optimale",
    description: "Interface ultra-rapide avec chargement instantané des messages et médias optimisés.",
    gradient: "gradient-primary"
  },
  {
    icon: Globe,
    title: "Multi-plateforme",
    description: "Disponible sur web, mobile et desktop avec synchronisation temps réel entre tous vos appareils.",
    gradient: "gradient-accent"
  },
  {
    icon: Lock,
    title: "Confidentialité totale",
    description: "Aucune collecte de données personnelles. Vos métadonnées et communications restent privées.",
    gradient: "gradient-primary"
  }
];

const FeatureSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Fonctionnalités <span className="text-gradient">avancées</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez toutes les fonctionnalités qui font de Royal Chatflow 
            la meilleure plateforme de messagerie sécurisée.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="hover-lift animate-scale-in border-0 shadow-lg bg-card/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className={`w-16 h-16 rounded-2xl ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;