'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Laptop, MessageSquare, Repeat, BarChart3, Users, Building2 } from 'lucide-react';

const flowSteps = [
  { icon: <Building2 className="w-6 h-6" />, label: 'SCHOOL', color: 'bg-primary' },
  { icon: <Laptop className="w-6 h-6" />, label: 'WEBSITE', color: 'bg-secondary' },
  { icon: <Users className="w-6 h-6" />, label: 'ENQUIRY', color: 'bg-accent' },
  { icon: <MessageSquare className="w-6 h-6" />, label: 'COMMUNICATION', color: 'bg-primary' },
  { icon: <Repeat className="w-6 h-6" />, label: 'AUTOMATION', color: 'bg-secondary' },
  { icon: <BarChart3 className="w-6 h-6" />, label: 'ANALYTICS', color: 'bg-accent' },
];

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-secondary/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-accent/5 blur-[100px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-bold text-xs tracking-wider uppercase mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            Complete Digital Solutions for Schools
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6">
            Transform Your School Into a <span className="text-secondary">Smarter Digital Ecosystem.</span>
          </h1>
          
          <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
            From professional websites and creative branding to automation, digital communication and growth solutions — EduGraphix Lab helps educational institutions build a stronger digital presence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/services" className="btn-primary group">
              Explore Our Solutions
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/audit" className="btn-outline">
              Get a Free Digital Audit
            </Link>
          </div>
        </motion.div>

        {/* Animated Visual Flow */}
        <div className="relative hidden lg:block">
          <div className="premium-card p-12 relative overflow-hidden bg-slate-50/50">
            <div className="grid grid-cols-2 gap-8 relative z-10">
              {flowSteps.map((step, index) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg",
                    step.color
                  )}>
                    {step.icon}
                  </div>
                  <span className="text-[10px] font-bold tracking-tighter text-primary/60">{step.label}</span>
                </motion.div>
              ))}

              {/* Connecting Lines (Simulated with SVG) */}
              <svg className="absolute inset-0 w-full h-full -z-10 opacity-20" viewBox="0 0 400 300">
                <motion.path
                  d="M100 80 L300 80 L300 150 L100 150 L100 220 L300 220"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </svg>
            </div>
            
            {/* SaaS Dashboard Elements */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 rotate-6 opacity-80">
              <div className="h-2 w-12 bg-slate-100 rounded mb-3" />
              <div className="h-24 w-full bg-slate-50 rounded mb-2" />
              <div className="flex gap-2">
                <div className="h-6 w-6 rounded-full bg-secondary/20" />
                <div className="h-6 w-6 rounded-full bg-accent/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
