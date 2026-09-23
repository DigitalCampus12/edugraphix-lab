import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceEcosystem from '@/components/ServiceEcosystem';
import { Palette, Layout, Cpu, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const detailedServices = [
  {
    id: 'create',
    title: 'Creative Design Solutions',
    icon: <Palette size={32} />,
    desc: 'Visual identity and high-end creative design for all school touchpoints.',
    items: ['Graphic Design', 'School Posters', 'Admission Campaign Creatives', 'Prospectus Design', 'Brochure Design', 'Certificate Design', 'ID Card Design', 'School Diary Design', 'Social Media Creatives', 'Video Editing', 'Reels', 'Promotional Videos']
  },
  {
    id: 'build',
    title: 'Digital Platform Development',
    icon: <Layout size={32} />,
    desc: 'Custom-built websites and portals tailored for school operations.',
    items: ['Professional School Website', 'Responsive Website Design', 'Admission Portal', 'Online Enquiry Forms', 'Landing Pages', 'Parent Portal', 'Student Portal', 'Mobile App Concepts']
  },
  {
    id: 'automate',
    title: 'Automation & Integration',
    icon: <Cpu size={32} />,
    desc: 'Streamlining repetitive communication and administrative tasks.',
    items: ['WhatsApp Automation', 'Admission Follow-up Workflows', 'Parent Communication Workflows', 'Reminder Automation', 'FAQ Chatbot', 'AI Chatbot', 'Google Forms Integration', 'Excel Automation', 'Invoice Automation', 'QR Code Systems']
  },
  {
    id: 'grow',
    title: 'Digital Growth Strategy',
    icon: <TrendingUp size={32} />,
    desc: 'Enhancing online visibility and institutional reputation.',
    items: ['SEO', 'Local SEO', 'Google Business Profile', 'Social Media Management', 'Google Ads', 'Meta Ads', 'Digital Campaign Strategy', 'Analytics & Reporting']
  }
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="pt-40 pb-20 px-6 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Our Solutions Ecosystem</h1>
          <p className="text-xl text-white/70 leading-relaxed">
            We provide a 360-degree digital suite designed specifically to meet the unique challenges of educational institutions.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-24">
          {detailedServices.map((service, idx) => (
            <div key={service.id} className={`flex flex-col lg:flex-row gap-16 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="lg:w-1/2">
                <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-8">
                  {service.icon}
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-primary">{service.title}</h2>
                <p className="text-lg text-slate-600 mb-8">{service.desc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.items.map(item => (
                    <div key={item} className="flex items-center gap-3 text-slate-700">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-12">
                  <Link href="/contact" className="btn-primary inline-flex">
                    Enquire About {service.title}
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
              <div className="lg:w-1/2 w-full">
                <div className="aspect-video bg-slate-100 rounded-3xl overflow-hidden relative border border-slate-200">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold italic">
                    [ Service Visualization ]
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ServiceEcosystem />

      <Footer />
    </main>
  );
}
