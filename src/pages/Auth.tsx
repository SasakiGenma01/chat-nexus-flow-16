import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Eye, EyeOff, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Connexion réussie !",
        description: "Bienvenue sur Royal Chatflow",
      });
      navigate("/app");
    }, 2000);
  };

  const handleOAuthLogin = (provider: string) => {
    toast({
      title: `Connexion via ${provider}`,
      description: "Redirection en cours...",
    });
    // Here you would integrate with OAuth providers
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 hover-lift" 
          asChild
        >
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
        </Button>

        <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm animate-scale-in">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold">
              <span className="text-gradient">Royal Chatflow</span>
            </CardTitle>
            <CardDescription className="text-base">
              Connectez-vous pour accéder à vos conversations sécurisées
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="email" className="space-y-6">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="email">E-mail</TabsTrigger>
                <TabsTrigger value="phone">Téléphone</TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-6">
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse e-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span>Se souvenir de moi</span>
                    </label>
                    <Link 
                      to="#" 
                      className="text-primary hover:underline"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gradient-primary hover-lift" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Connexion..." : "Se connecter"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Numéro de téléphone</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+33 6 12 34 56 78"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    className="w-full gradient-primary hover-lift"
                    onClick={() => toast({
                      title: "Code OTP envoyé",
                      description: "Vérifiez vos messages",
                    })}
                  >
                    Envoyer le code OTP
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Ou continuer avec
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <Button 
                  variant="outline" 
                  className="hover-lift"
                  onClick={() => handleOAuthLogin("Google")}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button 
                  variant="outline" 
                  className="hover-lift"
                  onClick={() => handleOAuthLogin("Apple")}
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C8.396 0 8.002.016 8.002.016S7.608 0 4.002 0C1.794 0 0 1.794 0 4.002v15.996C0 22.206 1.794 24 4.002 24h15.996C22.206 24 24 22.206 24 19.998V4.002C24 1.794 22.206 0 19.998 0h-7.981zm-.717 1.886c.516-.004 1.086-.004 1.086-.004s2.472-.008 3.546 1.066c1.074 1.074 1.066 3.546 1.066 3.546s0 .57-.004 1.086H12.3c-2.33 0-4.214 1.884-4.214 4.214v2.33c0 2.33 1.884 4.214 4.214 4.214h2.33c2.33 0 4.214-1.884 4.214-4.214v-2.33c0-.57.004-1.086.004-1.086s.008-2.472-1.066-3.546c-1.074-1.074-3.546-1.066-3.546-1.066s-.57 0-1.086.004v.016z"/>
                  </svg>
                  Apple
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Pas encore de compte ? </span>
              <Button variant="link" className="p-0 h-auto text-primary">
                Créer un compte
              </Button>
            </div>

            <div className="mt-4 text-center text-xs text-muted-foreground">
              En vous connectant, vous acceptez nos{" "}
              <Link to="#" className="text-primary hover:underline">
                Conditions d'utilisation
              </Link>{" "}
              et notre{" "}
              <Link to="#" className="text-primary hover:underline">
                Politique de confidentialité
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;