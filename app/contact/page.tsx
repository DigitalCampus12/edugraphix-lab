'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useCompanyContact } from '@/hooks/use-company-profile';

export default function ContactPage() {
  const { contact } = useCompanyContact();
  
  const email = contact?.email || 'edugraphixlab@gmail.com';
  const phone1 = contact?.phone1 || '+91 8528581471';
  const phone2 = contact?.phone2 || '+91 7237026327';
  const location = contact?.location || 'Ghazipur, Uttar Pradesh, India';

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="pt-40 pb-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-primary">Get in Touch</h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Ready to transform your school&apos;s digital presence? Our team is waiting to help you build your digital ecosystem.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ContactInfoCard 
            icon={<Phone className="text-secondary" />} 
            title="Call Us" 
            value={phone1} 
            sub={phone2 || "Mon-Sat, 9am-6pm"}
            href={`tel:${phone1}`}
          />
          <ContactInfoCard 
            icon={<Mail className="text-secondary" />} 
            title="Email Us" 
            value={email} 
            sub="24/7 Online Support"
            href={`mailto:${email}`}
          />
          <ContactInfoCard 
            icon={<MapPin className="text-secondary" />} 
            title="Visit Us" 
            value={location} 
            sub="India"
            href={contact?.websiteUrl || "#"}
          />
          <ContactInfoCard 
            icon={<Clock className="text-secondary" />} 
            title="Availability" 
            value="Active & Growing" 
            sub="Always Online"
          />
        </div>
      </section>

      <ContactForm />

      <Footer />
    </main>
  );
}

function ContactInfoCard({ icon, title, value, sub, href }: { icon: React.ReactNode, title: string, value: string, sub: string, href?: string }) {
  const CardContent = (
    <div className="premium-card text-center p-8 h-full">
      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</h3>
      <div className="text-lg font-bold text-primary mb-1 break-words">{value}</div>
      <div className="text-xs text-slate-400">{sub}</div>
    </div>
  );

  if (href && href !== "#") {
    return (
      <a href={href} className="block hover:scale-[1.02] transition-transform">
        {CardContent}
      </a>
    );
  }

  return CardContent;
}
