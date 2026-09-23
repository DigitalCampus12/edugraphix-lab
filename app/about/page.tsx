'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Target, Users, Shield, Lightbulb, Mail, Linkedin, Camera } from 'lucide-react';
import { useFounders, useCompanyPhotos, Founder } from '@/hooks/use-company-profile';
import { motion } from 'motion/react';
import Image from 'next/image';

export default function AboutPage() {
  const { founders, loading: foundersLoading } = useFounders();
  const { photos, loading: photosLoading } = useCompanyPhotos();

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Header */}
      <section className="pt-40 pb-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-primary">About EduGraphix Lab</h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            EduGraphix Lab is a digital transformation and creative technology company focused on Schools, Colleges, Coaching Institutes, and Educational Institutions.
          </p>
        </div>
      </section>

      {/* Brand Statement */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="premium-card bg-primary text-white p-12 md:p-20 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full" />
            <h2 className="text-3xl md:text-5xl font-extrabold mb-8 relative z-10">
              &quot;We don&apos;t just build school websites. We help educational institutions build a better digital ecosystem.&quot;
            </h2>
            <div className="flex justify-center gap-4 relative z-10 font-bold tracking-widest text-accent">
              <span>CREATE</span>
              <span>•</span>
              <span>BUILD</span>
              <span>•</span>
              <span>AUTOMATE</span>
              <span>•</span>
              <span>GROW</span>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-primary mb-4 italic tracking-tight">Meet the Minds Behind EduGraphix Lab</h2>
            <p className="text-lg text-slate-500 font-medium">Two minds. One vision — simplifying digital transformation for education.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {foundersLoading ? (
              [1, 2].map(i => <div key={i} className="h-96 bg-slate-100 rounded-3xl animate-pulse" />)
            ) : founders.length > 0 ? (
              founders.map(founder => (
                <FounderCard key={founder.id} founder={founder} />
              ))
            ) : (
              <div className="col-span-full text-center text-slate-400 py-12">
                Profiles are being updated. Check back soon.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {photos.length > 0 && (
        <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Camera size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-primary italic">Life at EduGraphix Lab</h2>
                <p className="text-slate-500 font-medium">Capturing our team, culture, and workspace.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map(photo => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg"
                >
                  <img 
                    src={photo.photoUrl} 
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <span className="text-[10px] font-black text-accent uppercase tracking-widest mb-2">{photo.category}</span>
                    <h4 className="text-xl font-bold text-white mb-2">{photo.title}</h4>
                    <p className="text-white/70 text-sm line-clamp-2">{photo.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ValueCard 
            icon={<Target className="text-secondary" />} 
            title="Our Mission" 
            desc="To empower educational institutions with cutting-edge digital tools that simplify operations and enhance communication." 
          />
          <ValueCard 
            icon={<Users className="text-secondary" />} 
            title="Our Focus" 
            desc="Exclusively serving Schools, Colleges, and Coaching Institutes with tailored digital transformation strategies." 
          />
          <ValueCard 
            icon={<Shield className="text-secondary" />} 
            title="Trust & Quality" 
            desc="Delivering premium, professional, and trustworthy digital solutions that institutions can rely on for long-term growth." 
          />
          <ValueCard 
            icon={<Lightbulb className="text-secondary" />} 
            title="Innovation" 
            desc="Bridging the gap between traditional education management and modern creative technology." 
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}

function FounderCard({ founder }: { founder: Founder }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="premium-card p-0 overflow-hidden bg-slate-50 border-slate-100 h-full flex flex-col">
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-200">
          {founder.photoUrl ? (
            <img 
              src={founder.photoUrl} 
              alt={founder.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <Users size={64} />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-primary/90 to-transparent">
            <h3 className="text-3xl font-black text-white italic">{founder.name}</h3>
            <p className="text-accent font-bold tracking-widest text-sm uppercase">{founder.designation}</p>
          </div>
        </div>
        
        <div className="p-8 flex-1 flex flex-col">
          <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">
            &quot;{founder.bio || "Leading the charge in educational digital transformation."}&quot;
          </p>
          
          <div className="mb-6">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {founder.expertise.map(exp => (
                <span key={exp} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500">
                  {exp}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-auto pt-6 border-t border-slate-200 flex items-center gap-4">
            {founder.linkedin && (
              <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-lg text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                <Linkedin size={18} />
              </a>
            )}
            {founder.email && (
              <a href={`mailto:${founder.email}`} className="p-2 bg-white rounded-lg text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                <Mail size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="premium-card p-8 h-full">
      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
