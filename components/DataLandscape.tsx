'use client';

import React from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const barData = [
  { name: 'Total Schools', value: 14.71 },
  { name: 'With Internet', value: 9.34 },
  { name: 'Without Internet', value: 5.37 },
];

const pieData = [
  { name: 'With Internet', value: 63.5, color: '#84cc16' }, // Lime Green
  { name: 'Without Internet', value: 36.5, color: '#1a2b4b' }, // Navy Blue
];

export default function DataLandscape() {
  return (
    <section className="py-24 bg-bg-light px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">India&apos;s School Digital Landscape</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Understanding the scale of digital infrastructure in Indian educational institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Charts */}
          <div className="space-y-12">
            <div className="premium-card h-[400px]">
              <h3 className="text-lg font-bold mb-8 flex justify-between items-center">
                School Infrastructure (in Lakhs)
                <span className="text-[10px] uppercase tracking-widest text-slate-400">Bar Chart</span>
              </h3>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 1 ? '#84cc16' : '#1a2b4b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="premium-card">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Internet Availability</h3>
                <div className="text-4xl font-extrabold text-secondary">63.5%</div>
                <p className="text-xs text-slate-500 mt-2">Approximately 9.34 Lakh Schools</p>
              </div>
              <div className="premium-card">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Digital Gap</h3>
                <div className="text-4xl font-extrabold text-primary">36.5%</div>
                <p className="text-xs text-slate-500 mt-2">Approximately 5.37 Lakh Schools</p>
              </div>
            </div>
          </div>

          {/* Pie Chart & Source */}
          <div className="lg:pl-12">
            <div className="premium-card mb-8">
               <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-8 mt-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-semibold text-slate-600">{item.name} ({item.value}%)</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/50 border border-slate-200 rounded-2xl p-8">
              <h4 className="font-bold text-sm mb-4">Data Source Context</h4>
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="font-bold text-primary">SOURCE:</span>
                  <span>&quot;UDISE+ 2024–25, Ministry of Education, Government of India&quot;</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">CONTEXT:</span>
                  <span>These figures represent school-level digital infrastructure and internet availability.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-red-500 shrink-0">DISCLAIMER:</span>
                  <span className="italic">They are not direct statistics of school website adoption.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
