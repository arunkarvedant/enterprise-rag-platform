'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Layers,
  Database
} from 'lucide-react';
import { UserRole } from '@/types';

interface AuditLogsViewProps {
  userRole: UserRole;
  isDark: boolean;
}

export default function AuditLogsView({ userRole, isDark }: AuditLogsViewProps) {
  const [filterAction, setFilterAction] = useState('All Actions');

  const logs = [
    {
      id: 'aud-1',
      timestamp: 'Today at 10:42 AM',
      user: 'Sarah Ahmed',
      action: 'DOCUMENT_UPDATE',
      target: 'Expense Reimbursement Policy.pdf',
      department: 'HR',
      ip: '192.168.1.45',
      status: 'Success'
    },
    {
      id: 'aud-2',
      timestamp: 'Today at 10:35 AM',
      user: 'AI Agent - HR Copilot',
      action: 'RAG_RETRIEVAL',
      target: 'Workplace & Remote Work Guidelines.pdf',
      department: 'HR',
      ip: 'Internal / Agent',
      status: 'Success'
    },
    {
      id: 'aud-3',
      timestamp: 'Today at 10:30 AM',
      user: 'System (n8n Pipeline)',
      action: 'PGVECTOR_INDEXED',
      target: 'Pricing & Discount Matrix.xlsx',
      department: 'Finance',
      ip: '10.0.4.12',
      status: 'Success'
    },
    {
      id: 'aud-4',
      timestamp: 'Today at 10:18 AM',
      user: 'Nusrat Jahan',
      action: 'DOCUMENT_PUBLISH',
      target: 'Q1 Financial Report 2026.pdf',
      department: 'Finance',
      ip: '192.168.1.88',
      status: 'Success'
    },
    {
      id: 'aud-5',
      timestamp: 'Today at 10:05 AM',
      user: 'Jahid Hasan',
      action: 'PERMISSION_GRANT',
      target: 'IT Security Best Practices.docx',
      department: 'IT',
      ip: '192.168.1.12',
      status: 'Success'
    }
  ];

  const filteredLogs = filterAction === 'All Actions'
    ? logs
    : logs.filter((l) => l.action === filterAction);

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'RAG_RETRIEVAL':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'PGVECTOR_INDEXED':
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'DOCUMENT_UPDATE':
      case 'DOCUMENT_PUBLISH':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'PERMISSION_GRANT':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Security, Compliance & Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable log of all document retrievals, permission updates, and AI agent executions (PRD Module 20).
          </p>
        </div>

        <button
          onClick={() => alert('Exporting audit trail as CSV...')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center gap-3">
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className={`text-xs py-1.5 px-3 rounded-xl border focus:outline-none ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
          }`}
        >
          <option>All Actions</option>
          <option>RAG_RETRIEVAL</option>
          <option>PGVECTOR_INDEXED</option>
          <option>DOCUMENT_UPDATE</option>
          <option>DOCUMENT_PUBLISH</option>
          <option>PERMISSION_GRANT</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className={`rounded-2xl border overflow-hidden ${
        isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className={`border-b text-[11px] font-semibold text-slate-400 ${
              isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/60'
            }`}>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">User / Principal</th>
              <th className="py-3 px-4">Event Action</th>
              <th className="py-3 px-4">Target Resource</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Client IP</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 font-mono text-[11px]">
            {filteredLogs.map((log) => (
              <tr
                key={log.id}
                className={`transition-colors ${
                  isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                }`}
              >
                <td className="py-3 px-4 text-slate-400 font-sans">{log.timestamp}</td>
                <td className="py-3 px-4 font-sans font-semibold text-blue-400">{log.user}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getActionBadge(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="py-3 px-4 font-sans font-medium text-slate-200">{log.target}</td>
                <td className="py-3 px-4 font-sans text-slate-400">{log.department}</td>
                <td className="py-3 px-4 text-slate-500">{log.ip}</td>
                <td className="py-3 px-4 text-right">
                  <span className="text-emerald-400 font-sans font-bold flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{log.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
