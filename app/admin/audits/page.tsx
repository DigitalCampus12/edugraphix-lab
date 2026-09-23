'use client';

import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';
import { ClipboardCheck, Search, Building2, User, Trophy, Calendar } from 'lucide-react';

export default function AuditsAdminPage() {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'digitalAudits'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAudits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'digitalAudits'));

    return () => unsubscribe();
  }, []);

  const filteredAudits = audits.filter(a => 
    a.institutionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary">Digital Readiness Audits</h1>
          <p className="text-slate-500">Review self-assessment scores from school leads.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search institution..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-secondary w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Institution</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Score</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAudits.map((audit) => (
              <tr key={audit.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                      <Building2 size={16} />
                    </div>
                    <span className="font-bold text-sm text-primary">{audit.institutionName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-secondary" style={{ width: `${audit.totalScore}%` }} />
                    </div>
                    <span className="text-sm font-black text-secondary">{audit.totalScore}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    {audit.resultCategory}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">
                  {audit.createdAt?.toDate ? audit.createdAt.toDate().toLocaleDateString() : 'Now'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAudits.length === 0 && (
          <div className="p-20 text-center text-slate-400 font-medium">
            No audits found.
          </div>
        )}
      </div>
    </div>
  );
}
