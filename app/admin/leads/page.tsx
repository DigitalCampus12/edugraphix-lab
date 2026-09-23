'use client';

import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Phone, 
  Mail, 
  Building2, 
  MapPin, 
  Clock,
  ExternalLink,
  ChevronRight,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STAGES = [
  { id: 'new', label: 'NEW', color: 'bg-blue-500' },
  { id: 'contacted', label: 'CONTACTED', color: 'bg-amber-500' },
  { id: 'interested', label: 'INTERESTED', color: 'bg-emerald-500' },
  { id: 'proposal_sent', label: 'PROPOSAL SENT', color: 'bg-indigo-500' },
  { id: 'converted', label: 'CONVERTED', color: 'bg-pink-500' },
  { id: 'not_interested', label: 'NOT INTERESTED', color: 'bg-slate-500' }
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'leads'));

    return () => unsubscribe();
  }, []);

  const updateStatus = async (leadId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'leads', leadId), { 
        status: newStatus,
        updatedAt: new Date()
      }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `leads/${leadId}`));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.institutionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary">Lead Management CRM</h1>
          <p className="text-slate-500">Track and manage your school digital transformation enquiries.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search leads..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-secondary w-full"
            />
          </div>
          <button className="bg-white p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-primary transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-6">
        <div className="flex gap-6 h-full min-w-[1200px]">
          {STAGES.map((stage) => (
            <div key={stage.id} className="flex-1 min-w-[280px] bg-slate-100/50 rounded-2xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", stage.color)} />
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stage.label}</h3>
                  <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-black text-slate-400">
                    {filteredLeads.filter(l => l.status === stage.id).length}
                  </span>
                </div>
                <MoreVertical size={16} className="text-slate-400" />
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto">
                {filteredLeads.filter(l => l.status === stage.id).map((lead) => (
                  <motion.div
                    key={lead.id}
                    layoutId={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-secondary transition-colors group"
                  >
                    <h4 className="font-bold text-sm text-primary mb-1">{lead.institutionName}</h4>
                    <p className="text-xs text-slate-500 mb-4">{lead.name}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex -space-x-2">
                        {lead.servicesInterested?.slice(0, 3).map((s: string) => (
                          <div key={s} className="w-6 h-6 rounded-full bg-slate-50 border border-white flex items-center justify-center text-[8px] font-black text-secondary">
                            {s.charAt(0)}
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Now'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {selectedLead && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[60]" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: '100%' }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-white shadow-2xl z-[70] p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-black text-2xl">
                    {selectedLead.institutionName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-primary">{selectedLead.institutionName}</h2>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                      STAGES.find(s => s.id === selectedLead.status)?.color.replace('bg-', 'text-').replace('500', '600'),
                      STAGES.find(s => s.id === selectedLead.status)?.color.replace('bg-', 'bg-').replace('500', '100')
                    )}>
                      {selectedLead.status}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <DetailItem icon={<Users size={18} />} label="Contact Person" value={selectedLead.name} />
                <DetailItem icon={<Mail size={18} />} label="Email Address" value={selectedLead.email} />
                <DetailItem icon={<Phone size={18} />} label="Phone Number" value={selectedLead.phone} />
                <DetailItem icon={<MapPin size={18} />} label="City" value={selectedLead.city} />
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {STAGES.map(stage => (
                      <button
                        key={stage.id}
                        onClick={() => updateStatus(selectedLead.id, stage.id)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                          selectedLead.status === stage.id 
                            ? stage.color + " text-white" 
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        )}
                      >
                        {stage.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Interested Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedLead.servicesInterested?.map((s: string) => (
                      <span key={s} className="px-3 py-1 bg-secondary/5 text-secondary border border-secondary/10 rounded-full text-xs font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedLead.websiteURL && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Current Website</h3>
                    <a href={selectedLead.websiteURL} target="_blank" rel="noopener noreferrer" className="text-secondary text-sm flex items-center gap-2 hover:underline">
                      {selectedLead.websiteURL} <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="text-slate-300 mt-1">{icon}</div>
      <div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
        <div className="text-sm font-bold text-primary">{value}</div>
      </div>
    </div>
  );
}

function X({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
