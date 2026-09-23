'use client';

import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { Mail, Trash2, CheckCircle, Search, Clock, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'contactMessages'));

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'contactMessages', id), { status: 'read' });
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.institution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary">Contact Messages</h1>
          <p className="text-slate-500">Manage enquiries from the contact form.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search messages..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-secondary w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredMessages.map((msg) => (
          <div key={msg.id} className={cn(
            "premium-card flex flex-col md:row gap-8 items-start relative overflow-hidden",
            msg.status === 'new' ? "border-l-4 border-l-secondary" : ""
          )}>
            <div className="w-full md:w-1/4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                  <Mail size={16} />
                </div>
                <h4 className="font-bold text-primary">{msg.name}</h4>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Building2 size={12} />
                <span>{msg.institution}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock size={12} />
                <span>{msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString() : 'Now'}</span>
              </div>
            </div>

            <div className="flex-1 bg-slate-50 p-6 rounded-2xl border border-slate-100 italic text-slate-600 text-sm">
              &quot;{msg.message}&quot;
              <div className="mt-4 flex flex-wrap gap-2 not-italic">
                <span className="px-2 py-1 bg-secondary/10 text-secondary rounded text-[10px] font-bold uppercase">{msg.servicesInterested}</span>
                <span className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-[10px] font-bold">{msg.email}</span>
                <span className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-[10px] font-bold">{msg.phone}</span>
              </div>
            </div>

            <div className="flex md:flex-col gap-2">
              {msg.status === 'new' && (
                <button 
                  onClick={() => markAsRead(msg.id)}
                  className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                  title="Mark as Read"
                >
                  <CheckCircle size={20} />
                </button>
              )}
              <button 
                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                title="Delete Message"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="p-20 text-center text-slate-400 font-medium bg-white rounded-3xl border border-slate-200">
            No messages found.
          </div>
        )}
      </div>
    </div>
  );
}
