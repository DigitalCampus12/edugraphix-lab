import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DataLandscape from '@/components/DataLandscape';
import { Search, Filter, ArrowUpRight } from 'lucide-react';

const insightSections = [
  {
    title: "School Digital Infrastructure",
    insights: [
      {
        title: "Internet Connectivity Growth",
        desc: "Over 63% of Indian schools now have internet facilities, a significant leap from previous years.",
        source: "UDISE+ 2024-25",
        year: "2024"
      },
      {
        title: "Computer Lab Adoption",
        desc: "Adoption of computer labs is increasing in secondary schools to support digital literacy.",
        source: "Ministry of Education",
        year: "2024"
      }
    ]
  },
  {
    title: "Education Technology Trends",
    insights: [
      {
        title: "Mobile-First Parent Portals",
        desc: "Schools with mobile-responsive portals see 40% higher parent engagement rates.",
        source: "EduGraphix Lab Internal Research",
        year: "2025"
      },
      {
        title: "Automation Impact",
        desc: "Automated admission enquiries can help streamline information organization for administration.",
        source: "Case Study Analysis",
        year: "2025"
      }
    ]
  }
];

export default function InsightsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="pt-40 pb-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-primary">Data & Insights</h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Research-based insights into the digital landscape of Indian education.
          </p>
        </div>
      </section>

      <DataLandscape />

      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <h2 className="text-3xl font-extrabold text-primary">Regional Analysis & Trends</h2>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search insights..." 
                  className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl w-full outline-none focus:border-secondary"
                />
              </div>
              <button className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:text-primary transition-colors">
                <Filter size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-16">
            {insightSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xl font-bold mb-8 text-primary uppercase tracking-widest border-l-4 border-secondary pl-4">
                  {section.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {section.insights.map((insight) => (
                    <div key={insight.title} className="premium-card group cursor-pointer">
                      <div className="flex justify-between items-start mb-6">
                        <h4 className="text-xl font-bold group-hover:text-secondary transition-colors">{insight.title}</h4>
                        <ArrowUpRight className="text-slate-300 group-hover:text-secondary transition-colors" />
                      </div>
                      <p className="text-slate-600 text-sm mb-6 leading-relaxed">{insight.desc}</p>
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        <span>Source: {insight.source}</span>
                        <span>Year: {insight.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
