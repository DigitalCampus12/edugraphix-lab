'use client';

import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Lightbulb, Trash2, Edit2, TrendingUp, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminInsightsPage() {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInsight, setEditingInsight] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    source: '',
    year: new Date().getFullYear().toString(),
    category: 'Market Trends',
    impact: 'High'
  });

  useEffect(() => {
    const q = query(collection(db, 'insights'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setInsights(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'insights'));

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingInsight) {
        await updateDoc(doc(db, 'insights', editingInsight.id), formData);
      } else {
        await addDoc(collection(db, 'insights'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
      setEditingInsight(null);
      setFormData({ title: '', description: '', source: '', year: new Date().getFullYear().toString(), category: 'Market Trends', impact: 'High' });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteInsight = async (id: string) => {
    if (confirm('Are you sure you want to delete this insight?')) {
      await deleteDoc(doc(db, 'insights', id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary">Data & Insights</h1>
          <p className="text-slate-500">Manage research-based insights and market trends.</p>
        </div>
        <button 
          onClick={() => { setEditingInsight(null); setFormData({ title: '', description: '', source: '', year: new Date().getFullYear().toString(), category: 'Market Trends', impact: 'High' }); setIsModalOpen(true); }}
          className="btn-primary"
        >
          <Plus size={20} /> Add Insight
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {insights.map((insight) => (
          <div key={insight.id} className="premium-card flex flex-col md:flex-row gap-8 items-start relative group">
            <div className="w-full md:w-1/4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <Lightbulb size={20} />
                </div>
                <h4 className="font-bold text-primary">{insight.category}</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <BookOpen size={14} /> SOURCE: {insight.source}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <TrendingUp size={14} /> IMPACT: <span className="text-secondary">{insight.impact}</span>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-primary mb-3">{insight.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{insight.description}</p>
            </div>

            <div className="flex md:flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setEditingInsight(insight); setFormData(insight); setIsModalOpen(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                <Edit2 size={18} />
              </button>
              <button onClick={() => deleteInsight(insight.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-8 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-black text-primary mb-6">{editingInsight ? 'Edit Insight' : 'Add Insight Data'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                placeholder="Insight Title" 
                className="w-full p-4 bg-slate-50 border rounded-xl outline-none"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Source (e.g. UDISE+)" 
                  className="p-4 bg-slate-50 border rounded-xl outline-none"
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Year" 
                  className="p-4 bg-slate-50 border rounded-xl outline-none"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="p-4 bg-slate-50 border rounded-xl outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>Market Trends</option>
                  <option>Tech Adoption</option>
                  <option>Parent Engagement</option>
                  <option>Academic Tech</option>
                </select>
                <select 
                  className="p-4 bg-slate-50 border rounded-xl outline-none"
                  value={formData.impact}
                  onChange={(e) => setFormData({...formData, impact: e.target.value})}
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Emerging</option>
                </select>
              </div>
              <textarea 
                placeholder="Detailed Insight Description" 
                rows={4}
                className="w-full p-4 bg-slate-50 border rounded-xl outline-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Save Insight</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
