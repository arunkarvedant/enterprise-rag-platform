'use client';

import React, { useState } from 'react';
import {
  Video,
  FileText,
  CheckCircle,
  Calendar,
  Users,
  Plus,
  Clock,
  Sparkles,
  ArrowRight,
  ListTodo
} from 'lucide-react';
import { MeetingItem, UserRole } from '@/types';

interface MeetingIntelViewProps {
  userRole: UserRole;
  isDark: boolean;
}

export default function MeetingIntelView({ userRole, isDark }: MeetingIntelViewProps) {
  const [meetings, setMeetings] = useState<MeetingItem[]>([
    {
      id: 'meet-1',
      title: 'Q2 Product Roadmap & AI Knowledge Hub Architecture Review',
      date: 'May 18, 2026',
      participants: ['Arif Rahman (Admin)', 'Sarah Ahmed (HR)', 'Rafiq Hasan (Ops)', 'Nusrat Jahan (Finance)'],
      project: 'Enterprise Knowledge Hub',
      summary:
        'Executive architectural sync regarding the deployment of pgvector semantic search and n8n automated policy expiry pipelines. Agreed on zero-trust pre-retrieval authorization.',
      key_decisions: [
        'Enforce tenant and role pre-filtering on all pgvector queries before similarity matching.',
        'Mandate SOC2 Type II compliance audit for all external tool connectors.',
        'Adopt side-by-side interactive document preview for all cited RAG answers.'
      ],
      action_items: [
        {
          task: 'Configure pgvector HNSW index on chunk embeddings table',
          assignee: 'Rafiq Hasan',
          deadline: 'May 24, 2026',
          status: 'In Progress'
        },
        {
          task: 'Complete legal review of contract clause extraction prompt templates',
          assignee: 'Sarah Ahmed',
          deadline: 'May 26, 2026',
          status: 'Pending'
        }
      ]
    }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newTranscript, setNewTranscript] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleUploadMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTranscript.trim()) return;

    setIsSummarizing(true);
    setTimeout(() => {
      const newMeeting: MeetingItem = {
        id: `meet-${Date.now()}`,
        title: newTitle,
        date: 'Today',
        participants: ['Arif Rahman', 'Sarah Ahmed', 'Team Members'],
        project: 'Strategic Initiatives',
        summary: `AI Executive Synthesis: Analyzed discussion transcript regarding '${newTitle}'. Extracted core consensus items, risk mitigations, and employee accountability mappings.`,
        key_decisions: [
          'Approved operational requirements and budget allocations.',
          'Established bi-weekly cross-functional progress review.'
        ],
        action_items: [
          {
            task: 'Draft implementation blueprint and share with department heads',
            assignee: 'Sarah Ahmed',
            deadline: 'Next Monday',
            status: 'Pending'
          }
        ]
      };
      setMeetings([newMeeting, ...meetings]);
      setNewTitle('');
      setNewTranscript('');
      setIsSummarizing(false);
    }, 1200);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Meeting Intelligence & Action Items
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Convert audio transcripts and meeting notes into structured, searchable organizational knowledge (PRD Module 11).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Meeting Upload / Audio Transcript Parser (1 col) */}
        <div className={`p-5 rounded-2xl border h-fit space-y-4 ${
          isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800/40">
            <Video className="w-4 h-4 text-blue-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              New Meeting Transcript
            </h2>
          </div>

          <form onSubmit={handleUploadMeeting} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Meeting Title
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Sales & Product All-Hands Q3"
                className={`w-full py-2 px-3 text-xs rounded-xl border focus:outline-none ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Paste Transcript or Notes
              </label>
              <textarea
                rows={6}
                required
                value={newTranscript}
                onChange={(e) => setNewTranscript(e.target.value)}
                placeholder="Speaker 1: Let's finalize the vendor compliance requirements for the cloud migration..."
                className={`w-full py-2 px-3 text-xs rounded-xl border focus:outline-none resize-none ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isSummarizing || !newTitle.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSummarizing ? 'Extracting Decisions...' : 'Process Transcript'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Processed Meetings & Action Items (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {meetings.map((m) => (
            <div
              key={m.id}
              className={`p-5 rounded-2xl border space-y-4 ${
                isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {m.title}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {m.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-500" />
                      {m.participants.length} Participants
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {m.project}
                </span>
              </div>

              {/* Summary */}
              <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <span className="font-bold block mb-1 text-blue-500">
                  Executive Summary
                </span>
                <p>{m.summary}</p>
              </div>

              {/* Key Decisions */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Key Decisions
                </span>
                <div className="space-y-1.5">
                  {m.key_decisions.map((dec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{dec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Items */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Action Items & Assignments
                </span>
                <div className="space-y-2">
                  {m.action_items.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                        isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ListTodo className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold">{item.task}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span>Assignee: <strong>{item.assignee}</strong></span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-semibold">
                          Due: {item.deadline}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
