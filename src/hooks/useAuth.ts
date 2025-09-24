import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Connexion par email/mot de passe
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur Royal Chatflow !"
      });
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // Inscription par email/mot de passe
  const signUp = async (email: string, password: string, username: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Inscription réussie",
        description: "Vérifiez votre email pour confirmer votre compte"
      });
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // Connexion avec OAuth (Google, Apple, etc.)
  const signInWithOAuth = async (provider: 'google' | 'apple' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/app`
        }
      });
      
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // Connexion par lien magique (passwordless)
  const signInWithMagicLink = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/app`
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Lien magique envoyé",
        description: "Vérifiez votre email pour vous connecter"
      });
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // Déconnexion
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Déconnexion",
        description: "À bientôt !"
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion",
        variant: "destructive"
      });
    }
  };

  // Réinitialiser le mot de passe
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`
      });
      
      if (error) throw error;
      
      toast({
        title: "Email envoyé",
        description: "Vérifiez votre email pour réinitialiser votre mot de passe"
      });
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // Mettre à jour le mot de passe
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été modifié avec succès"
      });
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // Écouter les changements d'authentification
  useEffect(() => {
    // Configurer l'écoute des changements d'auth AVANT de récupérer la session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Créer/mettre à jour le profil si l'utilisateur vient de s'inscrire
        if (event === 'SIGNED_UP' && session?.user) {
          const { error } = await supabase
            .from('profiles' as any)
            .upsert({
              id: session.user.id,
              email: session.user.email!,
              username: session.user.user_metadata?.username || session.user.email!.split('@')[0],
              avatar_url: session.user.user_metadata?.avatar_url,
              is_online: true,
              status: 'online'
            }, {
              onConflict: 'id'
            });
          
          if (error) {
            console.error('Erreur création profil:', error);
          }
        }
      }
    );

    // PUIS récupérer la session existante
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithOAuth,
    signInWithMagicLink,
    signOut,
    resetPassword,
    updatePassword
  };
};