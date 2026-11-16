'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { KnowledgeGap, UserRole } from '@/types';

interface AnalyticsViewProps {
  userRole: UserRole;
  isDark: boolean;
}

export default function AnalyticsView({ userRole, isDark }: AnalyticsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'Knowledge Usage' | 'Verification Health' | 'Knowledge Gaps'>('Knowledge Usage');

  const mostViewed = [
    { title: 'Directory of Company Terminology', views: '1.5K', users: 163 },
    { title: 'Internal Certification Program', views: '1.2K', users: 112 },
    { title: 'Subject Matter Experts - Go to Market Team', views: '927', users: 98 },
    { title: 'Learning Roadmaps for the Product & Engineering Team', views: '746', users: 43 },
    { title: 'Manager Training - Calendar and Signup Link', views: '534', users: 37 }
  ];

  const mostFavorited = [
    { title: 'How to request professional development budget', pct: 95 },
    { title: 'Directory of Company Terminology', pct: 78 },
    { title: 'Security Training Certification Process', pct: 58 },
    { title: 'CS Team Skills Training', pct: 45 },
    { title: 'Subject Matter Experts - Go to Market Team', pct: 42 }
  ];

  const knowledgeGaps: KnowledgeGap[] = [
    {
      id: 'gap-1',
      topic: 'International Travel Reimbursement & Forex Policy',
      frequency: 42,
      department: 'HR / Finance',
      status: 'Unresolved',
      sample_query: 'How do I claim international currency exchange losses on business trips?',
      recommended_action: 'Upload approved 2026 International Travel & Per-Diem Addendum'
    },
    {
      id: 'gap-2',
      topic: 'AI Code Generation Tool Compliance',
      frequency: 29,
      department: 'Legal / IT',
      status: 'In Progress',
      sample_query: 'Can engineering use GitHub Copilot on enterprise client repositories?',
      recommended_action: 'Publish Enterprise GenAI Usage Policy'
    },
    {
      id: 'gap-3',
      topic: 'Parental Leave Primary vs Secondary Caregiver',
      frequency: 18,
      department: 'HR',
      status: 'Needs Review',
      sample_query: 'What is the duration of secondary caregiver paid leave in Europe?',
      recommended_action: 'Update Global Parental Leave Framework'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Title & Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Knowledge Usage & Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Adoption metrics, verification health, and organizational knowledge gaps.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className={`p-1 rounded-xl border flex items-center gap-1 text-xs font-semibold ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          {(['Knowledge Usage', 'Verification Health', 'Knowledge Gaps'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === tab
                  ? isDark
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Chips Bar (Matches Screenshot 3 Guru Analytics) */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {[
          'Date Last 90 Days',
          'Collection Name (Select)',
          'Group Name (Select)',
          'Source Application (Select)',
          'Card Title (Select)'
        ].map((chip, idx) => (
          <div
            key={idx}
            className={`px-3 py-1.5 rounded-full border text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-all ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm'
            }`}
          >
            <span>{chip}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        ))}
      </div>

      {activeSubTab === 'Knowledge Usage' && (
        <div className="space-y-6">
          {/* Most Viewed Cards Table (Matches Screenshot 3) */}
          <div className={`rounded-2xl border overflow-hidden ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="p-4 border-b border-slate-800/40">
              <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Most Viewed Cards
              </h2>
            </div>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`border-b text-[11px] font-semibold text-slate-400 ${
                  isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/60'
                }`}>
                  <th className="py-3 px-4">Card Title</th>
                  <th className="py-3 px-4 text-right">Card Views</th>
                  <th className="py-3 px-4 text-right">Total Users Viewed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {mostViewed.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className={`py-3 px-4 font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {item.title}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-blue-500">
                      {item.views}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 font-medium">
                      {item.users}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Most Favorited Cards (Matches Screenshot 3 horizontal mint/emerald bar charts) */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Most Favorited Cards
              </h2>
              <span className="text-[11px] text-slate-400">Total Bookmarks</span>
            </div>

            <div className="space-y-4 pt-1">
              {mostFavorited.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium truncate max-w-lg ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {item.title}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-500 ml-2">
                      {item.pct}%
                    </span>
                  </div>
                  {/* Mint/Emerald Green Horizontal Bar */}
                  <div className="w-full bg-slate-800/30 rounded-md h-5 overflow-hidden flex items-center">
                    <div
                      className="bg-[#4ADE80] hover:bg-[#22C55E] h-5 rounded-md transition-all duration-700"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Verification Health Tab */}
      {activeSubTab === 'Verification Health' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified Fresh (92%)</span>
            </div>
            <p className="text-2xl font-bold">1,148 Docs</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Reviewed and approved within past 90 days.
            </p>
          </div>

          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 text-amber-500 text-xs font-bold mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Needs Verification (6%)</span>
            </div>
            <p className="text-2xl font-bold">75 Docs</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Expiring within next 30 days. n8n reminder sent to Dept Heads.
            </p>
          </div>

          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 text-rose-500 text-xs font-bold mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Superseded / Outdated (2%)</span>
            </div>
            <p className="text-2xl font-bold">25 Docs</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Excluded from active RAG retrieval to prevent hallucinations.
            </p>
          </div>
        </div>
      )}

      {/* Knowledge Gaps Tab (PRD Module 16) */}
      {activeSubTab === 'Knowledge Gaps' && (
        <div className="space-y-4">
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Detected Knowledge Gaps (Repeated Unanswered Employee Queries)</span>
              </h2>
              <span className="text-xs text-slate-400 font-semibold">
                PRD Module 16 Real-Time Detection
              </span>
            </div>
            <p className="text-xs text-slate-400">
              When multiple employees query topics without matching approved documents, the platform flags the gap and dispatches an automated workflow to the responsible department head.
            </p>
          </div>

          <div className="space-y-3">
            {knowledgeGaps.map((gap) => (
              <div
                key={gap.id}
                className={`p-4 rounded-2xl border space-y-2 transition-all ${
                  isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-amber-500 flex items-center gap-2">
                      <span>{gap.topic}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold">
                        {gap.frequency} Queries
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300 italic mt-1">
                      Sample query: &quot;{gap.sample_query}&quot;
                    </p>
                  </div>
                  <button
                    onClick={() => alert(`Dispatching n8n documentation request for: ${gap.topic}`)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <span>Request Documentation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800/40 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Assigned Dept: <strong>{gap.department}</strong></span>
                  <span>Recommendation: <em>{gap.recommended_action}</em></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
