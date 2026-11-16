'use client';

import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Paperclip,
  ArrowRight,
  TrendingUp,
  FileText,
  FileSpreadsheet,
  Presentation,
  Globe,
  File,
  SlidersHorizontal,
  ChevronDown,
  CheckCircle2,
  Clock,
  Layers,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Bookmark,
  RefreshCw,
  MoreVertical,
  Eye,
  Trash2,
  CheckSquare,
  Square,
  Share2,
  Check,
  Database,
  ExternalLink,
  Download,
  X,
  Calendar,
  User,
  Zap,
  BarChart3
} from 'lucide-react';
import { DocumentItem, Citation, UserRole, DocumentType } from '@/types';
import { askQuestion, searchHybrid } from '@/lib/api';
import { StatCard, Badge, FancyButton, Kbd } from '@/components/ui/cubby-ui';

interface UnifiedHubViewProps {
  documents: DocumentItem[];
  onSelectDocument: (doc: DocumentItem) => void;
  onOpenAddDoc: () => void;
  onDeleteDocument: (id: string) => void;
  userRole: UserRole;
  isDark: boolean;
}

export default function UnifiedHubView({
  documents,
  onSelectDocument,
  onOpenAddDoc,
  onDeleteDocument,
  userRole,
  isDark
}: UnifiedHubViewProps) {
  // Query & Ask Copilot State (Images 2 & 5)
  const [queryInput, setQueryInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [activeDocContext, setActiveDocContext] = useState<DocumentItem | null>(null);
  const [showRightInspector, setShowRightInspector] = useState(true);
  const [inspectorTab, setInspectorTab] = useState<'citation' | 'analytics'>('citation');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedSources, setSelectedSources] = useState<string[]>(['All']);
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [deptFilter, setDeptFilter] = useState('All');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Active AI Synthesized Answer (Combines Ask AI Image 2, Docent Corp Image 4, Moveworks Image 5)
  const [aiAnswer, setAiAnswer] = useState({
    question: 'What is our remote work policy?',
    answer:
      "Acme Corp's remote work policy is designed to support flexibility while maintaining productivity, collaboration, and alignment with our company goals [1].\n\nKey points:\n• Employees can work remotely up to 3 days per week [1].\n• Team leads coordinate anchor days for team collaboration [2].\n• Core collaboration hours are 10:00 AM – 3:00 PM local time [1].\n• All remote work must be pre-approved by your manager [2].\n• Employees are responsible for home workspace security and VPN compliance [3].",
    confidence: 92,
    responseTime: 12.4,
    sourcesCount: 7,
    citations: [
      {
        id: 1,
        document_id: 'doc-4',
        document_name: 'Workplace & Remote Work Guidelines.pdf',
        source_name: 'Google Drive • Updated 1 week ago',
        page_number: 4,
        section_heading: 'Section 2.1: Remote Work Schedule & Core Hours',
        quote:
          "Acme Corp's remote work policy is designed to support flexibility while maintaining productivity and alignment. Employees can work remotely up to 3 days per week with manager coordination. Core collaboration hours are 10:00 AM - 3:00 PM local time across all timezones.",
        confidence: 0.96
      },
      {
        id: 2,
        document_id: 'doc-8',
        document_name: 'Employee Handbook.docx',
        source_name: 'Notion • Updated 3 days ago',
        page_number: 12,
        section_heading: 'Team Coordination & Manager Sign-off',
        quote:
          'Remote work must be pre-approved by your manager and is subject to role requirements. Team leads coordinate specific in-office anchor days for team ceremonies.',
        confidence: 0.93
      },
      {
        id: 3,
        document_id: 'doc-5',
        document_name: 'IT Security Best Practices.docx',
        source_name: 'Slack #company-policy • Today',
        page_number: 2,
        section_heading: 'Home Office & Remote Device Security',
        quote:
          'Employees are responsible for ensuring physical privacy of work screens and adhering to full-disk encryption and VPN protocols when working outside company facilities.',
        confidence: 0.88
      }
    ],
    keyPoints: [
      'Employees can work remotely up to 3 days per week.',
      'Core hours are 10:00 AM – 3:00 PM local time.',
      'Requires manager pre-approval and compliance with IT security.'
    ],
    relatedPolicies: ['IT Security Policy', 'Employee Handbook – Work Arrangements'],
    followUpQuestions: [
      'What are the in-office expectations?',
      'How do I request remote work?',
      'What equipment is provided?',
      'How is performance measured remotely?'
    ]
  });

  // Handle Search / Ask Submission
  const handleQuerySubmit = async (queryText?: string) => {
    const q = (queryText || queryInput).trim();
    if (!q) return;

    setIsProcessing(true);
    try {
      const resp = await askQuestion(q, deptFilter, 'Last 30 days');
      setAiAnswer({
        question: q,
        answer: resp.answer,
        confidence: resp.confidence_score,
        responseTime: resp.response_time_seconds,
        sourcesCount: resp.sources_count,
        citations: resp.citations,
        keyPoints: resp.key_points || [],
        relatedPolicies: resp.related_policies || [],
        followUpQuestions: resp.follow_up_questions || []
      });
      if (resp.citations && resp.citations.length > 0) {
        setActiveCitation(resp.citations[0]);
        const found = documents.find((d) => d.id === resp.citations[0].document_id);
        setActiveDocContext(found || null);
        setShowRightInspector(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCitationClick = (citation: Citation) => {
    setActiveCitation(citation);
    const found = documents.find((d) => d.id === citation.document_id);
    setActiveDocContext(found || null);
    setInspectorTab('citation');
    setShowRightInspector(true);
  };

  const handleDocumentRowClick = (doc: DocumentItem) => {
    setActiveDocContext(doc);
    setActiveCitation(null);
    setInspectorTab('citation');
    setShowRightInspector(true);
    onSelectDocument(doc);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Render text with clickable citation badges [1], [2] (Docent Corp style)
  const renderFormattedText = (text: string, citations?: Citation[]) => {
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((part, i) => {
      const match = part.match(/\[(\d+)\]/);
      if (match && citations) {
        const citationId = parseInt(match[1], 10);
        const cit = citations.find((c) => c.id === citationId);
        const isActive = activeCitation?.id === citationId;
        return (
          <button
            key={i}
            onClick={() => cit && handleCitationClick(cit)}
            title={cit ? `${cit.document_name} (${cit.source_name})` : 'View citation'}
            className={`inline-flex items-center justify-center mx-1 px-1.5 py-0.2 rounded font-mono text-[11px] font-bold transition-all active:scale-95 cursor-pointer ring-1 ${
              isActive
                ? 'bg-blue-600 text-white ring-blue-400 shadow-sm'
                : 'bg-blue-500/15 text-blue-500 hover:bg-blue-600 hover:text-white ring-blue-500/30'
            }`}
          >
            {citationId}
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const getFormatIcon = (type: DocumentType) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-3.5 h-3.5 text-rose-500" />;
      case 'DOCX':
        return <FileText className="w-3.5 h-3.5 text-blue-500" />;
      case 'XLSX':
        return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />;
      case 'PPTX':
        return <Presentation className="w-3.5 h-3.5 text-amber-500" />;
      case 'URL':
        return <Globe className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <File className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  // Pre-retrieval role filtering
  const filteredDocs = documents.filter((doc) => {
    if (userRole === 'Employee' && (doc.confidentiality === 'Restricted' || doc.confidentiality === 'Confidential')) {
      return false;
    }
    if (typeFilter !== 'All Types' && doc.type !== typeFilter) return false;
    if (deptFilter !== 'All' && doc.department.toLowerCase() !== deptFilter.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="flex-1 flex min-h-0 overflow-hidden">
      {/* ============================================================== */}
      {/* CENTER STAGE: THE INTEGRATED KNOWLEDGE COMMAND HUB              */}
      {/* ============================================================== */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 min-w-0">
        
        {/* TOP ZONE: Unified Omnipresent AI Ask & Search Command Bar (Images 2 & 5) */}
        <div
          className={`p-4 rounded-2xl border shadow-lg transition-all relative overflow-hidden ${
            isDark
              ? 'bg-[#111827] border-slate-800/90 shadow-blue-950/20'
              : 'bg-white border-slate-200/90 shadow-slate-200/60'
          }`}
        >
          {/* Subtle Top Glowing Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 opacity-80" />

          {/* Input & Action Row */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4" />
            </div>

            <div className="flex-1 relative">
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleQuerySubmit();
                }}
                placeholder="Ask any question or search across enterprise knowledge (e.g. travel per-diem, Q4 deck, remote work)..."
                className={`w-full py-2 px-1 text-xs bg-transparent focus:outline-none placeholder:text-slate-400 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
                  filterDrawerOpen
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              <button
                onClick={() => handleQuerySubmit()}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-98 transition-all disabled:opacity-50"
              >
                <span>{isProcessing ? 'Synthesizing...' : 'Ask Hub'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Under-Search Bar: Connected Integration Chips & Suggested Queries (Images 2 & 5) */}
          <div className="mt-3 pt-3 border-t border-slate-800/40 flex flex-wrap items-center justify-between gap-2.5">
            {/* Live Connected Source Status Chips (From Image 2 Ask AI) */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mr-1">
                Connected:
              </span>
              {[
                { name: 'Slack', dot: 'bg-emerald-500' },
                { name: 'Notion', dot: 'bg-emerald-500' },
                { name: 'Google Drive', dot: 'bg-emerald-500' },
                { name: 'Box', dot: 'bg-emerald-500' },
                { name: 'Docs', dot: 'bg-emerald-500' }
              ].map((src) => (
                <div
                  key={src.name}
                  className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-medium ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>{src.name}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${src.dot}`}></span>
                </div>
              ))}
            </div>

            {/* Quick Suggested Prompts (From Image 2 Ask AI) */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
              {[
                { label: 'Remote Work Policy', q: 'What is our remote work policy?' },
                { label: 'Travel Per-Diem', q: 'What is our expense reimbursement meal allowance?' },
                { label: 'Q4 Sales Deck', q: 'Show me the Q4 sales deck and recurring revenue model' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuerySubmit(item.q)}
                  className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-medium transition-all truncate ${
                    isDark
                      ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-blue-500/50 hover:text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 shadow-xs'
                  }`}
                >
                  ⚡ {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE ZONE: AI Grounded Synthesis & Citations Card (Images 2, 4, 5) */}
        {aiAnswer && (
          <div
            className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
              isDark
                ? 'bg-gradient-to-br from-[#111827] via-slate-900 to-blue-950/20 border-slate-800 text-slate-200'
                : 'bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 border-blue-200/80 text-slate-800 shadow-sm'
            }`}
          >
            {/* Header: Status, Confidence, Latency, Sources */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/40">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  <span>AI Grounded Synthesis</span>
                </span>
                <span className="text-xs text-slate-400 font-medium truncate max-w-sm">
                  &quot;{aiAnswer.question}&quot;
                </span>
              </div>

              {/* Stats badges from Images 2 & 5 */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3 text-blue-400" />
                  <span>{aiAnswer.responseTime}s</span>
                </div>
                <span className="text-slate-600">•</span>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Layers className="w-3 h-3 text-indigo-400" />
                  <span>{aiAnswer.sourcesCount} sources</span>
                </div>
                <span className="text-slate-600">•</span>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px] border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{aiAnswer.confidence}% Confidence</span>
                </div>
              </div>
            </div>

            {/* Formatted Synthesized Answer Body with Docent Corp Clickable Citations */}
            <div className="py-3 text-[12.5px] leading-relaxed whitespace-pre-line select-text">
              {renderFormattedText(aiAnswer.answer, aiAnswer.citations)}
            </div>

            {/* Citation Pill Preview Strip (Docent Corp Image 4) */}
            <div className="pt-2 border-t border-slate-800/40 flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Active Sources:
              </span>
              {aiAnswer.citations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCitationClick(c)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-medium transition-all ${
                    activeCitation?.id === c.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                  }`}
                >
                  <span className="font-mono font-bold text-[10px] text-blue-400">[{c.id}]</span>
                  <span className="truncate max-w-[160px]">{c.document_name}</span>
                  <span className="text-[9px] opacity-70">p.{c.page_number}</span>
                </button>
              ))}
            </div>

            {/* Follow-up Question Pills (Image 2) & Actions */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/40 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-semibold mr-1">Follow up:</span>
                {aiAnswer.followUpQuestions.map((fq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuerySubmit(fq)}
                    className={`px-2 py-0.5 rounded-lg border text-[10px] font-medium transition-all ${
                      isDark
                        ? 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-blue-500 hover:text-white'
                        : 'bg-slate-100/70 border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {fq}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <button
                  onClick={() => handleCopy(aiAnswer.answer, 'main')}
                  className="p-1 rounded-lg hover:text-white transition-colors"
                  title="Copy answer"
                >
                  {copiedId === 'main' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button className="p-1 rounded-lg hover:text-white transition-colors" title="Helpful">
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button className="p-1 rounded-lg hover:text-white transition-colors" title="Not helpful">
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* METRICS & HEALTH STRIP (Synthesizing Images 1 & 3) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          <StatCard
            title="Total Documents"
            value="1,248"
            delta={{
              value: "+18%",
              trend: "up",
              label: "vs last month",
            }}
            icon={<FileText className="w-3.5 h-3.5 text-blue-400" />}
          />
          <StatCard
            title="Total Size"
            value="24.6"
            unit="GB"
            delta={{
              value: "+12%",
              trend: "up",
              label: "vs last month",
            }}
            icon={<Database className="w-3.5 h-3.5 text-purple-400" />}
          />
          <StatCard
            title="Connected Sources"
            value="38"
            delta={{
              value: "+15%",
              trend: "up",
              label: "active",
            }}
            icon={<Share2 className="w-3.5 h-3.5 text-emerald-400" />}
          />
          <StatCard
            title="AI Queries"
            value="4.2K"
            delta={{
              value: "+22%",
              trend: "up",
              label: "queries",
            }}
            icon={<Sparkles className="w-3.5 h-3.5 text-amber-400" />}
          />

          {/* Card 5: Knowledge Health (Donut / Progress from Image 1) */}
          <div
            className={`col-span-2 sm:col-span-4 lg:col-span-1 p-3.5 rounded-2xl border flex items-center justify-between ${
              isDark
                ? "bg-[#0c1017] border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Health
              </span>
              <div className="text-2xl font-mono font-bold text-emerald-400">92%</div>
              <span className="text-[10px] text-slate-400">Verified Fresh</span>
            </div>
            <div className="w-12 h-12 relative flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className={isDark ? "text-slate-800" : "text-slate-100"}
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500"
                  strokeDasharray="92, 100"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* BOTTOM ZONE: Knowledge Repository Table with Moveworks Faceted Filter Drawer */}
        <div
          className={`rounded-2xl border overflow-hidden transition-all ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          {/* Table Header Bar */}
          <div className="p-4 border-b border-slate-800/40 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold flex items-center gap-2">
                <span>Enterprise Knowledge Repositories</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {filteredDocs.length} Documents
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Grounded knowledge indexed in pgvector with pre-retrieval role security.
              </p>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`text-xs py-1.5 px-2.5 rounded-xl border focus:outline-none cursor-pointer ${
                  isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <option value="All Types">All Formats</option>
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
                <option value="XLSX">XLSX</option>
                <option value="PPTX">PPTX</option>
                <option value="URL">URL</option>
                <option value="TXT">TXT</option>
              </select>

              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className={`text-xs py-1.5 px-2.5 rounded-xl border focus:outline-none cursor-pointer ${
                  isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <option value="All">All Departments</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Legal">Legal</option>
                <option value="IT">IT</option>
              </select>

              <button
                onClick={onOpenAddDoc}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
              >
                + Add Doc
              </button>
            </div>
          </div>

          {/* Moveworks Slide-Out Filter Drawer (When toggled open) */}
          {filterDrawerOpen && (
            <div className={`p-4 border-b grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <span className="font-bold text-[11px] block mb-1.5 text-slate-400">Sources:</span>
                {['All (19)', 'Google Drive (10)', 'Box (5)', 'Slack (2)'].map((s, i) => (
                  <label key={i} className="flex items-center gap-1.5 py-0.5 cursor-pointer">
                    <input type="checkbox" defaultChecked={i === 0} className="rounded text-blue-600" />
                    <span>{s}</span>
                  </label>
                ))}
              </div>

              <div>
                <span className="font-bold text-[11px] block mb-1.5 text-slate-400">Security Clearance:</span>
                {['Public (Verified)', 'Internal Use', 'Restricted (Execs)'].map((s, i) => (
                  <label key={i} className="flex items-center gap-1.5 py-0.5 cursor-pointer">
                    <input type="checkbox" defaultChecked={i < 2} className="rounded text-blue-600" />
                    <span>{s}</span>
                  </label>
                ))}
              </div>

              <div>
                <span className="font-bold text-[11px] block mb-1.5 text-slate-400">Verification Status:</span>
                {['Healthy Fresh (92%)', 'Needs Review (6%)', 'Outdated (2%)'].map((s, i) => (
                  <label key={i} className="flex items-center gap-1.5 py-0.5 cursor-pointer">
                    <input type="checkbox" defaultChecked={i === 0} className="rounded text-blue-600" />
                    <span>{s}</span>
                  </label>
                ))}
              </div>

              <div>
                <span className="font-bold text-[11px] block mb-1.5 text-slate-400">Vector Storage:</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  pgvector HNSW cosine index synced. Active dimension: 1536-dim (Gemini).
                </p>
              </div>
            </div>
          )}

          {/* Table Body */}
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b text-[11px] font-semibold text-slate-400 ${
                isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/60'
              }`}>
                <th className="py-2.5 px-4">Document</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Source & Owner</th>
                <th className="py-2.5 px-3">AI Queries</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredDocs.map((doc) => {
                const isSelected = activeDocContext?.id === doc.id;
                return (
                  <tr
                    key={doc.id}
                    onClick={() => handleDocumentRowClick(doc)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? isDark ? 'bg-blue-600/15' : 'bg-blue-50/80'
                        : isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Document Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                          isDark ? 'bg-slate-800' : 'bg-slate-100'
                        }`}>
                          {getFormatIcon(doc.type)}
                        </div>
                        <div className="overflow-hidden">
                          <span className="font-semibold block truncate text-xs hover:text-blue-500">
                            {doc.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {doc.department} • {doc.size_mb} MB • {doc.version}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Format Badge */}
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-700/30 text-slate-300 border border-slate-700/50">
                        {doc.type}
                      </span>
                    </td>

                    {/* Source & Owner */}
                    <td className="py-3 px-3">
                      <span className="block font-medium">{doc.source}</span>
                      <span className="text-[10px] text-slate-400 block">{doc.author}</span>
                    </td>

                    {/* AI Usage */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-semibold">{doc.ai_usage}</span>
                        <div className="flex items-end gap-0.5 h-3">
                          <div className="w-1 bg-blue-500/40 rounded-t h-1.5" />
                          <div className="w-1 bg-blue-500/70 rounded-t h-2.5" />
                          <div className="w-1 bg-blue-500 rounded-t h-3" />
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        doc.status === 'Healthy'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : doc.status === 'Needs Review'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}>
                        {doc.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setOpenMenuId(openMenuId === doc.id ? null : doc.id)}
                          className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {openMenuId === doc.id && (
                          <div className={`absolute right-0 mt-1 w-32 rounded-xl border shadow-xl z-20 py-1 ${
                            isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                          }`}>
                            <button
                              onClick={() => {
                                handleDocumentRowClick(doc);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs hover:bg-blue-600 hover:text-white flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" /> Inspect
                            </button>
                            <button
                              onClick={() => {
                                onDeleteDocument(doc.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs text-rose-500 hover:bg-rose-600 hover:text-white flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT RAIL: THE DOCENT CORP SPLIT-SCREEN CITATION & CONTEXT     */}
      {/* INSPECTOR + GURU ANALYTICS (Images 3 & 4)                       */}
      {/* ============================================================== */}
      {showRightInspector && (
        <div
          className={`w-96 flex-shrink-0 border-l flex flex-col h-full overflow-hidden transition-all duration-200 select-none ${
            isDark
              ? 'bg-[#0f1422] border-slate-800 text-slate-200'
              : 'bg-white border-slate-200 text-slate-800 shadow-xl'
          }`}
        >
          {/* Inspector Header & Tab Switcher */}
          <div className={`p-3 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setInspectorTab('citation')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  inspectorTab === 'citation'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Citation Inspector
              </button>
              <button
                onClick={() => setInspectorTab('analytics')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  inspectorTab === 'analytics'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Guru Analytics
              </button>
            </div>

            <button
              onClick={() => setShowRightInspector(false)}
              className="p-1 rounded-lg hover:bg-slate-700/50 text-slate-400"
              title="Collapse Inspector"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Inspector Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {inspectorTab === 'citation' ? (
              /* TAB 1: Docent Corp Live Split-Screen Citation Inspector (Image 4) */
              <div className="space-y-4">
                {/* Document Header Card */}
                <div className={`p-3.5 rounded-xl border space-y-2 ${
                  isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="overflow-hidden">
                      <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider block">
                        {activeCitation ? `Citation Reference [${activeCitation.id}]` : 'Document Context'}
                      </span>
                      <h3 className="text-xs font-bold mt-0.5 line-clamp-2">
                        {activeCitation?.document_name || activeDocContext?.name || 'Expense Reimbursement Policy.pdf'}
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {activeCitation?.source_name || `${activeDocContext?.source || 'HR Team'} • Updated 2026`}
                      </p>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                      {activeDocContext?.confidentiality || 'Internal'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-2 border-t border-dashed border-slate-700/50">
                    <div>Page: <strong>{activeCitation?.page_number || 1}</strong></div>
                    <div>Department: <strong>{activeDocContext?.department || 'Operations'}</strong></div>
                  </div>
                </div>

                {/* Highlighted Quote Excerpt (Exact replica of Docent Corp Image 4) */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                    Grounded Text Chunk (Vector Match)
                  </span>

                  <div className={`p-3.5 rounded-xl border text-xs leading-relaxed relative ${
                    isDark
                      ? 'bg-blue-950/20 border-blue-800/50 text-slate-200'
                      : 'bg-blue-50/80 border-blue-200 text-slate-800'
                  }`}>
                    <span className="font-semibold block mb-1 text-blue-500 text-[11px]">
                      {activeCitation?.section_heading || 'Section 2.1: Operational Guidelines'}
                    </span>
                    <p className="font-serif italic text-[12.5px] leading-relaxed select-text">
                      &quot;{activeCitation?.quote ||
                        activeDocContext?.chunks?.[0]?.content ||
                        "Acme Corp's remote work policy is designed to support flexibility while maintaining productivity and alignment. Employees can work remotely up to 3 days per week with manager coordination. Core collaboration hours are 10:00 AM - 3:00 PM local time across all timezones."}&quot;
                    </p>
                  </div>
                </div>

                {/* Surrounding Context Chunk */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                    Surrounding Section Context
                  </span>
                  <div className={`p-3 rounded-xl border text-[11px] font-mono leading-relaxed space-y-1.5 text-slate-400 select-text ${
                    isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <p>[Embedding Chunk #104 • pgvector Cosine Score: 0.96]</p>
                    <p>
                      ...All requests for equipment or remote setup must be filed through the internal IT Service Desk. Exceptions require written Vice President consent...
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => alert(`Downloading full document: ${activeCitation?.document_name || activeDocContext?.name}`)}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </button>
                  <button
                    onClick={() => handleCopy(activeCitation?.quote || '', 'quote')}
                    className="p-2 rounded-xl border hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                    title="Copy excerpt"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* TAB 2: Guru Analytics & Knowledge Health (Image 3) */
              <div className="space-y-4">
                {/* Most Viewed Cards (Image 3) */}
                <div className={`p-3.5 rounded-xl border space-y-2.5 ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-xs font-bold text-slate-300 block">
                    Most Viewed Cards (Guru Analytics)
                  </span>
                  <div className="space-y-2 text-xs">
                    {[
                      { title: 'Directory of Company Terminology', views: '1.5K' },
                      { title: 'Internal Certification Program', views: '1.2K' },
                      { title: 'Subject Matter Experts - GTM', views: '927' },
                      { title: 'Product & Eng Learning Roadmaps', views: '746' }
                    ].map((c, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="truncate max-w-[190px] text-slate-400">{c.title}</span>
                        <span className="font-bold text-blue-500">{c.views}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Most Favorited Horizontal Mint Bars (Image 3) */}
                <div className={`p-3.5 rounded-xl border space-y-2.5 ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-xs font-bold text-slate-300 block">
                    Most Favorited Knowledge (Mint Bars)
                  </span>
                  <div className="space-y-2 pt-1">
                    {[
                      { title: 'Professional development budget', pct: 95 },
                      { title: 'Directory of Terminology', pct: 78 },
                      { title: 'Security Certification SOP', pct: 58 },
                      { title: 'CS Team Skills Training', pct: 42 }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="truncate max-w-[190px] text-slate-400">{item.title}</span>
                          <span className="font-bold text-emerald-400">{item.pct}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-md h-3.5 overflow-hidden">
                          <div
                            className="bg-[#4ADE80] h-3.5 rounded-md transition-all duration-700"
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Knowledge Gap Callout */}
                <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                  isDark ? 'bg-amber-950/20 border-amber-800/40 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  <span className="font-bold block">⚡ Active Knowledge Gap Detected</span>
                  <p className="text-[11px] opacity-90 leading-relaxed">
                    &quot;International Travel & Forex Policy&quot; was queried 42 times without an approved policy document.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
