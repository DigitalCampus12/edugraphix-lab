import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ServiceEcosystem from '@/components/ServiceEcosystem';
import DataLandscape from '@/components/DataLandscape';
import BeforeAfter from '@/components/BeforeAfter';
import AuditTool from '@/components/AuditTool';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Sections */}
      <Hero />
      
      <ServiceEcosystem />

      <DataLandscape />

      <BeforeAfter />

      {/* Cinematic Final CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary via-transparent to-transparent" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-7xl font-extrabold mb-8 leading-tight">
            Your School&apos;s Digital Journey Starts Here.
          </h2>
          <p className="text-xl text-white/70 mb-12 leading-relaxed">
            From creative design and professional websites to organised communication, automation workflows and digital growth &mdash; EduGraphix Lab brings multiple digital solutions together for educational institutions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/audit" className="bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-accent transition-all flex items-center justify-center gap-2">
              Get Free Digital Audit
              <ArrowRight size={20} />
            </Link>
            <Link href="/contact" className="border-2 border-white/30 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>

      <AuditTool />

      <ContactForm />
      
      <Footer />
    </main>
  );
}
