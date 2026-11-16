'use client';

import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Globe,
  File,
  MoreVertical,
  SlidersHorizontal,
  ChevronDown,
  LayoutList,
  LayoutGrid,
  Info,
  TrendingUp,
  ArrowUpRight,
  Eye,
  Trash2,
  Share2,
  FolderTree,
  Database,
  Tag
} from 'lucide-react';
import { DocumentItem, DocumentType, UserRole } from '@/types';

interface KnowledgeBaseViewProps {
  documents: DocumentItem[];
  onSelectDocument: (doc: DocumentItem) => void;
  onOpenAddDoc: () => void;
  onDeleteDocument: (id: string) => void;
  userRole: UserRole;
  isDark: boolean;
}

export default function KnowledgeBaseView({
  documents,
  onSelectDocument,
  onOpenAddDoc,
  onDeleteDocument,
  userRole,
  isDark
}: KnowledgeBaseViewProps) {
  const [activeTab, setActiveTab] = useState<'All Content' | 'Folders' | 'Data Sources' | 'Tags'>('All Content');
  const [typeFilter, setTypeFilter] = useState<string>('All Types');
  const [sourceFilter, setSourceFilter] = useState<string>('All Sources');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Filter documents based on dropdowns and pre-retrieval role security
  const filteredDocs = documents.filter((doc) => {
    // PRD Module 2: Employee role cannot access Restricted/Confidential documents
    if (userRole === 'Employee' && (doc.confidentiality === 'Restricted' || doc.confidentiality === 'Confidential')) {
      return false;
    }
    if (typeFilter !== 'All Types' && doc.type !== typeFilter) return false;
    if (sourceFilter !== 'All Sources' && !doc.source.includes(sourceFilter)) return false;
    return true;
  });

  const getFormatBadge = (type: DocumentType) => {
    switch (type) {
      case 'PDF':
        return {
          icon: <FileText className="w-4 h-4 text-rose-500" />,
          badge: isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-50 text-rose-600 border border-rose-200'
        };
      case 'DOCX':
        return {
          icon: <FileText className="w-4 h-4 text-blue-500" />,
          badge: isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600 border border-blue-200'
        };
      case 'XLSX':
        return {
          icon: <FileSpreadsheet className="w-4 h-4 text-emerald-500" />,
          badge: isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
        };
      case 'PPTX':
        return {
          icon: <FileText className="w-4 h-4 text-amber-500" />,
          badge: isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-600 border border-amber-200'
        };
      case 'URL':
        return {
          icon: <Globe className="w-4 h-4 text-purple-500" />,
          badge: isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600 border border-purple-200'
        };
      default:
        return {
          icon: <File className="w-4 h-4 text-slate-500" />,
          badge: isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
        };
    }
  };

  const getSourceDotColor = (source: string) => {
    if (source.includes('HR')) return 'bg-emerald-500';
    if (source.includes('Finance')) return 'bg-purple-500';
    if (source.includes('Operations')) return 'bg-blue-500';
    if (source.includes('Legal')) return 'bg-amber-500';
    return 'bg-cyan-500';
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Top Header Title & Description */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Knowledge Base
          </h1>
          <Info className="w-4 h-4 text-slate-400 cursor-pointer" />
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Organize, manage and make your company knowledge accessible to AI agents.
        </p>
      </div>

      {/* Main Grid: 4 Metric Cards + Knowledge Health on the Right */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Metric Cards (3 cols in desktop, or 4 cols) */}
        <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Documents */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-medium">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                <FileText className="w-4 h-4" />
              </div>
              <span>Total Documents</span>
            </div>
            <div className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              1,248
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-500">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>18% vs last month</span>
            </div>
            {/* Sparkline curve */}
            <svg className="w-full h-8 mt-2 overflow-visible" viewBox="0 0 100 25">
              <path
                d="M0 20 Q 25 5, 50 18 T 100 8"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Card 2: Total Size */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-medium">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
                <Database className="w-4 h-4" />
              </div>
              <span>Total Size</span>
            </div>
            <div className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              24.6 GB
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-500">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>12% vs last month</span>
            </div>
            {/* Sparkline curve */}
            <svg className="w-full h-8 mt-2 overflow-visible" viewBox="0 0 100 25">
              <path
                d="M0 18 Q 20 22, 45 10 T 100 12"
                fill="none"
                stroke="#A855F7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Card 3: Sources */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-medium">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Share2 className="w-4 h-4" />
              </div>
              <span>Sources</span>
            </div>
            <div className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              38
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-500">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>15% vs last month</span>
            </div>
            {/* Sparkline curve */}
            <svg className="w-full h-8 mt-2 overflow-visible" viewBox="0 0 100 25">
              <path
                d="M0 16 Q 30 22, 60 8 T 100 10"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Card 4: AI Usage */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-medium">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <span>AI Usage</span>
            </div>
            <div className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              4.2K
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-500">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>22% vs last month</span>
            </div>
            {/* Sparkline curve */}
            <svg className="w-full h-8 mt-2 overflow-visible" viewBox="0 0 100 25">
              <path
                d="M0 22 Q 25 15, 50 19 T 100 6"
                fill="none"
                stroke="#F97316"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Right Rail Card 1: Knowledge Health Donut (Matching Image 1 Nexora) */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
          isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Knowledge Health
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 py-1">
            {/* Circular Gauge */}
            <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className={isDark ? 'text-slate-800' : 'text-slate-100'}
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 transition-all duration-1000"
                  strokeDasharray="92, 100"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  92%
                </span>
                <span className="text-[8px] uppercase tracking-wider text-slate-400 font-semibold">
                  Healthy
                </span>
              </div>
            </div>

            {/* Health Legend Breakdown */}
            <div className="text-[11px] space-y-1.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Healthy
                </span>
                <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>92%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Needs Review
                </span>
                <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>6%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Outdated
                </span>
                <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Data Table (3 cols) + Top Accessed / Recent Activity (1 col) */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Column: Tabs, Filter Toolbar & Document Table (3 cols) */}
        <div className="xl:col-span-3 space-y-4">
          {/* Content Tabs */}
          <div className="flex items-center gap-6 border-b border-slate-700/40 text-xs font-semibold pb-2">
            {(['All Content', 'Folders', 'Data Sources', 'Tags'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`transition-colors relative pb-2 ${
                  activeTab === tab
                    ? 'text-blue-500 border-b-2 border-blue-500 -mb-2.5 font-bold'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Filter Bar matching Nexora screenshot */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2.5">
              {/* Type Filter */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className={`text-xs py-1.5 px-3 pr-8 rounded-xl border focus:outline-none cursor-pointer appearance-none ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                  }`}
                >
                  <option value="All Types">All Types</option>
                  <option value="PDF">PDF</option>
                  <option value="DOCX">DOCX</option>
                  <option value="XLSX">XLSX</option>
                  <option value="PPTX">PPTX</option>
                  <option value="URL">URL</option>
                  <option value="TXT">TXT</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              {/* Source Filter */}
              <div className="relative">
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className={`text-xs py-1.5 px-3 pr-8 rounded-xl border focus:outline-none cursor-pointer appearance-none ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                  }`}
                >
                  <option value="All Sources">All Sources</option>
                  <option value="HR">HR Team</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                  <option value="Legal">Legal</option>
                  <option value="IT">IT Team</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              {/* Advanced Filters Button */}
              <button
                className={`flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-xl border transition-all ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
                    : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700 shadow-sm'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>

            {/* View Mode & Sort */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center p-0.5 rounded-xl border ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? isDark ? 'bg-slate-800 text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-400'
                  }`}
                >
                  <LayoutList className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? isDark ? 'bg-slate-800 text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-400'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="relative">
                <select
                  className={`text-xs py-1.5 px-3 pr-8 rounded-xl border focus:outline-none cursor-pointer appearance-none ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                  }`}
                >
                  <option>Recently Updated</option>
                  <option>Most Viewed</option>
                  <option>Highest AI Usage</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Document Table (List View) */}
          <div className={`rounded-2xl border overflow-hidden ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-semibold text-slate-400 ${
                  isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/60'
                }`}>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Source</th>
                  <th className="py-3 px-3">AI Usage</th>
                  <th className="py-3 px-3">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-xs">
                {filteredDocs.map((doc) => {
                  const format = getFormatBadge(doc.type);
                  return (
                    <tr
                      key={doc.id}
                      onClick={() => onSelectDocument(doc)}
                      className={`group cursor-pointer transition-colors ${
                        isDark ? 'hover:bg-slate-800/50' : 'hover:bg-blue-50/40'
                      }`}
                    >
                      {/* Name Column */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl flex-shrink-0 ${
                            isDark ? 'bg-slate-800' : 'bg-slate-100'
                          }`}>
                            {format.icon}
                          </div>
                          <div className="overflow-hidden">
                            <span className={`font-semibold block truncate ${
                              isDark ? 'text-slate-100 group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'
                            }`}>
                              {doc.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {doc.department} Policies • {doc.size_mb} MB
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Type Column */}
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${format.badge}`}>
                          {doc.type}
                        </span>
                      </td>

                      {/* Source Column */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${getSourceDotColor(doc.source)}`}></span>
                          <span className="text-slate-400 font-medium truncate">{doc.source}</span>
                        </div>
                      </td>

                      {/* AI Usage Mini Sparkline */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                            {doc.ai_usage}
                          </span>
                          {/* Mini vertical sparkline bars */}
                          <div className="flex items-end gap-0.5 h-3">
                            <div className="w-1 bg-blue-500/40 rounded-t h-1.5" />
                            <div className="w-1 bg-blue-500/60 rounded-t h-2" />
                            <div className="w-1 bg-blue-500 rounded-t h-3" />
                            <div className="w-1 bg-blue-500/70 rounded-t h-2.5" />
                          </div>
                        </div>
                      </td>

                      {/* Last Updated */}
                      <td className="py-3 px-3">
                        <span className={`block font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                          {doc.last_updated}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {doc.author}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setOpenMenuId(openMenuId === doc.id ? null : doc.id)}
                            className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {openMenuId === doc.id && (
                            <div className={`absolute right-0 mt-1 w-36 rounded-xl border shadow-xl z-20 py-1 ${
                              isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                            }`}>
                              <button
                                onClick={() => {
                                  onSelectDocument(doc);
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-blue-600 hover:text-white flex items-center gap-2"
                              >
                                <Eye className="w-3.5 h-3.5" /> Preview
                              </button>
                              <button
                                onClick={() => {
                                  onDeleteDocument(doc.id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-rose-600 hover:text-white text-rose-500 flex items-center gap-2"
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

            {/* Pagination footer */}
            <div className={`py-3 px-4 border-t flex items-center justify-between text-xs text-slate-400 ${
              isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-100 bg-slate-50/40'
            }`}>
              <span>Showing 1 to {filteredDocs.length} of 1,248 results</span>
              <div className="flex items-center gap-1">
                <button className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-blue-500 ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-200'
                }`}>
                  1
                </button>
                <button className="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center">
                  2
                </button>
                <button className="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center">
                  3
                </button>
                <span className="px-1">...</span>
                <button className="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center">
                  156
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column: Top Accessed + Recent Activity (Matches Image 1) */}
        <div className="space-y-6">
          {/* Top Accessed Card */}
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Top Accessed
              </span>
              <button className="text-[11px] text-blue-500 hover:underline font-semibold">
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'Expense Reimbursement Policy.pdf', views: '312 views', type: 'PDF' },
                { name: 'Vendor Management Guidelines.docx', views: '245 views', type: 'DOCX' },
                { name: 'Pricing & Discount Matrix.xlsx', views: '189 views', type: 'XLSX' },
                { name: 'Onboarding Process Overview.pptx', views: '156 views', type: 'PPTX' },
                { name: 'Industry Regulations & Compliance', views: '142 views', type: 'URL' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    {item.type === 'PDF' && <FileText className="w-3.5 h-3.5 text-rose-500" />}
                    {item.type === 'DOCX' && <FileText className="w-3.5 h-3.5 text-blue-500" />}
                    {item.type === 'XLSX' && <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />}
                    {item.type === 'PPTX' && <Presentation className="w-3.5 h-3.5 text-amber-500" />}
                    {item.type === 'URL' && <Globe className="w-3.5 h-3.5 text-purple-500" />}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <span className={`text-xs font-semibold block truncate ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{item.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Recent Activity
              </span>
              <button className="text-[11px] text-blue-500 hover:underline font-semibold">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Vendor Management Guidelines.docx', sub: 'Updated by Rafiq Hasan', time: '10:42 AM' },
                { title: 'Expense Reimbursement Policy.pdf', sub: 'Viewed by AI Agent - Finance Agent', time: '10:35 AM' },
                { title: 'Pricing & Discount Matrix.xlsx', sub: 'Indexed successfully in pgvector', time: '10:30 AM' },
                { title: 'Q1 Financial Report 2026.pdf', sub: 'Updated by Nusrat Jahan', time: '10:18 AM' },
                { title: 'IT Security Best Practices.docx', sub: 'Added by Jahid Hasan', time: '10:05 AM' }
              ].map((act, idx) => (
                <div key={idx} className="flex items-start justify-between gap-2 text-xs">
                  <div className="overflow-hidden">
                    <span className={`font-semibold block truncate ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      {act.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {act.sub}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
