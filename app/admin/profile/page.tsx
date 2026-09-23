'use client';

import React, { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { 
  Save, 
  Plus, 
  Trash2, 
  Upload, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  CheckCircle2, 
  Loader2,
  Linkedin,
  Info,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompanyContact {
  companyName: string;
  tagline: string;
  phone1: string;
  phone2: string;
  email: string;
  location: string;
  whatsapp: string;
  websiteUrl: string;
}

interface Founder {
  id: string;
  name: string;
  designation: string;
  bio: string;
  expertise: string[];
  photoUrl: string;
  linkedin: string;
  email: string;
  published: boolean;
  displayOrder: number;
}

export default function ProfileAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Contact Info State
  const [contact, setContact] = useState<CompanyContact>({
    companyName: 'EduGraphix Lab',
    tagline: 'Empowering Schools with Digital Creativity',
    phone1: '+91 8528581471',
    phone2: '+91 7237026327',
    email: 'edugraphixlab@gmail.com',
    location: 'Ghazipur, Uttar Pradesh, India',
    whatsapp: '+91 8528581471',
    websiteUrl: 'https://edugraphixlab.com'
  });

  // Founders State
  const [founders, setFounders] = useState<Founder[]>([]);
  const [isAddingFounder, setIsAddingFounder] = useState(false);
  const [newFounder, setNewFounder] = useState<Partial<Founder>>({
    name: '',
    designation: '',
    bio: '',
    expertise: [],
    published: true,
    displayOrder: 10
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // Fetch Contact
      const contactDoc = await getDoc(doc(db, 'companyProfile', 'contact'));
      if (contactDoc.exists()) {
        setContact(contactDoc.data() as CompanyContact);
      }

      // Fetch Founders
      const foundersQuery = query(collection(db, 'founders'), orderBy('displayOrder', 'asc'));
      const foundersSnapshot = await getDocs(foundersQuery);
      const foundersData = foundersSnapshot.docs.map(doc => {
        const d = doc.data();
        return { 
          id: doc.id, 
          ...d,
          expertise: Array.isArray(d.expertise) ? d.expertise : []
        } as Founder;
      });
      setFounders(foundersData);
    } catch (err) {
      console.error("Error fetching profile data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function saveContact() {
    setSaving(true);
    setMessage(null);
    try {
      await setDoc(doc(db, 'companyProfile', 'contact'), contact);
      setMessage({ type: 'success', text: 'Contact information saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save contact information.' });
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>, founderId?: string) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    try {
      const storageRef = ref(storage, `founders/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);

      if (founderId) {
        // Update existing founder
        const founder = founders.find(f => f.id === founderId);
        if (founder?.photoUrl) {
          // Delete old photo if exists
          try {
            const oldRef = ref(storage, founder.photoUrl);
            await deleteObject(oldRef);
          } catch (e) {
            console.warn("Could not delete old photo:", e);
          }
        }
        await updateDoc(doc(db, 'founders', founderId), { photoUrl: url });
        setFounders(prev => prev.map(f => f.id === founderId ? { ...f, photoUrl: url } : f));
      } else {
        // Update new founder state
        setNewFounder(prev => ({ ...prev, photoUrl: url }));
      }
      setMessage({ type: 'success', text: 'Photo uploaded successfully!' });
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage({ type: 'error', text: 'Failed to upload photo.' });
    } finally {
      setSaving(false);
    }
  }

  async function addFounder() {
    if (!newFounder.name || !newFounder.designation) {
      setMessage({ type: 'error', text: 'Name and Designation are required.' });
      return;
    }

    setSaving(true);
    try {
      const docRef = await addDoc(collection(db, 'founders'), newFounder);
      const addedFounder = { id: docRef.id, ...newFounder } as Founder;
      setFounders(prev => [...prev, addedFounder].sort((a, b) => a.displayOrder - b.displayOrder));
      setIsAddingFounder(false);
      setNewFounder({
        name: '',
        designation: '',
        bio: '',
        expertise: [],
        published: true,
        displayOrder: 10
      });
      setMessage({ type: 'success', text: 'Founder added successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add founder.' });
    } finally {
      setSaving(false);
    }
  }

  async function deleteFounder(id: string, photoUrl?: string) {
    if (!confirm('Are you sure you want to remove this profile?')) return;

    setSaving(true);
    try {
      await deleteDoc(doc(db, 'founders', id));
      if (photoUrl) {
        try {
          const oldRef = ref(storage, photoUrl);
          await deleteObject(oldRef);
        } catch (e) {
          console.warn("Could not delete photo:", e);
        }
      }
      setFounders(prev => prev.filter(f => f.id !== id));
      setMessage({ type: 'success', text: 'Profile removed successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to remove profile.' });
    } finally {
      setSaving(false);
    }
  }

  const updateTimeouts = React.useRef<{ [key: string]: NodeJS.Timeout }>({});

  async function updateFounderField(id: string, field: keyof Founder, value: any) {
    // Update local state immediately for snappy UI
    setFounders(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f));
    
    // Clear existing timeout for this specific founder+field combo if it exists
    const timeoutKey = `${id}-${field}`;
    if (updateTimeouts.current[timeoutKey]) {
      clearTimeout(updateTimeouts.current[timeoutKey]);
    }

    // Set a new timeout
    updateTimeouts.current[timeoutKey] = setTimeout(async () => {
      try {
        setSaving(true);
        await updateDoc(doc(db, 'founders', id), { [field]: value });
        setSaving(false);
      } catch (err) {
        console.error("Update failed:", err);
        setSaving(false);
        setMessage({ type: 'error', text: 'Failed to sync changes with server.' });
      } finally {
        delete updateTimeouts.current[timeoutKey];
      }
    }, 1000);
  }

  const [expertiseInput, setExpertiseInput] = useState<{ [key: string]: string }>({});

  const handleAddExpertise = (founderId: string) => {
    const input = expertiseInput[founderId];
    if (!input) return;

    const founder = founders.find(f => f.id === founderId);
    if (!founder) return;

    const newExpertise = [...(founder.expertise || []), input];
    updateFounderField(founderId, 'expertise', newExpertise);
    setExpertiseInput({ ...expertiseInput, [founderId]: '' });
  };

  const handleRemoveExpertise = (founderId: string, expToRemove: string) => {
    const founder = founders.find(f => f.id === founderId);
    if (!founder) return;

    const newExpertise = (founder.expertise || []).filter(e => e !== expToRemove);
    updateFounderField(founderId, 'expertise', newExpertise);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-slate-500 font-medium">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-primary italic">Company Profile</h1>
          <p className="text-slate-500 font-medium">Manage your institution&apos;s contact details and leadership profiles.</p>
        </div>
        {saving && (
          <div className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
            <Loader2 className="animate-spin" size={16} />
            Saving Changes...
          </div>
        )}
      </div>

      {message && (
        <div className={cn(
          "p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4",
          message.type === 'success' ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
        )}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <Info size={20} />}
          <span className="font-bold">{message.text}</span>
        </div>
      )}

      {/* Contact Info Section */}
      <section className="premium-card p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Building2 size={20} />
          </div>
          <h2 className="text-xl font-bold">Contact Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FormInput 
              label="Company Name" 
              icon={<Building2 size={16} />} 
              value={contact.companyName} 
              onChange={v => setContact({...contact, companyName: v})} 
            />
            <FormInput 
              label="Tagline" 
              icon={<Info size={16} />} 
              value={contact.tagline} 
              onChange={v => setContact({...contact, tagline: v})} 
            />
            <FormInput 
              label="Primary Phone" 
              icon={<Phone size={16} />} 
              value={contact.phone1} 
              onChange={v => setContact({...contact, phone1: v})} 
            />
            <FormInput 
              label="Secondary Phone" 
              icon={<Phone size={16} />} 
              value={contact.phone2} 
              onChange={v => setContact({...contact, phone2: v})} 
            />
          </div>
          <div className="space-y-6">
            <FormInput 
              label="Email Address" 
              icon={<Mail size={16} />} 
              value={contact.email} 
              onChange={v => setContact({...contact, email: v})} 
            />
            <FormInput 
              label="WhatsApp Number" 
              icon={<MessageSquare size={16} />} 
              value={contact.whatsapp} 
              onChange={v => setContact({...contact, whatsapp: v})} 
            />
            <FormInput 
              label="Website URL" 
              icon={<Globe size={16} />} 
              value={contact.websiteUrl} 
              onChange={v => setContact({...contact, websiteUrl: v})} 
            />
            <FormInput 
              label="Office Location" 
              icon={<MapPin size={16} />} 
              value={contact.location} 
              onChange={v => setContact({...contact, location: v})} 
            />
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
          <button 
            onClick={saveContact}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            <Save size={20} />
            Save Contact Details
          </button>
        </div>
      </section>

      {/* Founders Section */}
      <section className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
              <User size={20} />
            </div>
            <h2 className="text-xl font-bold">Founder & Co-Founder Profiles</h2>
          </div>
          <button 
            onClick={() => setIsAddingFounder(true)}
            className="bg-secondary text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20"
          >
            <Plus size={20} />
            Add Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {founders.map((founder) => (
            <div key={founder.id} className="premium-card p-0 overflow-hidden group">
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Photo Column */}
                <div className="relative aspect-square md:aspect-auto bg-slate-100 group-hover:bg-slate-200 transition-colors">
                  {founder.photoUrl ? (
                    <img 
                      src={founder.photoUrl} 
                      alt={founder.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <User size={48} />
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer gap-2 backdrop-blur-sm">
                    <Upload size={24} />
                    <span className="text-xs font-bold uppercase tracking-widest">Change Photo</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => handlePhotoUpload(e, founder.id)}
                    />
                  </label>
                </div>

                {/* Info Column */}
                <div className="md:col-span-2 p-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <input 
                      className="text-xl font-black text-primary italic bg-transparent border-b border-transparent focus:border-primary/20 outline-none w-full mr-4"
                      value={founder.name}
                      onChange={e => updateFounderField(founder.id, 'name', e.target.value)}
                    />
                    <button 
                      onClick={() => deleteFounder(founder.id, founder.photoUrl)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <input 
                    className="text-xs font-bold text-secondary uppercase tracking-widest bg-transparent border-b border-transparent focus:border-secondary/20 outline-none w-full"
                    value={founder.designation}
                    onChange={e => updateFounderField(founder.id, 'designation', e.target.value)}
                  />

                  <textarea 
                    className="text-sm text-slate-500 leading-relaxed bg-transparent border border-transparent focus:border-slate-200 rounded-lg p-2 w-full outline-none resize-none h-24"
                    value={founder.bio}
                    onChange={e => updateFounderField(founder.id, 'bio', e.target.value)}
                  />

                  {/* Expertise Management */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                      Expertise
                      <span className="text-primary/40 font-normal lowercase italic">Press Enter to add</span>
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {founder.expertise?.map((exp, i) => (
                        <span key={i} className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-full flex items-center gap-2 group/tag">
                          {exp}
                          <button 
                            onClick={() => handleRemoveExpertise(founder.id, exp)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="relative">
                      <input 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-[10px] outline-none focus:border-primary/20 transition-all"
                        placeholder="Add expertise (e.g. UX Design)"
                        value={expertiseInput[founder.id] || ''}
                        onChange={e => setExpertiseInput({ ...expertiseInput, [founder.id]: e.target.value })}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddExpertise(founder.id);
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 flex-1">
                      <Linkedin size={16} className="text-primary/40" />
                      <input 
                        className="text-[10px] text-slate-400 bg-transparent border-b border-transparent focus:border-primary/20 outline-none w-full"
                        placeholder="LinkedIn URL"
                        value={founder.linkedin}
                        onChange={e => updateFounderField(founder.id, 'linkedin', e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Order</span>
                        <input 
                          type="number"
                          className="w-12 text-center text-xs font-bold text-primary bg-slate-50 border border-slate-200 rounded p-1 outline-none"
                          value={founder.displayOrder}
                          onChange={e => updateFounderField(founder.id, 'displayOrder', parseInt(e.target.value))}
                        />
                      </div>
                      
                      <button 
                        onClick={() => updateFounderField(founder.id, 'published', !founder.published)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                          founder.published 
                            ? "bg-green-100 text-green-700 hover:bg-green-200" 
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        )}
                      >
                        {founder.published ? 'Published' : 'Draft'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isAddingFounder && (
            <div className="premium-card p-8 border-2 border-dashed border-secondary/30 bg-secondary/5 animate-in fade-in zoom-in-95">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-secondary">
                <Plus size={20} />
                New Profile
              </h3>
              
              <div className="space-y-6">
                <div className="flex gap-6 items-start">
                  <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 relative overflow-hidden shrink-0">
                    {newFounder.photoUrl ? (
                      <img src={newFounder.photoUrl} className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} />
                    )}
                    <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer">
                      <Upload size={20} />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e)} />
                    </label>
                  </div>
                  <div className="flex-1 space-y-4">
                    <FormInput 
                      label="Full Name" 
                      value={newFounder.name || ''} 
                      onChange={v => setNewFounder({...newFounder, name: v})} 
                    />
                    <FormInput 
                      label="Designation" 
                      value={newFounder.designation || ''} 
                      onChange={v => setNewFounder({...newFounder, designation: v})} 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Short Bio</label>
                  <textarea 
                    className="bg-white border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-secondary transition-colors resize-none h-32"
                    placeholder="Tell something about the founder..."
                    value={newFounder.bio}
                    onChange={e => setNewFounder({...newFounder, bio: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Expertise Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newFounder.expertise?.map((exp, i) => (
                      <span key={i} className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full flex items-center gap-2">
                        {exp}
                        <button 
                          onClick={() => setNewFounder({...newFounder, expertise: newFounder.expertise?.filter(e => e !== exp)})}
                          className="hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input 
                    className="bg-white border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-secondary transition-colors"
                    placeholder="Add expertise (Press Enter)"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget.value.trim();
                        if (input && !newFounder.expertise?.includes(input)) {
                          setNewFounder({
                            ...newFounder, 
                            expertise: [...(newFounder.expertise || []), input]
                          });
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={addFounder}
                    disabled={saving}
                    className="flex-1 bg-secondary text-white py-3 rounded-xl font-bold hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Create Profile
                  </button>
                  <button 
                    onClick={() => setIsAddingFounder(false)}
                    className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function FormInput({ label, value, onChange, icon, type = "text" }: { label: string, value: string, onChange: (v: string) => void, icon?: React.ReactNode, type?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm outline-none focus:border-primary focus:bg-white transition-all",
            icon ? "pl-12" : "px-4"
          )}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      </div>
    </div>
  );
}
