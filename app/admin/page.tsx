'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Users, ClipboardCheck, MessageSquare, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    leads: 0,
    audits: 0,
    messages: 0,
    converted: 0
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsSnap, auditsSnap, messagesSnap] = await Promise.all([
          getDocs(collection(db, 'leads')),
          getDocs(collection(db, 'digitalAudits')),
          getDocs(collection(db, 'contactMessages'))
        ]);

        const leads = leadsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setStats({
          leads: leadsSnap.size,
          audits: auditsSnap.size,
          messages: messagesSnap.size,
          converted: leads.filter((l: any) => l.status === 'converted').length
        });

        // Get recent leads
        const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'), limit(5));
        const recentSnap = await getDocs(q);
        setRecentLeads(recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-3xl" />)}
      </div>
      <div className="h-96 bg-white rounded-3xl" />
    </div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back. Here&apos;s what&apos;s happening with EduGraphix Lab.</p>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
          <Calendar className="text-slate-400" size={20} />
          <span className="text-sm font-bold text-slate-600">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users />} title="Total Leads" value={stats.leads} color="text-blue-600" bg="bg-blue-50" />
        <StatCard icon={<ClipboardCheck />} title="Audits Done" value={stats.audits} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard icon={<MessageSquare />} title="Messages" value={stats.messages} color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={<TrendingUp />} title="Converted" value={stats.converted} color="text-pink-600" bg="bg-pink-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 premium-card">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Recent Leads</h3>
            <Link href="/admin/leads" className="text-secondary text-sm font-bold flex items-center gap-1 hover:underline">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentLeads.length > 0 ? recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-secondary transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-primary shadow-sm">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{lead.name}</h4>
                    <p className="text-xs text-slate-400">{lead.institutionName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                    lead.status === 'new' ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-600"
                  )}>
                    {lead.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleDateString() : 'Just now'}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-center py-12 text-slate-400">No leads yet.</p>
            )}
          </div>
        </div>

        <div className="premium-card">
          <h3 className="text-xl font-bold mb-8">Conversion Funnel</h3>
          <div className="space-y-6">
            <FunnelStep label="Total Leads" value={stats.leads} total={stats.leads} color="bg-blue-500" />
            <FunnelStep label="Interested" value={recentLeads.filter(l => l.status === 'interested').length} total={stats.leads} color="bg-emerald-500" />
            <FunnelStep label="Converted" value={stats.converted} total={stats.leads} color="bg-pink-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color, bg }: { icon: React.ReactNode, title: string, value: number, color: string, bg: string }) {
  return (
    <div className="premium-card p-6 flex items-center gap-6">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner", bg, color)}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 28 }) : icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{title}</h4>
        <div className="text-3xl font-black text-primary">{value}</div>
      </div>
    </div>
  );
}

function FunnelStep({ label, value, total, color }: { label: string, value: number, total: number, color: string }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-bold">
        <span className="text-slate-600">{label}</span>
        <span className="text-primary">{value}</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
