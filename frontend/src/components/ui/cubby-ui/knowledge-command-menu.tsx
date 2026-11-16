"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  Sparkles,
  Layers,
  Bot,
  BarChart3,
  Brain,
  Video,
  GitBranch,
  ShieldCheck,
  Settings,
  PlusCircle,
  FileText,
  UserCheck,
  Sun,
  Moon,
  ArrowRight,
} from "lucide-react";
import { Kbd } from "./kbd";
import { Badge } from "./badge";
import { DocumentItem, UserRole } from "@/types";

export interface KnowledgeCommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabId: string) => void;
  onSelectDocument: (doc: DocumentItem) => void;
  onOpenAddDoc: () => void;
  documents: DocumentItem[];
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

export function KnowledgeCommandMenu({
  isOpen,
  onClose,
  onNavigate,
  onSelectDocument,
  onOpenAddDoc,
  documents,
  userRole,
  setUserRole,
  isDark,
  setIsDark,
}: KnowledgeCommandMenuProps) {
  const [query, setQuery] = React.useState("");

  // Keyboard shortcut listener (⌘K / Ctrl+K & Escape)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredDocs = documents.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.department.toLowerCase().includes(query.toLowerCase()) ||
      d.source.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0e121a] border border-white/[0.12] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-10 text-slate-100">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08]">
          <Search className="w-4 h-4 text-blue-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search enterprise documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <Kbd size="xs">Esc</Kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Quick Actions */}
          <div className="space-y-1">
            <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Platform Modules
            </p>
            {[
              { id: "unified-hub", label: "Unified Command Hub (Flagship)", icon: Sparkles, badge: "All-in-One" },
              { id: "ask-ai", label: "AI Copilot / Internal RAG Search", icon: Bot, badge: "RAG" },
              { id: "knowledge-base", label: "Knowledge Base & Files", icon: Layers },
              { id: "hybrid-search", label: "Hybrid Semantic Search", icon: Search },
              { id: "analytics", label: "Guru Analytics & Gaps", icon: BarChart3 },
              { id: "agents", label: "AI Agents & Model Context Protocol", icon: Brain },
              { id: "meetings", label: "Meeting Intelligence", icon: Video },
              { id: "workflows", label: "Automated Workflows (n8n)", icon: GitBranch },
              { id: "audit-logs", label: "Security & Audit Trail", icon: ShieldCheck },
              { id: "settings", label: "Settings & Access Control", icon: Settings },
            ]
              .filter((m) => m.label.toLowerCase().includes(query.toLowerCase()))
              .map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => {
                      onNavigate(action.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-white/[0.06] transition-colors text-slate-300 hover:text-white group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                      <span>{action.label}</span>
                    </div>
                    {action.badge && (
                      <Badge variant="cyan" size="sm">
                        {action.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
          </div>

          {/* Quick Tools */}
          <div className="space-y-1">
            <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Quick Operations
            </p>
            <button
              onClick={() => {
                onOpenAddDoc();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-white/[0.06] transition-colors text-slate-300 hover:text-white"
            >
              <div className="flex items-center gap-2.5">
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>+ Upload New Document / Source</span>
              </div>
              <Kbd size="xs">Ctrl+U</Kbd>
            </button>
            <button
              onClick={() => {
                setIsDark(!isDark);
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-white/[0.06] transition-colors text-slate-300 hover:text-white"
            >
              <div className="flex items-center gap-2.5">
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                <span>Toggle {isDark ? "Light" : "Dark"} Mode</span>
              </div>
            </button>
          </div>

          {/* Documents Search */}
          {filteredDocs.length > 0 && (
            <div className="space-y-1">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Matching Documents ({filteredDocs.length})
              </p>
              {filteredDocs.slice(0, 5).map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    onSelectDocument(doc);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-white/[0.06] transition-colors text-slate-300 hover:text-white text-left group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    <div className="truncate">
                      <p className="truncate font-medium text-slate-200 group-hover:text-white">{doc.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {doc.department} • {doc.source} • {doc.type}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-white shrink-0 ml-2" />
                </button>
              ))}
            </div>
          )}

          {/* Persona / Role Selector */}
          <div className="space-y-1 pt-2 border-t border-white/[0.08]">
            <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              RBAC Role Simulator (Current: {userRole})
            </p>
            <div className="grid grid-cols-2 gap-1 px-1">
              {(["Company Admin", "Department Head", "Employee", "Guest"] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setUserRole(role);
                    onClose();
                  }}
                  className={cn(
                    "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors",
                    userRole === role
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                  )}
                >
                  <span>{role}</span>
                  {userRole === role && <UserCheck className="w-3.5 h-3.5 text-blue-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
