'use client';

import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Settings, Trash2, Edit2, CheckCircle, XCircle, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = ['CREATE', 'BUILD', 'AUTOMATE', 'GROW'];

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'CREATE',
    description: '',
    icon: 'LayoutGrid',
    active: true,
    displayOrder: 0
  });

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('displayOrder', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'services'));

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await updateDoc(doc(db, 'services', editingService.id), formData);
      } else {
        await addDoc(collection(db, 'services'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
      setEditingService(null);
      setFormData({ title: '', category: 'CREATE', description: '', icon: 'LayoutGrid', active: true, displayOrder: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteService = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      await deleteDoc(doc(db, 'services', id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary">Manage Services</h1>
          <p className="text-slate-500">Add or edit the services displayed on your website.</p>
        </div>
        <button 
          onClick={() => { setEditingService(null); setFormData({ title: '', category: 'CREATE', description: '', icon: 'LayoutGrid', active: true, displayOrder: 0 }); setIsModalOpen(true); }}
          className="btn-primary"
        >
          <Plus size={20} /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="premium-card relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-xl text-primary">
                <LayoutGrid size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingService(service); setFormData(service); setIsModalOpen(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => deleteService(service.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">{service.title}</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-widest">{service.category}</span>
              {service.active ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500"><CheckCircle size={10} /> Active</span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><XCircle size={10} /> Hidden</span>
              )}
            </div>
            <p className="text-sm text-slate-500 line-clamp-3">{service.description}</p>
          </div>
        ))}
      </div>

      {/* Modal Placeholder - Logic is here but UI simplified for brief */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
            <h2 className="text-2xl font-black text-primary mb-6">{editingService ? 'Edit Service' : 'Add New Service'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                placeholder="Service Title" 
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
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea 
                placeholder="Description" 
                rows={4}
                className="w-full p-4 bg-slate-50 border rounded-xl outline-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
