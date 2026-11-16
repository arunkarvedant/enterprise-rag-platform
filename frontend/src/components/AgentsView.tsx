'use client';

import React, { useState } from 'react';
import {
  Brain,
  Cpu,
  Play,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  ChevronRight,
  Terminal,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { AIAgent, UserRole } from '@/types';

interface AgentsViewProps {
  userRole: UserRole;
  isDark: boolean;
}

export default function AgentsView({ userRole, isDark }: AgentsViewProps) {
  const agents: AIAgent[] = [
    {
      id: 'hr-agent',
      name: 'HR Policy Copilot',
      department: 'Human Resources',
      description: 'Answers employee policy questions, checks leave balances, and calculates travel per-diem.',
      tools: ['mcp__hr_search_docs', 'mcp__calculate_per_diem', 'mcp__get_leave_policy'],
      status: 'Active'
    },
    {
      id: 'contract-agent',
      name: 'Contract Intelligence Agent',
      department: 'Legal & Procurement',
      description: 'Extracts contractual parties, renewal terms, indemnity clauses, and identifies legal risk.',
      tools: ['mcp__parse_agreement_terms', 'mcp__extract_renewal_dates', 'mcp__audit_sla_penalties'],
      status: 'Active'
    },
    {
      id: 'project-agent',
      name: 'Project & Architecture Agent',
      department: 'Engineering',
      description: 'Retrieves architecture decision records (ADRs), sprint deliverables, and GitHub technical docs.',
      tools: ['mcp__search_code_repos', 'mcp__query_jira_epics', 'mcp__fetch_adr_index'],
      status: 'Active'
    },
    {
      id: 'compliance-agent',
      name: 'Compliance & Security Agent',
      department: 'InfoSec & Compliance',
      description: 'Cross-references internal documents against ISO 27001, SOC2, and GDPR controls.',
      tools: ['mcp__audit_policy_freshness', 'mcp__scan_pii_exposure', 'mcp__verify_mfa_rules'],
      status: 'Active'
    }
  ];

  const [selectedAgent, setSelectedAgent] = useState<AIAgent>(agents[0]);
  const [promptText, setPromptText] = useState('Audit our travel policy and tell me if receipts are mandatory for a $35 dinner in Berlin.');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLog, setExecutionLog] = useState<any | null>(null);

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setIsExecuting(true);
    setExecutionLog(null);

    setTimeout(() => {
      setExecutionLog({
        status: 'Completed',
        execution_time: '1.84s',
        user_identity: `Arif Rahman (${userRole})`,
        mcp_tools_called: [
          {
            name: selectedAgent.tools[0],
            params: { query: 'international dinner receipt threshold Berlin', department: selectedAgent.department },
            status: 'Success (200 OK)'
          },
          {
            name: selectedAgent.tools[1] || 'mcp__calculate_per_diem',
            params: { country: 'Germany', city: 'Berlin', category: 'Dinner' },
            status: 'Success (200 OK)'
          }
        ],
        synthesis:
          'Grounded Analysis: Yes, receipts are strictly mandatory. According to Section 3 of the Expense Reimbursement Policy, any expense exceeding $25 requires an itemized receipt. In addition, Berlin falls under the international travel tier, with an allowance cap of $120/day.',
        human_approval_required: false
      });
      setIsExecuting(false);
    }, 1400);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          AI Agent Framework & MCP Integrations
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Specialized autonomous agents operating under strict user authorization via Model Context Protocol (PRD Modules 13 & 14).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Selector List (1 col) */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Approved Autonomous Agents
          </span>
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedAgent.id === agent.id
                  ? isDark
                    ? 'bg-blue-600/15 border-blue-500 text-white shadow-md'
                    : 'bg-blue-50 border-blue-400 text-blue-900 shadow-sm'
                  : isDark
                  ? 'bg-[#111827] border-slate-800 text-slate-300 hover:border-slate-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold">{agent.name}</h3>
                    <span className="text-[10px] text-slate-400">{agent.department}</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">
                  {agent.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                {agent.description}
              </p>
            </div>
          ))}
        </div>

        {/* Execution & MCP Log Terminal (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/40">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-500" />
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Execute Agent: {selectedAgent.name}
                </h2>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                MCP Protocol v1.1
              </span>
            </div>

            {/* Prompt Form */}
            <form onSubmit={handleExecute} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Task Brief & Prompt
                </label>
                <textarea
                  rows={3}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Enter specific enterprise instructions for this agent..."
                  className={`w-full py-2 px-3 text-xs rounded-xl border focus:outline-none resize-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Tools Available */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Authorized MCP Tools Registered:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAgent.tools.map((tool, i) => (
                    <span
                      key={i}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isDark ? 'bg-slate-900 border-slate-800 text-blue-400' : 'bg-slate-100 border-slate-200 text-blue-700'
                      }`}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isExecuting || !promptText.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 active:scale-98 transition-all disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isExecuting ? 'Calling MCP Tools...' : 'Execute Agent Task'}</span>
              </button>
            </form>
          </div>

          {/* MCP Execution Telemetry Log */}
          {executionLog && (
            <div
              className={`p-5 rounded-2xl border space-y-4 font-mono text-xs ${
                isDark ? 'bg-[#0b0e17] border-slate-800 text-slate-300' : 'bg-slate-900 border-slate-800 text-slate-100 shadow-xl'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>MCP Execution Pipeline Telemetry</span>
                </div>
                <span>Latency: {executionLog.execution_time}</span>
              </div>

              {/* Tools Invoked */}
              <div className="space-y-2">
                <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">
                  Tool Invocation Chain
                </span>
                {executionLog.mcp_tools_called.map((tool: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 space-y-1">
                    <div className="flex items-center justify-between text-blue-400 font-bold">
                      <span>&gt; {tool.name}</span>
                      <span className="text-emerald-400 text-[10px]">{tool.status}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Params: {JSON.stringify(tool.params)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Synthesis Output */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] text-emerald-400 uppercase font-bold tracking-wider block mb-1">
                  Final Grounded Result
                </span>
                <p className="font-sans text-xs leading-relaxed text-slate-200">
                  {executionLog.synthesis}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
