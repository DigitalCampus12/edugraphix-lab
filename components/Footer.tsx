'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useCompanyContact } from '@/hooks/use-company-profile';

export default function Footer() {
  const { contact } = useCompanyContact();
  
  const companyName = contact?.companyName || 'EDUGRAPHIX';
  const tagline = contact?.tagline || 'Complete Digital Solutions for Schools.';
  const email = contact?.email || 'edugraphixlab@gmail.com';
  const phone = contact?.phone1 || '+91 8528581471';
  const location = contact?.location || 'Ghazipur, Uttar Pradesh, India';

  return (
    <footer className="bg-primary text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-3 mb-6 group">
            <div className="relative w-12 h-12 bg-white rounded-xl overflow-hidden p-1 transition-transform group-hover:scale-105">
              <img 
                src="/assets/logo.jpg" 
                alt={companyName} 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-xl leading-none tracking-tight uppercase group-hover:text-accent transition-colors">{companyName}</span>
              <span className="text-accent font-bold text-[10px] tracking-[0.2em] uppercase">Lab</span>
            </div>
          </Link>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            {tagline}. We don&apos;t just build websites; we help educational institutions build a better digital ecosystem.
          </p>
          <div className="flex gap-4">
            <SocialIcon icon={<Facebook size={18} />} href="#" />
            <SocialIcon icon={<Twitter size={18} />} href="#" />
            <SocialIcon icon={<Linkedin size={18} />} href={contact?.websiteUrl || '#'} />
            <SocialIcon icon={<Instagram size={18} />} href="#" />
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Quick Links</h4>
          <ul className="flex flex-col gap-3 text-white/70 text-sm">
            <li><Link href="/" className="hover:text-accent">Home</Link></li>
            <li><Link href="/about" className="hover:text-accent">About Us</Link></li>
            <li><Link href="/services" className="hover:text-accent">Services</Link></li>
            <li><Link href="/audit" className="hover:text-accent">Digital Audit</Link></li>
            <li><Link href="/portfolio" className="hover:text-accent">Portfolio</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Services</h4>
          <ul className="flex flex-col gap-3 text-white/70 text-sm">
            <li><Link href="/school-website-solutions" className="hover:text-accent">School Websites</Link></li>
            <li><Link href="/automation-solutions" className="hover:text-accent">Automation</Link></li>
            <li><Link href="/digital-marketing" className="hover:text-accent">Digital Marketing</Link></li>
            <li><Link href="/services" className="hover:text-accent">All Services</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Contact Us</h4>
          <ul className="flex flex-col gap-4 text-white/70 text-sm">
            <li className="flex gap-3">
              <MapPin size={18} className="text-accent shrink-0" />
              <span>{location}</span>
            </li>
            <li className="flex gap-3">
              <Phone size={18} className="text-accent shrink-0" />
              <a href={`tel:${phone}`} className="hover:text-accent transition-colors">{phone}</a>
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="text-accent shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-accent transition-colors">{email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-xs">
        <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          <Link href="/admin" className="hover:text-white">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary transition-all"
    >
      {icon}
    </Link>
  );
}
