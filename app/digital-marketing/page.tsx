import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Target, TrendingUp, Search, Share2, BarChart3, Users, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const marketingServices = [
  { 
    title: "School SEO & Local Search", 
    desc: "Be the first choice when parents search for 'Best schools in [Your City]'.",
    icon: <Search />
  },
  { 
    title: "Targeted Admission Ads", 
    desc: "Reach prospective parents on Google, Meta, and Instagram during admission season.",
    icon: <Target />
  },
  { 
    title: "Social Media Identity", 
    desc: "Professional management of your institutional social media presence.",
    icon: <Share2 />
  }
];

export default function DigitalMarketingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-40 pb-24 px-6 bg-slate-50 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-secondary font-black tracking-widest text-xs uppercase mb-4 block">GROW YOUR INSTITUTION</span>
            <h1 className="text-4xl md:text-7xl font-extrabold mb-8 text-primary leading-tight">
              Data-Driven <span className="text-secondary">School Growth.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              We help educational institutions improve their online visibility and build a stronger brand through specialized digital marketing strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="btn-primary px-10">Scale Admissions</Link>
              <Link href="/audit" className="border-2 border-primary/10 px-10 py-4 rounded-full font-bold text-primary hover:bg-primary/5 transition-all">
                Free Digital Audit
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <div className="font-bold text-primary">Admission Growth Track</div>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">+42% Growth</div>
              </div>
              <div className="h-64 flex items-end gap-3 px-4">
                {[40, 60, 45, 80, 55, 90, 75, 95].map((h, i) => (
                  <div key={i} className="flex-1 bg-slate-100 rounded-t-lg group relative cursor-pointer">
                    <div className="absolute bottom-0 w-full bg-secondary rounded-t-lg transition-all" style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {marketingServices.map((service, i) => (
            <div key={i} className="p-10 rounded-3xl border border-slate-100 hover:border-secondary transition-colors group">
              <div className="w-16 h-16 bg-slate-50 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-secondary group-hover:text-white transition-colors">
                {React.isValidElement(service.icon) ? React.cloneElement(service.icon as React.ReactElement<any>, { size: 32 }) : service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary">{service.title}</h3>
              <p className="text-slate-500 leading-relaxed mb-8">{service.desc}</p>
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                Learn More <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Performance Marketing */}
      <section className="py-32 px-6 bg-bg-light">
        <div className="max-w-7xl mx-auto">
          <div className="premium-card bg-primary text-white p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="max-w-3xl relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-8">Performance Marketing That Delivers Real Enquiries.</h2>
              <p className="text-xl text-white/70 mb-10 leading-relaxed">
                We don&apos;t just run ads; we build complete funnels that qualify leads before they ever reach your admission desk.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                <div className="space-y-2">
                  <div className="text-3xl font-black text-secondary">3:1</div>
                  <div className="text-sm font-bold text-white/50 uppercase tracking-widest">Average ROI</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-black text-secondary">10k+</div>
                  <div className="text-sm font-bold text-white/50 uppercase tracking-widest">Leads Generated</div>
                </div>
              </div>
              <Link href="/contact" className="btn-secondary px-10">Build My Growth Funnel</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
