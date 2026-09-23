import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Globe, Shield, Zap, Search, Layout, Smartphone, MousePointer2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  { icon: <Smartphone />, title: "Fully Responsive", desc: "Pixel-perfect experience on mobiles, tablets, and desktops." },
  { icon: <Shield />, title: "Secure Hosting", desc: "Enterprise-grade security and SSL protection for school data." },
  { icon: <Zap />, title: "Ultra Fast Load", desc: "Optimized performance to keep parents and students engaged." },
  { icon: <Search />, title: "SEO Ready", desc: "Built-in search engine optimization to help new parents find you." }
];

export default function WebsiteSolutionsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-40 pb-24 px-6 bg-slate-50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/5 -skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-secondary font-black tracking-widest text-xs uppercase mb-4 block">BUILD YOUR DIGITAL CAMPUS</span>
            <h1 className="text-4xl md:text-7xl font-extrabold mb-8 text-primary leading-tight">
              Premium School <span className="text-secondary">Websites.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              We don&apos;t just build websites; we build digital gateways that reflect your institution&apos;s legacy and facilitate modern operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="btn-primary px-10">Get Started</Link>
              <Link href="/portfolio" className="border-2 border-primary/10 px-10 py-4 rounded-full font-bold text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
                View Samples <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden relative p-4">
              <div className="w-full h-full bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-300 font-bold italic">
                [ Interactive Browser Mockup ]
              </div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-secondary/10 blur-3xl rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 rounded-3xl border border-slate-100 hover:border-secondary transition-colors group">
              <div className="w-12 h-12 bg-slate-50 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
                {React.isValidElement(f.icon) ? React.cloneElement(f.icon as React.ReactElement<any>, { size: 24 }) : f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Deep Dive Section */}
      <section className="py-24 px-6 bg-bg-light">
        <div className="max-w-7xl mx-auto space-y-32">
          <div className="flex flex-col lg:row gap-20 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-8 text-primary">Parent-Centric Portals</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Streamline communication with dedicated portals for parents. From online enquiry forms to fee payment integrations, we make the parent journey seamless.
              </p>
              <ul className="space-y-4">
                {['Direct Enquiry Forms', 'Admission Progress Tracker', 'Fee Payment Integration', 'Document Uploads'].map(item => (
                  <li key={item} className="flex items-center gap-4 text-slate-700 font-bold">
                    <div className="w-5 h-5 bg-secondary text-white rounded-full flex items-center justify-center">
                      <Zap size={10} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2 w-full aspect-square bg-white rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center text-slate-300 font-bold italic">
              [ Portal Dashboard UI ]
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
