'use client';

import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Layers,
  Search,
  GitBranch,
  Brain,
  Video,
  BarChart3,
  ShieldCheck,
  Settings,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Database,
  Users
} from 'lucide-react';
import { UserRole } from '@/types';
import { Badge, Avatar } from '@/components/ui/cubby-ui';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isDark: boolean;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  isDark
}: SidebarProps) {
  const navItems = [
    { id: 'unified-hub', label: 'Unified Command Hub', icon: Sparkles, badge: 'All-in-One' },
    { id: 'ask-ai', label: 'AI Copilot / Chat', icon: Bot, badge: 'RAG' },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: Layers },
    { id: 'hybrid-search', label: 'Hybrid Search', icon: Search },
    { id: 'analytics', label: 'Guru Analytics & Gaps', icon: BarChart3 },
    { id: 'agents', label: 'AI Agents & MCP', icon: Brain },
    { id: 'meetings', label: 'Meeting Intel', icon: Video },
    { id: 'workflows', label: 'Workflows (n8n)', icon: GitBranch },
    { id: 'audit-logs', label: 'Audit & Security', icon: ShieldCheck },
    { id: 'settings', label: 'Settings & RBAC', icon: Settings },
  ];

  return (
    <aside
      className={`w-64 flex-shrink-0 flex flex-col justify-between border-r transition-colors duration-200 select-none ${
        isDark
          ? 'bg-[#0B0F19] border-slate-800 text-slate-300'
          : 'bg-white border-slate-200 text-slate-700'
      }`}
    >
      {/* Top Branding & Workspace Selector */}
      <div>
        <div className="p-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className={`text-base font-bold tracking-tight block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                NEXORA AI
              </span>
              <span className="text-[10px] uppercase font-semibold text-blue-500 tracking-wider">
                Knowledge Hub
              </span>
            </div>
          </div>

          {/* Tenant / Company Switcher */}
          <div className={`mt-4 p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
            isDark ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-indigo-600 text-[11px] font-bold text-white flex items-center justify-center">
                AC
              </div>
              <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Acme Corp (HQ)
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? isDark
                      ? 'bg-blue-600/20 text-blue-400 font-semibold shadow-sm border border-blue-500/30'
                      : 'bg-blue-50 text-blue-600 font-semibold shadow-sm border border-blue-200/60'
                    : isDark
                    ? 'hover:bg-slate-900 hover:text-white text-slate-400'
                    : 'hover:bg-slate-100 hover:text-slate-900 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? (isDark ? 'text-blue-400' : 'text-blue-600') : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant="cyan" size="sm">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Floating AI Copilot Card & User Profile */}
      <div className="p-3 space-y-3">
        {/* Floating AI Copilot Promo Card (from Nexora UI Image 1) */}
        <div
          onClick={() => setCurrentTab('ask-ai')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
            isDark
              ? 'bg-gradient-to-br from-slate-900 to-blue-950/40 border-blue-900/40 hover:border-blue-500/50'
              : 'bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border-blue-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center">
              <Sparkles className="w-3 h-3" />
            </div>
            <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              AI Copilot
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
            Ask, analyze and retrieve grounded citations with zero hallucinations.
          </p>
          <div className="mt-2.5 flex items-center text-[11px] font-semibold text-blue-500 group-hover:text-blue-400 gap-1">
            <span>Open Copilot</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* User Profile & Role Selector */}
        <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <Avatar
              address="0xArifRahmanAdminIdentity"
              size="sm"
              status="online"
            />
            <div className="overflow-hidden">
              <span className={`text-xs font-semibold block truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Arif Rahman
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 truncate">{userRole}</span>
              </div>
            </div>
          </div>

          {/* Quick Role Toggle Dropdown */}
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            title="Switch User Role for Pre-Retrieval RBAC testing"
            className={`text-[10px] font-medium py-1 px-1.5 rounded border cursor-pointer focus:outline-none ${
              isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Company Admin">Company Admin</option>
            <option value="Department Head">Dept Head</option>
            <option value="Employee">Employee</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
