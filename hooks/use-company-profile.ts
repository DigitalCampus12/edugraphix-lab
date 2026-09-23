'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, query, where, orderBy } from 'firebase/firestore';

export interface CompanyContact {
  companyName: string;
  tagline: string;
  phone1: string;
  phone2: string;
  email: string;
  location: string;
  whatsapp: string;
  websiteUrl: string;
}

export interface Founder {
  id: string;
  name: string;
  designation: string;
  bio: string;
  expertise: string[];
  photoUrl: string;
  linkedin: string;
  email: string;
  published: boolean;
  displayOrder: number;
}

export interface CompanyPhoto {
  id: string;
  title: string;
  description: string;
  category: string;
  photoUrl: string;
  published: boolean;
  displayOrder: number;
}

export function useCompanyContact() {
  const [contact, setContact] = useState<CompanyContact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContact() {
      const fallbackContact = {
        companyName: 'EduGraphix Lab',
        tagline: 'Empowering Schools with Digital Creativity',
        phone1: '+91 8528581471',
        phone2: '+91 7237026327',
        email: 'edugraphixlab@gmail.com',
        location: 'Ghazipur, Uttar Pradesh, India',
        whatsapp: '+91 8528581471',
        websiteUrl: 'https://edugraphixlab.com'
      };

      try {
        const docRef = doc(db, 'companyProfile', 'contact');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContact(docSnap.data() as CompanyContact);
        } else {
          setContact(fallbackContact);
        }
      } catch (err) {
        console.error("Error fetching contact info:", err);
        // On error (like offline), use fallback to keep UI working
        setContact(fallbackContact);
      } finally {
        setLoading(false);
      }
    }
    fetchContact();
  }, []);

  return { contact, loading };
}

export function useFounders() {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFounders() {
      try {
        const q = query(
          collection(db, 'founders'),
          where('published', '==', true),
          orderBy('displayOrder', 'asc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => {
          const d = doc.data();
          return { 
            id: doc.id, 
            ...d,
            expertise: Array.isArray(d.expertise) ? d.expertise : []
          } as Founder;
        });
        setFounders(data);
      } catch (err) {
        console.error("Error fetching founders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFounders();
  }, []);

  return { founders, loading };
}

export function useCompanyPhotos() {
  const [photos, setPhotos] = useState<CompanyPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const q = query(
          collection(db, 'companyPhotos'),
          where('published', '==', true),
          orderBy('displayOrder', 'asc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CompanyPhoto));
        setPhotos(data);
      } catch (err) {
        console.error("Error fetching photos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  return { photos, loading };
}
