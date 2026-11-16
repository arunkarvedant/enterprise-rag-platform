'use client';

import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  Shield
} from 'lucide-react';
import { DocumentItem } from '@/types';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDocument: (doc: DocumentItem) => void;
  isDark: boolean;
}

export default function AddDocumentModal({
  isOpen,
  onClose,
  onAddDocument,
  isDark
}: AddDocumentModalProps) {
  const [fileName, setFileName] = useState('');
  const [department, setDepartment] = useState('HR');
  const [confidentiality, setConfidentiality] = useState<'Public' | 'Internal' | 'Restricted'>('Internal');
  const [fileType, setFileType] = useState<'PDF' | 'DOCX' | 'XLSX' | 'PPTX' | 'TXT'>('PDF');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    setIsProcessing(true);
    setProgress(15);

    // Simulate RAG text extraction, chunking, and embedding indexing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 250);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);

      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        name: fileName.includes('.') ? fileName : `${fileName}.${fileType.toLowerCase()}`,
        type: fileType,
        source: `${department} Team`,
        department: department,
        size_mb: 2.8,
        views: 1,
        ai_usage: 0,
        last_updated: 'Just now',
        author: 'Arif Rahman',
        status: 'Healthy',
        version: 'v1.0',
        confidentiality: confidentiality,
        chunks: [
          {
            chunk_id: `chunk-${Date.now()}-1`,
            document_id: `doc-${Date.now()}`,
            document_title: fileName,
            page_number: 1,
            section_heading: 'General Overview',
            content: `Indexed knowledge content from ${fileName}. Processed and vectorized via pgvector.`,
            department: department,
            confidentiality: confidentiality
          }
        ]
      };

      onAddDocument(newDoc);
      setIsProcessing(false);
      setProgress(0);
      setFileName('');
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in select-none">
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDark
            ? 'bg-[#111827] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-500 flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Add Document to Knowledge Hub</h2>
              <p className="text-[11px] text-slate-400">
                Automated OCR, text chunking & pgvector embedding pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Drag & Drop Simulation Zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              isDark
                ? 'border-slate-700 hover:border-blue-500 bg-slate-900/40'
                : 'border-slate-300 hover:border-blue-500 bg-slate-50'
            }`}
          >
            <UploadCloud className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-xs font-semibold">
              Drop enterprise document here or click to browse
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Supports PDF, DOCX, XLSX, PPTX, TXT, CSV, scanned OCR
            </p>
          </div>

          {/* Document Name */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-400">
              Document Title
            </label>
            <input
              type="text"
              required
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g. Employee Wellness Program 2026.pdf"
              className={`w-full py-2 px-3 text-xs rounded-xl border focus:outline-none focus:border-blue-500 transition-all ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          {/* Department & Format Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-400">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={`w-full py-2 px-3 text-xs rounded-xl border focus:outline-none ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="HR">HR</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
                <option value="IT">IT</option>
                <option value="Legal">Legal</option>
                <option value="Engineering">Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-400">
                File Format
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as any)}
                className={`w-full py-2 px-3 text-xs rounded-xl border focus:outline-none ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
                <option value="XLSX">XLSX</option>
                <option value="PPTX">PPTX</option>
                <option value="TXT">TXT</option>
              </select>
            </div>
          </div>

          {/* Confidentiality Level */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-400">
              Confidentiality / RBAC Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Public', 'Internal', 'Restricted'] as const).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setConfidentiality(lvl)}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    confidentiality === lvl
                      ? 'bg-blue-600 text-white border-blue-600'
                      : isDark
                      ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* RAG Pipeline Specs Callout */}
          <div className={`p-2.5 rounded-xl border text-[11px] flex items-center justify-between ${
            isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
              <span>Embedding Engine: Gemini / text-embedding-004</span>
            </div>
            <span className="font-mono text-emerald-500 font-semibold">1536-dim</span>
          </div>

          {/* Progress bar when indexing */}
          {isProcessing && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-semibold text-blue-500">
                <span>Vectorizing & Chunks Extraction...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-700/40 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-1.5 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className={`px-4 py-2 text-xs font-medium rounded-xl border transition-all ${
                isDark
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                  : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing || !fileName.trim()}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
            >
              {isProcessing ? 'Processing...' : 'Upload & Index'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
