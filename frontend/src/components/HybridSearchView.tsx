'use client';

import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  FileText,
  FileSpreadsheet,
  Globe,
  Share2,
  Calendar,
  User,
  CheckSquare,
  Square,
  X
} from 'lucide-react';
import { DocumentItem, DocumentType, UserRole } from '@/types';
import { searchHybrid } from '@/lib/api';

interface HybridSearchViewProps {
  onSelectDocument: (doc: DocumentItem) => void;
  allDocuments: DocumentItem[];
  userRole: UserRole;
  isDark: boolean;
}

export default function HybridSearchView({
  onSelectDocument,
  allDocuments,
  userRole,
  isDark
}: HybridSearchViewProps) {
  const [searchQuery, setSearchQuery] = useState('Q4 sales deck');
  const [isSearching, setIsSearching] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(true);
  const [selectedSources, setSelectedSources] = useState<string[]>(['All']);
  const [contentType, setContentType] = useState('All');
  const [authorFilter, setAuthorFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('Custom');

  const [searchData, setSearchData] = useState({
    ai_summary:
      'I found several resources for Q4 sales presentations. These include documents on sales all hands, value framework services team and roadmap decks [1]. Additionally, there are Slack channels and meetings related to Q4 Sales topics [2]. The resources cover a range of topics including projections, celebrations of sales wins and impact of upcoming launches.',
    citations: ['1. FY24 Moveworks...', '2. Google Drive...'],
    results: [
      {
        id: 's-1',
        title: 'FY25 Moveworks Sales Deck Q4',
        type: 'PPTX' as DocumentType,
        source: 'Box',
        department: 'Sales',
        last_updated: 'Oct 22, 2026',
        author: 'Aisha Khan',
        excerpt:
          'In this document we capture the major contributors to the recurring revenue model in Q4 that we implemented with new service model. It also captures how we project the new...',
        score: 0.98
      },
      {
        id: 's-2',
        title: 'Q4 Value Framework 2.0 - Business Value Services',
        type: 'PDF' as DocumentType,
        source: 'Google Drive',
        department: 'Customer Success',
        last_updated: 'Oct 19, 2026',
        author: 'Carlos Rodriguez, Mei Ling',
        excerpt:
          'This document focuses on operationalizing a standard approach to positioning value messaging and value models. It includes building a framework that aligns business value with...',
        score: 0.94
      },
      {
        id: 's-3',
        title: 'Slack post • #q4-customer-success',
        type: 'TXT' as DocumentType,
        source: 'Slack',
        department: 'Customer Success',
        last_updated: 'Oct 2, 2026',
        author: 'Mei Ling',
        excerpt:
          'Hey CS team, I have found this interesting deck about Acme\'s ARR impacting business line, what\'s the best way to share it to your group for the right level of attention to...',
        score: 0.89
      }
    ]
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const resp = await searchHybrid(searchQuery);
      setSearchData({
        ai_summary: resp.ai_summary,
        citations: resp.summary_citations,
        results: resp.results
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleSource = (source: string) => {
    if (source === 'All') {
      setSelectedSources(['All']);
    } else {
      const withoutAll = selectedSources.filter((s) => s !== 'All');
      if (withoutAll.includes(source)) {
        const next = withoutAll.filter((s) => s !== source);
        setSelectedSources(next.length === 0 ? ['All'] : next);
      } else {
        setSelectedSources([...withoutAll, source]);
      }
    }
  };

  const sourceCounts = [
    { name: 'All', count: 19 },
    { name: 'Google Drive', count: 10 },
    { name: 'Box', count: 5 },
    { name: 'Slack', count: 2 },
    { name: 'Google Calendar', count: 1 },
    { name: 'Notion', count: 1 }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      {/* Search Header */}
      <div>
        <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Enterprise Hybrid Search
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Unified semantic vector retrieval combined with keyword BM25 filtering.
        </p>
      </div>

      {/* Big Moveworks-style Search Input Form */}
      <form onSubmit={handleSearch} className="relative">
        <div
          className={`flex items-center rounded-2xl border p-1 shadow-sm transition-all ${
            isDark
              ? 'bg-[#111827] border-slate-800 focus-within:border-blue-500'
              : 'bg-white border-slate-200 focus-within:border-blue-500'
          }`}
        >
          <Search className="w-5 h-5 ml-3 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all enterprise knowledge sources..."
            className={`w-full py-2.5 px-3 text-xs bg-transparent focus:outline-none ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Main Grid: Left Results (3 cols) + Right Filter Drawer (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Search Results & AI Summary (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Moveworks Synthesized AI Summary Card (Matches Screenshot 5) */}
          <div
            className={`p-4 rounded-2xl border relative overflow-hidden transition-all ${
              isDark
                ? 'bg-gradient-to-br from-[#111827] to-blue-950/20 border-slate-800 text-slate-200'
                : 'bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border-blue-200 text-slate-800 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  <span>Summary</span>
                </span>
              </div>

              {/* Citations chips */}
              <div className="flex items-center gap-2">
                {searchData.citations.map((c, i) => (
                  <span
                    key={i}
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                      isDark ? 'bg-slate-900 border-slate-700 text-blue-400' : 'bg-white border-blue-200 text-blue-600'
                    }`}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs leading-relaxed mt-2 text-slate-300">
              {searchData.ai_summary}
            </p>
          </div>

          {/* Results count & Controls */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span className="font-semibold">
              18 Results • 4 Sources
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px]">Sort by:</span>
              <select className={`text-[11px] py-1 px-2 rounded-lg border focus:outline-none ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                <option>Relevance</option>
                <option>Most Recent</option>
              </select>
            </div>
          </div>

          {/* Result Cards List */}
          <div className="space-y-3">
            {searchData.results.map((res) => (
              <div
                key={res.id}
                onClick={() => {
                  const match = allDocuments.find((d) => d.name.toLowerCase().includes(res.title.toLowerCase()));
                  if (match) onSelectDocument(match);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                  isDark
                    ? 'bg-[#111827] border-slate-800 hover:border-blue-500/60 hover:bg-slate-900/80'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 overflow-hidden">
                    <div className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${
                      isDark ? 'bg-slate-800' : 'bg-slate-100'
                    }`}>
                      <FileText className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className={`text-xs font-bold transition-colors truncate ${
                        isDark ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'
                      }`}>
                        {res.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                        <span className="font-semibold uppercase">{res.type} File</span>
                        <span>•</span>
                        <span>Last updated {res.last_updated}</span>
                        <span>•</span>
                        <span>{res.author}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
                    isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {Math.round(res.score * 100)}% Match
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed line-clamp-2">
                  {res.excerpt}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Filter Drawer (Matches Screenshot 5 Moveworks Filter Modal) */}
        <div>
          <div
            className={`p-5 rounded-2xl border sticky top-6 space-y-5 ${
              isDark
                ? 'bg-[#111827] border-slate-800 text-slate-200 shadow-xl'
                : 'bg-white border-slate-200 text-slate-800 shadow-md'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/40">
              <h2 className="text-sm font-bold">Filters</h2>
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            </div>

            {/* Sources Accordion */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold">
                  Sources: {selectedSources.length} selected
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="space-y-2 text-xs">
                {sourceCounts.map((src) => {
                  const isChecked = selectedSources.includes(src.name);
                  return (
                    <div
                      key={src.name}
                      onClick={() => toggleSource(src.name)}
                      className="flex items-center justify-between py-1 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <div className="flex items-center gap-2">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        )}
                        <span className="truncate">{src.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        {src.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content Type Accordion */}
            <div className="pt-2 border-t border-slate-800/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold">Content Type: {contentType}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className={`w-full text-xs py-1.5 px-2.5 rounded-xl border focus:outline-none ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <option>All</option>
                <option>Documents (PDF/DOCX)</option>
                <option>Spreadsheets (XLSX)</option>
                <option>Presentations (PPTX)</option>
                <option>Slack Conversations</option>
              </select>
            </div>

            {/* Author / Owner Accordion */}
            <div className="pt-2 border-t border-slate-800/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold">Author/Owner: {authorFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <select
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
                className={`w-full text-xs py-1.5 px-2.5 rounded-xl border focus:outline-none ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <option>All</option>
                <option>Aisha Khan</option>
                <option>Carlos Rodriguez</option>
                <option>Sarah Ahmed</option>
                <option>Nusrat Jahan</option>
              </select>
            </div>

            {/* Date Accordion */}
            <div className="pt-2 border-t border-slate-800/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold">Date: {dateFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className={`w-full text-xs py-1.5 px-2.5 rounded-xl border focus:outline-none ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <option>Custom</option>
                <option>Past 24 Hours</option>
                <option>Past Week</option>
                <option>Past Month</option>
                <option>Past Year</option>
              </select>
            </div>

            {/* Filter Results Action Button (Matches Screenshot 5) */}
            <button
              onClick={() => alert('Filter parameters applied to pgvector query')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              Filter results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
