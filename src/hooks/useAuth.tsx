
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up auth state listener');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, updating presence');
          setTimeout(() => {
            updateUserPresence();
          }, 100);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const updateUserPresence = async () => {
    if (!user) return;
    
    try {
      console.log('Updating user presence for:', user.email);
      await supabase.rpc('update_user_presence', {
        p_room_id: '550e8400-e29b-41d4-a716-446655440000',
        p_status: 'online'
      });
      console.log('Presence updated successfully');
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      console.log('Signing up user:', email);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: userData
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast({
          title: "Neural Link Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('Signup successful');
        toast({
          title: "Neural Connection Established",
          description: "Welcome to the NEXUS network! Check your email to verify your account.",
        });
      }

      return { error };
    } catch (error: any) {
      console.error('Signup exception:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in user:', email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Signin error:', error);
        toast({
          title: "Neural Link Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('Signin successful');
        toast({
          title: "Neural Link Established",
          description: "Welcome back to NEXUS!",
        });
      }

      return { error };
    } catch (error: any) {
      console.error('Signin exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user');
      await supabase.auth.signOut();
      toast({
        title: "Neural Link Terminated",
        description: "Connection to NEXUS has been safely closed.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
