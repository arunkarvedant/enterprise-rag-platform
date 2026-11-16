'use client';

import React, { useState } from 'react';
import {
  GitBranch,
  Play,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Layers,
  ArrowRight,
  Zap
} from 'lucide-react';
import { UserRole } from '@/types';

interface WorkflowsViewProps {
  userRole: UserRole;
  isDark: boolean;
}

export default function WorkflowsView({ userRole, isDark }: WorkflowsViewProps) {
  const [runningWorkflowId, setRunningWorkflowId] = useState<string | null>(null);
  const [lastExecutedLog, setLastExecutedLog] = useState<string | null>(null);

  const workflows = [
    {
      id: 'wf-1',
      name: 'Smart Document Upload & Ingestion Pipeline',
      trigger: 'Webhook: POST /webhooks/v1/document-uploaded',
      status: 'Active',
      steps: [
        'Document Uploaded',
        'Malware Scan (ClamAV)',
        'Text & Table Extraction',
        'AI Auto-Classification',
        'pgvector Embedding (1536-dim)',
        'Indexed for RAG'
      ],
      lastRun: '10:30 AM Today',
      executions: '1,248 runs'
    },
    {
      id: 'wf-2',
      name: 'Policy Expiration & Freshness Watchdog',
      trigger: 'Cron: Daily at 00:00 UTC',
      status: 'Active',
      steps: [
        'Scan Expiry Dates',
        'Identify Outdated Docs',
        'Send Slack Alert to Dept Head',
        'Demote from Active RAG Retrieval'
      ],
      lastRun: 'Today at 00:00 UTC',
      executions: '365 runs'
    },
    {
      id: 'wf-3',
      name: 'Contract Intelligence & Risk Assessment',
      trigger: 'Document Tag: Category == "Contract"',
      status: 'Active',
      steps: [
        'Contract Ingestion',
        'Extract Parties & Payment Terms',
        'Scan Indemnity & Termination Clauses',
        'Generate Legal Risk Flagging',
        'Notify Legal Counsel'
      ],
      lastRun: 'Yesterday at 4:15 PM',
      executions: '84 runs'
    },
    {
      id: 'wf-4',
      name: 'Knowledge Gap Automated Detection',
      trigger: 'Event: Unanswered Queries >= 3',
      status: 'Active',
      steps: [
        'Detect Failed Vector Matches',
        'Cluster Query Embeddings',
        'Create Knowledge Gap Ticket',
        'Notify Department Lead with Sample Queries'
      ],
      lastRun: 'Today at 9:45 AM',
      executions: '42 runs'
    }
  ];

  const handleRunWorkflow = (wfId: string, name: string) => {
    setRunningWorkflowId(wfId);
    setLastExecutedLog(null);
    setTimeout(() => {
      setRunningWorkflowId(null);
      setLastExecutedLog(`n8n Workflow Execution Success: "${name}" completed with 0 errors across all nodes.`);
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Workflow Automation (n8n Engine)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automate document classification, policy expiration alerts, and knowledge gap routing (PRD Module 15).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-emerald-500">n8n Engine Connected</span>
        </div>
      </div>

      {lastExecutedLog && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{lastExecutedLog}</span>
          </div>
          <button onClick={() => setLastExecutedLog(null)} className="text-slate-400 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Workflows List */}
      <div className="space-y-4">
        {workflows.map((wf) => {
          const isRunning = runningWorkflowId === wf.id;
          return (
            <div
              key={wf.id}
              className={`p-5 rounded-2xl border space-y-4 transition-all ${
                isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {wf.name}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                      {wf.trigger}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">
                    {wf.executions} • Last run {wf.lastRun}
                  </span>
                  <button
                    onClick={() => handleRunWorkflow(wf.id, wf.name)}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                  >
                    <Play className="w-3 h-3" />
                    <span>{isRunning ? 'Running...' : 'Run Pipeline'}</span>
                  </button>
                </div>
              </div>

              {/* Workflow Visual Node Chain */}
              <div className="pt-2 border-t border-slate-800/40">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                  Pipeline Execution Nodes
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {wf.steps.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <div
                        className={`px-3 py-1 rounded-lg border text-[11px] font-medium ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-slate-200'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {step}
                      </div>
                      {idx < wf.steps.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
