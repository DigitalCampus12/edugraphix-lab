import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Cpu, MessageSquare, Repeat, Bot, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const automationFlows = [
  { 
    title: "WhatsApp Admission Bot", 
    desc: "Automatically handle common enquiries and capture leads via WhatsApp 24/7.",
    icon: <MessageSquare />
  },
  { 
    title: "Follow-up Workflows", 
    desc: "Systematic reminders for pending admissions to improve conversion rates.",
    icon: <Repeat />
  },
  { 
    title: "Admin Automation", 
    desc: "Automate certificates, ID cards, and report card generation from Excel/CSV.",
    icon: <Cpu />
  }
];

export default function AutomationSolutionsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-40 pb-24 px-6 bg-primary text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary via-transparent to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="text-secondary font-black tracking-widest text-xs uppercase mb-6 block">EFFICIENCY THROUGH TECH</span>
          <h1 className="text-4xl md:text-7xl font-extrabold mb-8 leading-tight">
            Automate Your <span className="text-secondary">School Admin.</span>
          </h1>
          <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            Eliminate manual errors and save hundreds of hours every month by automating repetitive administrative and communication tasks.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/contact" className="btn-secondary px-10">Request a Demo</Link>
            <Link href="/audit" className="border-2 border-white/20 text-white px-10 py-4 rounded-full font-bold hover:bg-white/5 transition-all">
              Digital Readiness Audit
            </Link>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {automationFlows.map((flow, i) => (
            <div key={i} className="premium-card p-10 border-t-4 border-t-secondary">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-8">
                {React.isValidElement(flow.icon) ? React.cloneElement(flow.icon as React.ReactElement<any>, { size: 32 }) : flow.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary">{flow.title}</h3>
              <p className="text-slate-500 leading-relaxed mb-8">{flow.desc}</p>
              <div className="flex items-center gap-2 text-secondary font-bold text-sm">
                Explore Workflow <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WhatsApp Automation Deep Dive */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col lg:row gap-20 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-primary">The Power of WhatsApp Automation.</h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Parents today prefer instant communication. Our WhatsApp bots handle initial enquiries, share prospectus links, and collect lead details while your team focuses on final admissions.
            </p>
            <div className="space-y-4">
              {[
                "Instant Auto-Response to Enquiries",
                "Automated Prospectus Sharing",
                "Meeting/Campus Tour Scheduling",
                "Payment Reminders for Existing Parents"
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500" size={20} />
                  <span className="font-bold text-primary">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-12">
              <Link href="/contact" className="btn-primary inline-flex">Setup My School Bot</Link>
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="max-w-sm mx-auto aspect-[9/19] bg-primary rounded-[50px] shadow-2xl p-4 border-[8px] border-slate-800">
              <div className="w-full h-full bg-slate-100 rounded-[36px] overflow-hidden flex flex-col">
                <div className="bg-emerald-600 p-4 text-white text-sm font-bold">EduGraphix Bot</div>
                <div className="flex-1 p-4 space-y-4">
                  <div className="bg-white p-3 rounded-2xl text-xs shadow-sm max-w-[80%]">Hi! How can I help you today?</div>
                  <div className="bg-emerald-100 p-3 rounded-2xl text-xs shadow-sm max-w-[80%] ml-auto">I want to know about admissions.</div>
                  <div className="bg-white p-3 rounded-2xl text-xs shadow-sm max-w-[80%] italic">Sure! Here is our 2025 Prospectus...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
