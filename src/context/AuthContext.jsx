import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(true);
    const [isRoleFetching, setIsRoleFetching] = useState(false);

    // EMERGENCY DEBUG: This MUST show up if the code is running
    useEffect(() => {
        console.log('--- AUTH PROVIDER MOUNTED ---');
        // window.alert('Auth Provider Is Active - If you see this, code is updated!');
    }, []);

    const fetchProfile = async (userId) => {
        if (!userId) return;
        setIsRoleFetching(true);
        console.log('DEBUG: fetchProfile started for', userId);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('DEBUG: Profile Fetch ERROR:', error);
                setRole('user');
            } else if (data) {
                console.log('DEBUG: Profile Fetch SUCCESS. Role found:', data.role);
                setRole(data.role);
            }
        } catch (err) {
            console.error('DEBUG: Profile Fetch CATCH:', err);
        } finally {
            setIsRoleFetching(false);
        }
    };

    useEffect(() => {
        // 1. Initial Session Check
        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const currentUser = session?.user ?? null;
                setUser(currentUser);
                if (currentUser) {
                    fetchProfile(currentUser.id); // Don't await here, let it run in background
                }
            } catch (err) {
                console.error('Auth Init Error:', err);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // 2. Auth State Change Listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                fetchProfile(currentUser.id);
            } else {
                setRole('user');
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = (email, password) => supabase.auth.signUp({ email, password });
    const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });
    const signOut = () => {
        setRole('user');
        return supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            role,
            isRoleFetching,
            isAdmin: role === 'admin',
            signUp,
            signIn,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);
