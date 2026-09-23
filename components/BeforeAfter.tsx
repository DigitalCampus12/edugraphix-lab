'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Phone, MessageSquare, Megaphone, BarChart, Globe, ClipboardCheck, Zap, Smartphone, CheckCircle2 } from 'lucide-react';

const beforeItems = [
  { icon: <FileText className="text-red-500" />, text: 'Paper Records' },
  { icon: <Phone className="text-red-500" />, text: 'Manual Enquiry Follow-up' },
  { icon: <MessageSquare className="text-red-500" />, text: 'Repeated Parent Questions' },
  { icon: <Megaphone className="text-red-500" />, text: 'Scattered Communication' },
  { icon: <BarChart className="text-red-500" />, text: 'Difficult Data Management' },
];

const afterItems = [
  { icon: <Globe className="text-secondary" />, text: 'Online Information' },
  { icon: <ClipboardCheck className="text-secondary" />, text: 'Digital Enquiry System' },
  { icon: <Zap className="text-secondary" />, text: 'Automated Workflows' },
  { icon: <Smartphone className="text-secondary" />, text: 'Organized Communication' },
  { icon: <CheckCircle2 className="text-secondary" />, text: 'Centralized Dashboard' },
];

export default function BeforeAfter() {
  const [isAfter, setIsAfter] = useState(false);

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Digital Transformation Impact</h2>
          <p className="text-slate-500">How EduGraphix Lab transforms traditional school workflows.</p>
        </div>

        <div className="bg-slate-50 rounded-3xl p-4 md:p-12">
          <div className="flex justify-center mb-12">
            <div className="bg-white p-1 rounded-full shadow-inner flex relative">
              <button
                onClick={() => setIsAfter(false)}
                className={`px-10 py-3 rounded-full font-bold transition-all relative z-10 ${!isAfter ? 'text-white' : 'text-slate-400'}`}
              >
                Traditional (Before)
              </button>
              <button
                onClick={() => setIsAfter(true)}
                className={`px-10 py-3 rounded-full font-bold transition-all relative z-10 ${isAfter ? 'text-white' : 'text-slate-400'}`}
              >
                EduGraphix (After)
              </button>
              <motion.div
                initial={false}
                animate={{ x: isAfter ? '100%' : '0%' }}
                className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-primary rounded-full z-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[400px]">
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isAfter ? 'after' : 'before'}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  {(isAfter ? afterItems : beforeItems).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <span className="font-semibold text-primary">{item.text}</span>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="premium-card bg-primary text-white p-10 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-6">
                {isAfter ? 'Streamlined for Growth' : 'Legacy Limitations'}
              </h3>
              <p className="text-white/70 leading-relaxed mb-8">
                {isAfter 
                  ? "Digital transformation can help streamline workflows, improve information organization, and support better communication with parents and stakeholders."
                  : "Manual processes often lead to scattered communication, difficult data management, and repeated manual follow-ups that consume valuable resources."
                }
              </p>
              <ul className="space-y-3">
                {isAfter ? (
                  <>
                    <li className="flex gap-2 text-sm text-accent">✓ Can help streamline workflows</li>
                    <li className="flex gap-2 text-sm text-accent">✓ Can improve information organisation</li>
                    <li className="flex gap-2 text-sm text-accent">✓ Can support better communication</li>
                  </>
                ) : (
                  <li className="text-sm text-white/50 italic italic">Relying on paper records and manual follow-ups</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
