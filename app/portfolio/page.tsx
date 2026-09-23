import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ExternalLink, Filter } from 'lucide-react';
import Link from 'next/link';

const portfolioCategories = [
  "All", "School Websites", "Graphic Design", "Social Media", "Video Production", "Automation"
];

export default function PortfolioPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="pt-40 pb-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-primary">Our Portfolio</h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Showcasing digital excellence in educational institutions.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {portfolioCategories.map(cat => (
              <button key={cat} className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${cat === 'All' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PortfolioPlaceholder title="Premium School Website" cat="School Websites" />
            <PortfolioPlaceholder title="Admission Campaign Design" cat="Graphic Design" />
            <PortfolioPlaceholder title="Social Media Management" cat="Social Media" />
            <PortfolioPlaceholder title="Campus Promo Video" cat="Video Production" />
            <PortfolioPlaceholder title="Parent Communication Bot" cat="Automation" />
            <PortfolioPlaceholder title="Digital Inquiry System" cat="Automation" />
          </div>

          <div className="mt-20 p-12 bg-bg-light rounded-3xl text-center border border-slate-100">
            <h3 className="text-2xl font-bold mb-4 text-primary">Client Stories Coming Soon</h3>
            <p className="text-slate-500 max-w-xl mx-auto">
              We are currently onboarding new projects and preparing detailed case studies to show how we transform educational institutions.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function PortfolioPlaceholder({ title, cat }: { title: string, cat: string }) {
  return (
    <div className="premium-card group cursor-pointer overflow-hidden p-0">
      <div className="aspect-video bg-slate-100 flex items-center justify-center text-slate-300 font-bold italic group-hover:bg-slate-200 transition-colors">
        [ Project Preview ]
      </div>
      <div className="p-6">
        <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">{cat}</div>
        <h3 className="text-lg font-bold text-primary group-hover:text-secondary transition-colors mb-4">{title}</h3>
        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
          <span className="text-xs text-slate-400 font-medium">Coming Soon</span>
          <ExternalLink size={16} className="text-slate-300" />
        </div>
      </div>
    </div>
  );
}
