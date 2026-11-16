'use client';

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  Database,
  Building,
  User,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { UserRole } from '@/types';

interface SettingsViewProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isDark: boolean;
}

export default function SettingsView({ userRole, setUserRole, isDark }: SettingsViewProps) {
  const [embeddingModel, setEmbeddingModel] = useState('text-embedding-004 (Gemini)');
  const [similarityThreshold, setSimilarityThreshold] = useState('0.75');
  const [chunkSize, setChunkSize] = useState('512');
  const [chunkOverlap, setChunkOverlap] = useState('64');

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Platform Settings & RBAC Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage organization profiles, vector indexing parameters, and tenant isolation policies (PRD Modules 1, 2, 9).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Role-Based Access Control Switcher & Policy Card */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800/40">
            <Shield className="w-4 h-4 text-emerald-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Active Security Role (Pre-Retrieval Guard)
            </h2>
          </div>

          <p className="text-xs text-slate-400">
            PRD Module 2 Requirement: Access control must be enforced before pgvector retrieval. Restricted documents will never be passed to the LLM context when viewed by unauthorized roles.
          </p>

          <div className="space-y-2">
            {(['Super Admin', 'Company Admin', 'Department Head', 'Employee'] as UserRole[]).map((role) => (
              <div
                key={role}
                onClick={() => setUserRole(role)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  userRole === role
                    ? 'bg-blue-600/15 border-blue-500 text-blue-400 font-bold'
                    : isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <span className="text-xs">{role}</span>
                  <span className="text-[10px] text-slate-400 block font-normal">
                    {role === 'Employee'
                      ? 'Access to public & internal department documents only'
                      : role === 'Department Head'
                      ? 'Full departmental knowledge + member permissions'
                      : 'Unrestricted organizational knowledge access'}
                  </span>
                </div>
                {userRole === role && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
              </div>
            ))}
          </div>
        </div>

        {/* AI & Vector Indexing Configuration */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800/40">
            <Database className="w-4 h-4 text-blue-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              pgvector & Embedding Parameters
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Embedding Model
              </label>
              <select
                value={embeddingModel}
                onChange={(e) => setEmbeddingModel(e.target.value)}
                className={`w-full py-2 px-3 rounded-xl border focus:outline-none ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option>text-embedding-004 (Gemini - 1536 dim)</option>
                <option>text-embedding-3-small (OpenAI - 1536 dim)</option>
                <option>bge-large-en-v1.5 (Local HuggingFace - 1024 dim)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Vector Similarity Threshold (Cosine)
              </label>
              <input
                type="text"
                value={similarityThreshold}
                onChange={(e) => setSimilarityThreshold(e.target.value)}
                className={`w-full py-2 px-3 rounded-xl border focus:outline-none ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Chunk Size (tokens)
                </label>
                <input
                  type="text"
                  value={chunkSize}
                  onChange={(e) => setChunkSize(e.target.value)}
                  className={`w-full py-2 px-3 rounded-xl border focus:outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Chunk Overlap (tokens)
                </label>
                <input
                  type="text"
                  value={chunkOverlap}
                  onChange={(e) => setChunkOverlap(e.target.value)}
                  className={`w-full py-2 px-3 rounded-xl border focus:outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <button
              onClick={() => alert('Vector indexing configuration updated.')}
              className="w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
