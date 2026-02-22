'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    name?: string;
    role: 'user' | 'admin';
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signIn: (userData: User) => void;
    signOut: () => Promise<void>;
    checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const checkSession = async () => {
        try {
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            if (data.success) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkSession();
    }, []);

    const signIn = (userData: User) => {
        setUser(userData);
    };

    const signOut = async () => {
        try {
            await fetch('/api/auth/signout', { method: 'POST' });
            setUser(null);
            router.push('/signin');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signOut, checkSession }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
