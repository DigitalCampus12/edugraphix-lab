'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronRight, ChevronLeft, Send, AlertCircle } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const questions = [
  {
    id: 1,
    question: "Does your school have a professional website?",
    options: [
      { label: "Yes", points: 10 },
      { label: "Basic Website", points: 5 },
      { label: "No", points: 0 }
    ]
  },
  {
    id: 2,
    question: "Can parents submit admission enquiries online?",
    options: [
      { label: "Yes", points: 10 },
      { label: "Partially", points: 5 },
      { label: "No", points: 0 }
    ]
  },
  {
    id: 3,
    question: "Does your school use digital communication systems?",
    options: [
      { label: "Yes", points: 10 },
      { label: "Sometimes", points: 5 },
      { label: "No", points: 0 }
    ]
  },
  {
    id: 4,
    question: "Is your Google Business Profile updated?",
    options: [
      { label: "Yes", points: 10 },
      { label: "Partially", points: 5 },
      { label: "No", points: 0 }
    ]
  },
  {
    id: 5,
    question: "Do you use automation for repetitive communication or reminders?",
    options: [
      { label: "Yes", points: 10 },
      { label: "Partially", points: 5 },
      { label: "No", points: 0 }
    ]
  },
  {
    id: 6,
    question: "Is your school active on social media?",
    options: [
      { label: "Regularly", points: 10 },
      { label: "Occasionally", points: 5 },
      { label: "No", points: 0 }
    ]
  },
  {
    id: 7,
    question: "Are school notices and important information easily available online?",
    options: [
      { label: "Yes", points: 10 },
      { label: "Partially", points: 5 },
      { label: "No", points: 0 }
    ]
  },
  {
    id: 8,
    question: "Do you have a centralized system for digital enquiries?",
    options: [
      { label: "Yes", points: 10 },
      { label: "Partially", points: 5 },
      { label: "No", points: 0 }
    ]
  },
  {
    id: 9,
    question: "Is your website mobile-friendly?",
    options: [
      { label: "Yes", points: 10 },
      { label: "Not Sure", points: 5 },
      { label: "No", points: 0 }
    ]
  },
  {
    id: 10,
    question: "Do you regularly track your digital performance?",
    options: [
      { label: "Yes", points: 10 },
      { label: "Sometimes", points: 5 },
      { label: "No", points: 0 }
    ]
  }
];

export default function AuditTool() {
  const [step, setStep] = useState<'intro' | 'quiz' | 'lead' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [leadData, setLeadData] = useState({
    name: '',
    institutionName: '',
    phone: '',
    email: '',
    city: '',
    websiteURL: '',
    studentRange: '',
    servicesInterested: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptionSelect = (points: number) => {
    setAnswers({ ...answers, [String(questions[currentQuestion].id)]: points });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('lead');
    }
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((acc, curr) => acc + curr, 0);
  };

  const getResultCategory = (score: number) => {
    if (score <= 30) return { title: "Early Digital Stage", message: "Your institution may have opportunities to strengthen its digital presence and organise important digital workflows." };
    if (score <= 60) return { title: "Growing Digital Presence", message: "Your institution has started its digital journey, with opportunities to improve integration and organisation." };
    if (score <= 80) return { title: "Strong Digital Foundation", message: "Your institution has a solid digital foundation and may benefit from further optimisation and workflow integration." };
    return { title: "Advanced Digital Readiness", message: "Your institution demonstrates a strong level of digital readiness. Continuous improvement and regular review can help maintain it." };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const score = calculateScore();
    const category = getResultCategory(score);

    try {
      // 1. Save Lead
      const leadRef = await addDoc(collection(db, 'leads'), {
        ...leadData,
        source: 'Digital Audit',
        createdAt: serverTimestamp(),
        status: 'new',
        notes: ''
      }).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, 'leads');
        throw err;
      });

      // 2. Save Audit Result
      await addDoc(collection(db, 'digitalAudits'), {
        leadId: leadRef.id,
        institutionName: leadData.institutionName,
        answers,
        totalScore: score,
        resultCategory: category.title,
        createdAt: serverTimestamp()
      }).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, 'digitalAudits');
        throw err;
      });

      setStep('result');
    } catch (err: any) {
      console.error("Audit submission error:", err);
      setError("Failed to save your audit. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-6 bg-slate-50 min-h-[600px] flex items-center">
      <div className="max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="premium-card text-center p-12 md:p-20"
            >
              <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center text-secondary mx-auto mb-8">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Check Your School&apos;s Digital Readiness</h2>
              <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto">
                Take this quick self-assessment to understand your institution&apos;s current digital readiness. Get a detailed report and actionable insights.
              </p>
              <button onClick={() => setStep('quiz')} className="btn-primary px-12 py-4">
                Start Self-Assessment
              </button>
            </motion.div>
          )}

          {step === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="premium-card p-8 md:p-12"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="text-sm font-bold text-slate-400 tracking-widest uppercase">
                  Question {currentQuestion + 1} of {questions.length}
                </div>
                <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-secondary" 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-primary mb-10">
                {questions[currentQuestion].question}
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {questions[currentQuestion].options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleOptionSelect(opt.points)}
                    className="flex items-center justify-between p-6 rounded-2xl border-2 border-slate-100 hover:border-secondary hover:bg-secondary/5 transition-all text-left group"
                  >
                    <span className="font-semibold text-lg text-slate-700 group-hover:text-secondary">{opt.label}</span>
                    <ChevronRight className="text-slate-300 group-hover:text-secondary transition-colors" />
                  </button>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
                <button 
                  onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
                  disabled={currentQuestion === 0}
                  className="text-slate-400 hover:text-primary font-bold flex items-center gap-2 disabled:opacity-0 transition-all"
                >
                  <ChevronLeft /> Back
                </button>
              </div>
            </motion.div>
          )}

          {step === 'lead' && (
            <motion.div
              key="lead"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-card p-8 md:p-12"
            >
              <div className="text-center mb-10">
                <h3 className="text-3xl font-bold mb-4">You&apos;re Almost There!</h3>
                <p className="text-slate-500">Fill in your details to see your Digital Readiness Score and receive the full report.</p>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Your Name" value={leadData.name} onChange={(v) => setLeadData({...leadData, name: v})} required />
                <Input label="School Name" value={leadData.institutionName} onChange={(v) => setLeadData({...leadData, institutionName: v})} required />
                <Input label="Phone Number" value={leadData.phone} onChange={(v) => setLeadData({...leadData, phone: v})} required type="tel" />
                <Input label="Email" value={leadData.email} onChange={(v) => setLeadData({...leadData, email: v})} required type="email" />
                <Input label="City" value={leadData.city} onChange={(v) => setLeadData({...leadData, city: v})} required />
                <Input label="School Website URL (Optional)" value={leadData.websiteURL} onChange={(v) => setLeadData({...leadData, websiteURL: v})} />
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Number of Students</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:border-secondary transition-colors"
                    value={leadData.studentRange}
                    onChange={(e) => setLeadData({...leadData, studentRange: e.target.value})}
                  >
                    <option value="">Select Range</option>
                    <option value="0-500">0 - 500</option>
                    <option value="500-1000">500 - 1000</option>
                    <option value="1000+">1000+</option>
                  </select>
                </div>

                <div className="md:col-span-2 mt-8">
                  <button 
                    disabled={isSubmitting}
                    className="btn-primary w-full py-4 text-lg"
                  >
                    {isSubmitting ? 'Calculating Score...' : 'Get My Digital Readiness Report'}
                    <Send size={20} />
                  </button>
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}
                </div>
              </form>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="premium-card p-12 text-center"
            >
              <div className="w-32 h-32 rounded-full border-8 border-secondary/10 flex items-center justify-center mx-auto mb-8">
                <span className="text-5xl font-black text-secondary">{calculateScore()}</span>
              </div>
              
              <h3 className="text-3xl font-bold text-primary mb-2">
                {getResultCategory(calculateScore()).title}
              </h3>
              <p className="text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed">
                {getResultCategory(calculateScore()).message}
              </p>

              <div className="bg-slate-50 rounded-2xl p-6 text-sm text-slate-500 italic mb-10 border border-slate-100">
                &quot;This score is a self-assessment tool created by EduGraphix Lab. It is not an official government or board certification.&quot;
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => setStep('intro')} className="btn-outline">Take Audit Again</button>
                <Link href="/contact" className="btn-primary">Talk to Our Team</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Input({ label, value, onChange, required, type = "text" }: { label: string, value: string, onChange: (v: string) => void, required?: boolean, type?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-slate-700">{label} {required && <span className="text-red-500">*</span>}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:border-secondary transition-colors"
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
    </div>
  );
}
