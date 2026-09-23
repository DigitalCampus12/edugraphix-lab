'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useCompanyContact } from '@/hooks/use-company-profile';

export default function ContactForm() {
  const { contact } = useCompanyContact();
  
  const email = contact?.email || 'edugraphixlab@gmail.com';
  const phone = contact?.phone1 || '+91 8528581471';
  const location = contact?.location || 'Ghazipur, Uttar Pradesh, India';

  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    phone: '',
    email: '',
    city: '',
    servicesInterested: 'Website',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'new'
      }).catch(err => handleFirestoreError(err, OperationType.CREATE, 'contactMessages'));

      setStatus('success');
      setFormData({
        name: '',
        institution: '',
        phone: '',
        email: '',
        city: '',
        servicesInterested: 'Website',
        message: ''
      });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section className="py-24 px-6" id="contact">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-8">Let&apos;s Build Your <span className="text-secondary">Digital Future.</span></h2>
            <p className="text-lg text-slate-600 mb-12 max-w-lg">
              Have questions? Our team is here to help you transform your institution&apos;s digital presence.
            </p>

            <div className="space-y-8">
              <ContactInfoItem icon={<Phone className="text-secondary" />} title="Call Us" detail={phone} />
              <ContactInfoItem icon={<Mail className="text-secondary" />} title="Email Us" detail={email} />
              <ContactInfoItem icon={<MapPin className="text-secondary" />} title="Our Location" detail={location} />
            </div>

            <div className="mt-12 p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <h4 className="font-bold text-primary mb-4">Quick WhatsApp Connect</h4>
              <a 
                href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Hello%20EduGraphix%20Lab,%20I%20am%20interested%20in%20digital%20solutions%20for%20my%20school.`}
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
              <p className="text-[10px] text-slate-400 mt-4 leading-tight italic">
                * Automatic WhatsApp messaging requires approved WhatsApp Business API integration for schools.
              </p>
            </div>
          </div>

          <div className="premium-card p-8 md:p-12">
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Enquiry Received!</h3>
                <p className="text-slate-500 mb-8">Thank you. Your enquiry has been received. Our team will contact you soon.</p>
                <button onClick={() => setStatus('idle')} className="btn-outline">Send Another Message</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="Name" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} required />
                  <FormInput label="School / Institution" value={formData.institution} onChange={(v) => setFormData({...formData, institution: v})} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="Phone" type="tel" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} required />
                  <FormInput label="Email" type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} required />
                </div>
                <FormInput label="City" value={formData.city} onChange={(v) => setFormData({...formData, city: v})} required />
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Services Interested In</label>
                  <select 
                    value={formData.servicesInterested}
                    onChange={(e) => setFormData({...formData, servicesInterested: e.target.value})}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:border-secondary transition-colors appearance-none"
                  >
                    <option value="Website">Website</option>
                    <option value="Automation">Automation</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Complete Digital Solution">Complete Digital Solution</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Message</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:border-secondary transition-colors"
                    placeholder="How can we help you?"
                  />
                </div>

                <button 
                  disabled={status === 'submitting'}
                  className="btn-primary w-full py-4 text-lg"
                >
                  {status === 'submitting' ? 'Sending...' : 'Send Enquiry'}
                  <Send size={18} />
                </button>

                {status === 'error' && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm">
                    <AlertCircle size={16} />
                    Failed to send message. Please try again.
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FormInput({ label, value, onChange, required, type = "text" }: { label: string, value: string, onChange: (v: string) => void, required?: boolean, type?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:border-secondary transition-colors"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}

function ContactInfoItem({ icon, title, detail }: { icon: React.ReactNode, title: string, detail: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-primary">{title}</h4>
        <p className="text-slate-500">{detail}</p>
      </div>
    </div>
  );
}
