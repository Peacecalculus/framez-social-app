import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          uid: session.user.id,
          email: session.user.email,
          displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0],
          photoURL: session.user.user_metadata?.avatar_url || null,
        });
      }
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser({
          uid: session.user.id,
          email: session.user.email,
          displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0],
          photoURL: session.user.user_metadata?.avatar_url || null,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const register = async (email, password, displayName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) throw error;

      // Create user profile in database
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: data.user.id,
              username: displayName || data.user.email?.split('@')[0] || `user_${data.user.id.slice(0, 8)}`,
              full_name: displayName || null,
              avatar_url: null,
              bio: null,
            },
          ], {
            onConflict: 'id',
            ignoreDuplicates: true,
          });

        if (profileError && __DEV__) {
          console.error('Profile creation error:', profileError);
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Ensure profile exists after login
      if (data.user) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();

        if (!existingProfile) {
          const username = data.user.user_metadata?.display_name || data.user.email?.split('@')[0] || `user_${data.user.id.slice(0, 8)}`;
          
          await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                username: username,
                full_name: data.user.user_metadata?.display_name || null,
                avatar_url: data.user.user_metadata?.avatar_url || null,
                bio: null,
              },
            ]);
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
