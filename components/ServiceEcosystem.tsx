'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Palette, Layout, Cpu, TrendingUp } from 'lucide-react';

const ecosystems = [
  {
    title: 'CREATE',
    icon: <Palette className="w-8 h-8" />,
    color: 'border-secondary text-secondary',
    services: [
      'Graphic Design', 'School Posters', 'Admission Campaign Creatives',
      'Prospectus Design', 'Brochure Design', 'Certificate Design',
      'ID Card Design', 'School Diary Design', 'Social Media Creatives',
      'Video Editing', 'Reels', 'Promotional Videos'
    ]
  },
  {
    title: 'BUILD',
    icon: <Layout className="w-8 h-8" />,
    color: 'border-primary text-primary',
    services: [
      'Professional School Website', 'Responsive Website Design',
      'Admission Portal', 'Online Enquiry Forms', 'Landing Pages',
      'Parent Portal', 'Student Portal', 'Mobile App Concepts'
    ]
  },
  {
    title: 'AUTOMATE',
    icon: <Cpu className="w-8 h-8" />,
    color: 'border-accent text-accent',
    services: [
      'WhatsApp Automation', 'Admission Follow-up Workflows',
      'Parent Communication Workflows', 'Reminder Automation',
      'FAQ Chatbot', 'AI Chatbot', 'Google Forms Integration',
      'Excel Automation', 'Invoice Automation', 'QR Code Systems'
    ]
  },
  {
    title: 'GROW',
    icon: <TrendingUp className="w-8 h-8" />,
    color: 'border-secondary text-secondary',
    services: [
      'SEO', 'Local SEO', 'Google Business Profile',
      'Social Media Management', 'Google Ads', 'Meta Ads',
      'Digital Campaign Strategy', 'Analytics & Reporting'
    ]
  }
];

export default function ServiceEcosystem() {
  return (
    <section className="py-24 bg-slate-50 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Core Service Ecosystem</h2>
          <p className="text-slate-500">Comprehensive digital tools designed specifically for educational institutions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {ecosystems.map((eco, idx) => (
            <motion.div
              key={eco.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`premium-card border-t-4 ${eco.color} group hover:-translate-y-2 transition-all duration-500`}
            >
              <div className="mb-6 flex justify-between items-start">
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-white transition-colors">
                  {eco.icon}
                </div>
                <span className="text-4xl font-black opacity-5 group-hover:opacity-10 transition-opacity">{eco.title}</span>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-primary">{eco.title}</h3>
              <ul className="space-y-3">
                {eco.services.map((service) => (
                  <li key={service} className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    {service}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
