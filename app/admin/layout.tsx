'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Briefcase,
  Lightbulb,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
  { name: 'Leads', href: '/admin/leads', icon: <Users size={20} /> },
  { name: 'Audits', href: '/admin/audits', icon: <ClipboardCheck size={20} /> },
  { name: 'Messages', href: '/admin/messages', icon: <MessageSquare size={20} /> },
  { name: 'Services', href: '/admin/services', icon: <Settings size={20} /> },
  { name: 'Portfolio', href: '/admin/portfolio', icon: <Briefcase size={20} /> },
  { name: 'Insights', href: '/admin/insights', icon: <Lightbulb size={20} /> },
  { name: 'Profile', href: '/admin/profile', icon: <Settings size={20} /> },
  { name: 'Website', href: '/', icon: <Globe size={20} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
        setLoading(false);
        return;
      }

      // Check if user is admin
      try {
        // Method 1: Check by email (bootstrapped)
        if (user.email === 'digitalcampus11@gmail.com') {
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        // Method 2: Check admins collection
        const q = query(collection(db, 'admins'), where('uid', '==', user.uid));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setIsAdmin(true);
        } else {
          // Not an admin, sign out
          await signOut(auth);
          router.push('/admin/login?error=unauthorized');
        }
      } catch (err) {
        console.error("Admin check failed:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-primary text-white h-screen sticky top-0 transition-all duration-300 z-50",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-primary font-bold">E</span>
              </div>
              <span className="font-extrabold tracking-tighter">ADMIN</span>
            </Link>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-6 px-3 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-4 px-3 py-3 rounded-lg transition-all",
                pathname === link.href ? "bg-secondary text-white" : "hover:bg-white/5 text-white/60 hover:text-white"
              )}
            >
              <span className="shrink-0">{link.icon}</span>
              {sidebarOpen && <span className="font-medium text-sm">{link.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-3 right-3">
          <button 
            onClick={() => signOut(auth)}
            className="flex items-center gap-4 px-3 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-all w-full"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
