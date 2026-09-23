'use client';

import React, { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { motion } from 'motion/react';
import { Lock, LogIn, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/admin');
    } catch (err: any) {
      console.error(err);
      setError("Login failed. Only authorized administrators can access this area.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center"
      >
        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
          <Lock className="text-primary" size={32} />
        </div>
        
        <h1 className="text-2xl font-black text-primary mb-2">Admin Central</h1>
        <p className="text-slate-500 mb-10">Access the EduGraphix Lab management dashboard.</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 text-sm mb-8 text-left">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full btn-primary py-4 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <LogIn size={20} />
          {loading ? 'Authenticating...' : 'Sign in with Google'}
        </button>

        <p className="mt-8 text-xs text-slate-400">
          This area is restricted to EduGraphix Lab staff. All access is logged and monitored.
        </p>
      </motion.div>
    </div>
  );
}
