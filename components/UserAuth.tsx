'use client';

import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UserAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) return <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />;

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs font-bold text-primary truncate max-w-[100px]">{user.displayName}</span>
          <button onClick={handleLogout} className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-tighter transition-colors">Logout</button>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-secondary p-0.5">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full rounded-full object-cover" />
          ) : (
            <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center">
              <UserIcon size={16} className="text-slate-400" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={handleLogin}
      className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-secondary transition-all"
    >
      <LogIn size={16} />
      Login
    </button>
  );
}
