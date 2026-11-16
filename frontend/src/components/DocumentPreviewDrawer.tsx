'use client';

import React from 'react';
import {
  X,
  FileText,
  Download,
  Copy,
  ExternalLink,
  ShieldAlert,
  Calendar,
  User,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { Citation, DocumentItem } from '@/types';

interface DocumentPreviewDrawerProps {
  citation: Citation | null;
  document: DocumentItem | null;
  onClose: () => void;
  isDark: boolean;
}

export default function DocumentPreviewDrawer({
  citation,
  document,
  onClose,
  isDark
}: DocumentPreviewDrawerProps) {
  const [copied, setCopied] = React.useState(false);

  if (!citation && !document) return null;

  const title = citation ? citation.document_name : document?.name || 'Document Details';
  const pageNumber = citation ? citation.page_number : 1;
  const section = citation ? citation.section_heading : 'General Knowledge Section';
  const quoteText = citation
    ? citation.quote
    : document?.chunks?.[0]?.content ||
      'This document is indexed in the Enterprise Knowledge Hub pgvector store with verified metadata.';
  const department = document?.department || 'Operations';
  const confidentiality = document?.confidentiality || 'Internal';

  const handleCopy = () => {
    navigator.clipboard.writeText(quoteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`w-96 flex-shrink-0 border-l flex flex-col h-full overflow-hidden transition-all duration-300 animate-in slide-in-from-right select-none ${
        isDark
          ? 'bg-[#0f1422] border-slate-800 text-slate-200'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Drawer Header */}
      <div className={`p-4 border-b flex items-center justify-between ${
        isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-slate-50/70'
      }`}>
        <div className="flex items-center gap-2 overflow-hidden">
          <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <span className="text-xs font-bold truncate">
            {citation ? `Citation Reference [${citation.id}]` : 'Document Context'}
          </span>
        </div>
        <button
          onClick={onClose}
          className={`p-1 rounded-lg transition-colors ${
            isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Document Title Banner */}
        <div className={`p-3 rounded-xl border ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold text-blue-500 line-clamp-2">
                {title}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Page {pageNumber} • {section}
              </p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              confidentiality === 'Restricted'
                ? 'bg-rose-500/20 text-rose-400'
                : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {confidentiality}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-slate-400 border-t pt-2.5 border-dashed border-slate-700/50">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>Effective: 2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-3 h-3 text-slate-500" />
              <span>Dept: {department}</span>
            </div>
          </div>
        </div>

        {/* Highlighted Quote Excerpt (Matches Docent Corp Screen Image 4) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Exact Chunk Excerpt
            </span>
            {citation && (
              <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {Math.round(citation.confidence * 100)}% Match
              </span>
            )}
          </div>

          <div
            className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all relative ${
              isDark
                ? 'bg-blue-950/20 border-blue-800/40 text-slate-200'
                : 'bg-blue-50/60 border-blue-200 text-slate-800'
            }`}
          >
            <div className="absolute top-2 right-2">
              <button
                onClick={handleCopy}
                title="Copy excerpt"
                className={`p-1.5 rounded-lg border text-[10px] flex items-center gap-1 transition-all ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
                    : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Copy className="w-3 h-3" />
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <span className="font-semibold block mb-1 text-blue-500">
              {section}
            </span>
            <p className="font-serif italic text-[13px] leading-relaxed select-text pr-12">
              &quot;{quoteText}&quot;
            </p>
          </div>
        </div>

        {/* Full Surrounding Context Mock */}
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Surrounding Section Context
          </span>
          <div
            className={`p-3 rounded-xl border text-[11px] font-mono leading-relaxed space-y-2 select-text ${
              isDark
                ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <p>
              [Chunk Seq #12 • Vector Dimension: 1536 (OpenAI / Gemini Embeddings)]
            </p>
            <p>
              ...All employees are advised to consult this document prior to incurring corporate liabilities. Policy exceptions require written VP approval...
            </p>
            <p className={`p-1.5 rounded font-medium ${
              isDark ? 'bg-blue-500/10 text-blue-300' : 'bg-blue-100 text-blue-900'
            }`}>
              &gt;&gt;&gt; Active Grounding Window &lt;&lt;&lt;
            </p>
          </div>
        </div>
      </div>

      {/* Drawer Action Footer */}
      <div className={`p-3.5 border-t flex items-center gap-2 ${
        isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
      }`}>
        <button
          onClick={() => alert(`Simulated downloading full file: ${title}`)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Document</span>
        </button>
        <button
          onClick={() => alert(`Opening document in original repository: ${title}`)}
          title="Open in source repository"
          className={`p-2 rounded-xl border transition-all ${
            isDark
              ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
              : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
