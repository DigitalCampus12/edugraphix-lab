'use client';

import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Image as ImageIcon, Trash2, Edit2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminPortfolioPage() {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'School Website',
    clientName: '',
    imageUrl: '',
    projectUrl: '',
    description: '',
    featured: false
  });

  useEffect(() => {
    const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPortfolio(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'portfolio'));

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateDoc(doc(db, 'portfolio', editingItem.id), formData);
      } else {
        await addDoc(collection(db, 'portfolio'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ title: '', category: 'School Website', clientName: '', imageUrl: '', projectUrl: '', description: '', featured: false });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this portfolio item?')) {
      await deleteDoc(doc(db, 'portfolio', id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary">Manage Portfolio</h1>
          <p className="text-slate-500">Showcase your best school digital transformation projects.</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setFormData({ title: '', category: 'School Website', clientName: '', imageUrl: '', projectUrl: '', description: '', featured: false }); setIsModalOpen(true); }}
          className="btn-primary"
        >
          <Plus size={20} /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portfolio.map((item) => (
          <div key={item.id} className="premium-card overflow-hidden p-0 group">
            <div className="aspect-video bg-slate-100 relative flex items-center justify-center text-slate-300">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={48} />
              )}
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button onClick={() => { setEditingItem(item); setFormData(item); setIsModalOpen(true); }} className="p-3 bg-white text-primary rounded-xl hover:scale-110 transition-transform">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => deleteItem(item.id)} className="p-3 bg-red-500 text-white rounded-xl hover:scale-110 transition-transform">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{item.category}</span>
              <h3 className="text-lg font-bold text-primary mt-1 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">{item.description}</p>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>{item.clientName}</span>
                {item.projectUrl && <ExternalLink size={14} />}
              </div>
            </div>
          </div>
        ))}
        {portfolio.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300 text-slate-400">
            No portfolio projects added yet.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-black text-primary mb-6">{editingItem ? 'Edit Project' : 'Add Portfolio Project'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Project Title" 
                  className="w-full p-4 bg-slate-50 border rounded-xl outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
                <select 
                  className="w-full p-4 bg-slate-50 border rounded-xl outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>School Website</option>
                  <option>Graphic Design</option>
                  <option>Automation</option>
                  <option>Digital Growth</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Client Name" 
                  className="w-full p-4 bg-slate-50 border rounded-xl outline-none"
                  value={formData.clientName}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Image URL" 
                  className="w-full p-4 bg-slate-50 border rounded-xl outline-none"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Project URL" 
                  className="w-full p-4 bg-slate-50 border rounded-xl outline-none"
                  value={formData.projectUrl}
                  onChange={(e) => setFormData({...formData, projectUrl: e.target.value})}
                />
                <div className="flex items-center gap-3 p-4">
                  <input 
                    type="checkbox" 
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="w-5 h-5 rounded"
                  />
                  <label htmlFor="featured" className="text-sm font-bold text-slate-600">Featured Project</label>
                </div>
              </div>
              <div className="col-span-full">
                <textarea 
                  placeholder="Description" 
                  rows={4}
                  className="w-full p-4 bg-slate-50 border rounded-xl outline-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              <div className="col-span-full flex gap-4 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
