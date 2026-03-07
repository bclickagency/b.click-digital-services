import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'team_member' | 'client';

export interface AuthState {
  user: User | null;
  role: UserRole | null;
  profile: {
    full_name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
    company_name: string | null;
    bio: string | null;
  } | null;
  loading: boolean;
  isStaff: boolean;
  isAdmin: boolean;
  isClient: boolean;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    profile: null,
    loading: true,
    isStaff: false,
    isAdmin: false,
    isClient: false,
  });

  const loadUserData = useCallback(async (user: User) => {
    try {
      const [rolesRes, profileRes] = await Promise.all([
        supabase.from('user_roles').select('role').eq('user_id', user.id),
        supabase.from('profiles').select('*').eq('id', user.id).single(),
      ]);

      const role = (rolesRes.data?.[0]?.role as UserRole) || null;
      const profile = profileRes.data;

      setState({
        user,
        role,
        profile: profile ? {
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          avatar_url: profile.avatar_url,
          company_name: profile.company_name,
          bio: profile.bio,
        } : null,
        loading: false,
        isStaff: role === 'admin' || role === 'team_member',
        isAdmin: role === 'admin',
        isClient: role === 'client' || role === null,
      });
    } catch {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Use setTimeout to avoid Supabase auth deadlock
        setTimeout(() => loadUserData(session.user), 0);
      } else {
        setState({
          user: null, role: null, profile: null,
          loading: false, isStaff: false, isAdmin: false, isClient: false,
        });
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserData(session.user);
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, [loadUserData]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<AuthState['profile']>) => {
    if (!state.user) return;
    const { error } = await supabase
      .from('profiles')
      .update(updates as any)
      .eq('id', state.user.id);
    if (!error) {
      setState(prev => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, ...updates } : null,
      }));
    }
    return { error };
  };

  return { ...state, signOut, updateProfile };
};
