import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    console.log('--- AUTH PROVIDER INITIALIZED ---');
    const [user, setUser] = useState(null);
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(true);

    // DEBUG: Alert to confirm code is running
    // useEffect(() => { alert("Auth Provider Active"); }, []);

    const fetchProfile = async (userId) => {
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
            } else {
                console.warn('DEBUG: Profile Fetch returned NO DATA');
                setRole('user');
            }
        } catch (err) {
            console.error('DEBUG: Profile Fetch CATCH:', err);
        }
    };



    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const currentUser = session?.user ?? null;
                setUser(currentUser);
                if (currentUser) {
                    await fetchProfile(currentUser.id);
                }
            } catch (err) {
                console.error('Check session error:', err);
            } finally {
                setLoading(false);
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            try {
                setLoading(true);
                const currentUser = session?.user ?? null;
                setUser(currentUser);
                if (currentUser) {
                    await fetchProfile(currentUser.id);
                } else {
                    setRole('user');
                }
            } catch (err) {
                console.error('Auth change error:', err);
            } finally {
                setLoading(false);
            }
        });



        return () => subscription.unsubscribe();
    }, []);

    const signUp = (email, password) => supabase.auth.signUp({ email, password });
    const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });
    const signOut = () => supabase.auth.signOut();

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            role,
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
