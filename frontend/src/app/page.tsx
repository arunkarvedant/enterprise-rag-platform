"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import UnifiedHubView from "@/components/UnifiedHubView";
import KnowledgeBaseView from "@/components/KnowledgeBaseView";
import AskAiView from "@/components/AskAiView";
import AnalyticsView from "@/components/AnalyticsView";
import HybridSearchView from "@/components/HybridSearchView";
import AgentsView from "@/components/AgentsView";
import MeetingIntelView from "@/components/MeetingIntelView";
import WorkflowsView from "@/components/WorkflowsView";
import AuditLogsView from "@/components/AuditLogsView";
import SettingsView from "@/components/SettingsView";
import AddDocumentModal from "@/components/AddDocumentModal";
import DocumentPreviewDrawer from "@/components/DocumentPreviewDrawer";
import { KnowledgeCommandMenu } from "@/components/ui/cubby-ui";
import { INITIAL_DOCUMENTS_FALLBACK } from "@/lib/api";
import { DocumentItem, Citation, UserRole } from "@/types";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<string>("unified-hub");
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS_FALLBACK);
  const [userRole, setUserRole] = useState<UserRole>("Company Admin");
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isAddDocOpen, setIsAddDocOpen] = useState<boolean>(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState<boolean>(false);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<DocumentItem | null>(null);
  const [selectedCitationForPreview, setSelectedCitationForPreview] = useState<Citation | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>("");

  // Synchronize html class with dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Handlers
  const handleSelectDocument = (doc: DocumentItem) => {
    setSelectedCitationForPreview(null);
    setSelectedDocForPreview(doc);
  };

  const handleSelectCitation = (citation: Citation) => {
    setSelectedDocForPreview(null);
    setSelectedCitationForPreview(citation);
  };

  const handleAddDocument = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setIsAddDocOpen(false);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleCloseDrawer = () => {
    setSelectedDocForPreview(null);
    setSelectedCitationForPreview(null);
  };

  return (
    <div
      className={`min-h-screen flex transition-colors duration-200 ${
        isDark ? "bg-[#07090e] text-slate-100" : "bg-[#F4F7FC] text-slate-900"
      }`}
    >
      {/* ⌘K Command Palette (Cubby UI) */}
      <KnowledgeCommandMenu
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
        onNavigate={(tabId) => setCurrentTab(tabId)}
        onSelectDocument={handleSelectDocument}
        onOpenAddDoc={() => setIsAddDocOpen(true)}
        documents={documents}
        userRole={userRole}
        setUserRole={setUserRole}
        isDark={isDark}
        setIsDark={setIsDark}
      />

      {/* Main Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        setUserRole={setUserRole}
        isDark={isDark}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <Header
          onOpenAddDoc={() => setIsAddDocOpen(true)}
          onSearchFocus={() => setIsCommandMenuOpen(true)}
          searchQuery={globalSearchQuery}
          setSearchQuery={setGlobalSearchQuery}
          isDark={isDark}
          setIsDark={setIsDark}
          userRole={userRole}
        />

        {/* View Switcher Container */}
        <main className="flex-1 overflow-y-auto">
          {currentTab === "unified-hub" && (
            <UnifiedHubView
              documents={documents}
              onSelectDocument={handleSelectDocument}
              onOpenAddDoc={() => setIsAddDocOpen(true)}
              onDeleteDocument={handleDeleteDocument}
              userRole={userRole}
              isDark={isDark}
            />
          )}

          {currentTab === "ask-ai" && (
            <AskAiView
              onSelectCitation={handleSelectCitation}
              onSelectDocument={handleSelectDocument}
              allDocuments={documents}
              userRole={userRole}
              isDark={isDark}
            />
          )}

          {currentTab === "knowledge-base" && (
            <KnowledgeBaseView
              documents={documents}
              onSelectDocument={handleSelectDocument}
              onOpenAddDoc={() => setIsAddDocOpen(true)}
              onDeleteDocument={handleDeleteDocument}
              userRole={userRole}
              isDark={isDark}
            />
          )}

          {currentTab === "hybrid-search" && (
            <HybridSearchView
              onSelectDocument={handleSelectDocument}
              allDocuments={documents}
              userRole={userRole}
              isDark={isDark}
            />
          )}

          {currentTab === "analytics" && (
            <AnalyticsView userRole={userRole} isDark={isDark} />
          )}

          {currentTab === "agents" && (
            <AgentsView userRole={userRole} isDark={isDark} />
          )}

          {currentTab === "meetings" && (
            <MeetingIntelView userRole={userRole} isDark={isDark} />
          )}

          {currentTab === "workflows" && (
            <WorkflowsView userRole={userRole} isDark={isDark} />
          )}

          {currentTab === "audit-logs" && (
            <AuditLogsView userRole={userRole} isDark={isDark} />
          )}

          {currentTab === "settings" && (
            <SettingsView userRole={userRole} setUserRole={setUserRole} isDark={isDark} />
          )}
        </main>
      </div>

      {/* Add Document / Data Ingestion Modal */}
      <AddDocumentModal
        isOpen={isAddDocOpen}
        onClose={() => setIsAddDocOpen(false)}
        onAddDocument={handleAddDocument}
        isDark={isDark}
      />

      {/* Side-by-Side Context & Citation Inspector Drawer (Image 4 Docent Corp) */}
      <DocumentPreviewDrawer
        citation={selectedCitationForPreview}
        document={selectedDocForPreview}
        onClose={handleCloseDrawer}
        isDark={isDark}
      />
    </div>
  );
}
