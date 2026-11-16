'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Paperclip,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Bookmark,
  RefreshCw,
  Clock,
  Layers,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  Check,
  Send,
  SlidersHorizontal,
  Bot,
  User,
  Share2
} from 'lucide-react';
import { ChatMessage, Citation, DocumentItem, UserRole } from '@/types';
import { askQuestion } from '@/lib/api';

interface AskAiViewProps {
  onSelectCitation: (citation: Citation) => void;
  onSelectDocument: (doc: DocumentItem) => void;
  allDocuments: DocumentItem[];
  userRole: UserRole;
  isDark: boolean;
}

export default function AskAiView({
  onSelectCitation,
  onSelectDocument,
  allDocuments,
  userRole,
  isDark
}: AskAiViewProps) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deptFilter, setDeptFilter] = useState('All departments');
  const [dateFilter, setDateFilter] = useState('Last 30 days');
  const [sourceFilter, setSourceFilter] = useState('All sources');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pre-seed conversation matching Screenshot 2
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'user',
      text: 'What is our remote work policy?',
      timestamp: 'Today at 10:24 AM'
    },
    {
      id: 'msg-2',
      sender: 'ai',
      text: "Acme Corp's remote work policy is designed to support flexibility while maintaining productivity, collaboration, and alignment with our company goals [1].\n\nKey points:\n• Employees can work remotely up to 3 days per week [1].\n• Team leads should coordinate in-office days for better collaboration [2].\n• Core hours are 10:00 AM – 3:00 PM local time [1].\n• All remote work must be pre-approved by your manager [2].\n• Employees are responsible for maintaining a productive home workspace [3].",
      timestamp: 'Today at 10:24 AM',
      confidence: 92,
      responseTime: 12.4,
      sourcesCount: 7,
      citations: [
        {
          id: 1,
          document_id: 'doc-4',
          document_name: 'Workplace Guidelines.pdf',
          source_name: 'Google Drive • Updated 1 week ago',
          page_number: 4,
          section_heading: 'Section 2.1: Remote Work Schedule & Core Hours',
          quote: "Acme Corp's remote work policy is designed to support flexibility while maintaining productivity and alignment. Employees can work remotely up to 3 days per week with manager coordination. Core collaboration hours are 10:00 AM - 3:00 PM local time across all timezones.",
          confidence: 0.96
        },
        {
          id: 2,
          document_id: 'doc-8',
          document_name: 'Employee Handbook.docx',
          source_name: 'Notion • Updated 3 days ago',
          page_number: 12,
          section_heading: 'Team Coordination & Manager Sign-off',
          quote: 'Remote work must be pre-approved by your manager and is subject to role requirements. Team leads coordinate specific in-office anchor days for team ceremonies.',
          confidence: 0.93
        },
        {
          id: 3,
          document_id: 'doc-5',
          document_name: 'IT Security Best Practices.docx',
          source_name: 'Slack #company-policy • Today',
          page_number: 2,
          section_heading: 'Home Office & Remote Device Security',
          quote: 'Employees are responsible for ensuring physical privacy of work screens and adhering to full-disk encryption and VPN protocols when working outside company facilities.',
          confidence: 0.88
        }
      ],
      keyPoints: [
        'Employees can work remotely up to 3 days per week.',
        'Team leads should coordinate in-office days for better collaboration.',
        'Core hours are 10:00 AM – 3:00 PM local time.',
        'All remote work must be pre-approved by your manager.',
        'Employees are responsible for maintaining a productive home workspace.'
      ],
      relatedPolicies: [
        'IT Security Policy',
        'Employee Handbook – Work Arrangements'
      ],
      followUpQuestions: [
        'What are the in-office expectations?',
        'How do I request remote work?',
        'What equipment is provided?',
        'How is performance measured remotely?'
      ],
      feedback: null
    }
  ]);

  const handleSend = async (questionToSend?: string) => {
    const q = (questionToSend || inputText).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const resp = await askQuestion(q, deptFilter, dateFilter);
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: resp.answer,
        timestamp: 'Just now',
        confidence: resp.confidence_score,
        responseTime: resp.response_time_seconds,
        sourcesCount: resp.sources_count,
        citations: resp.citations,
        keyPoints: resp.key_points,
        relatedPolicies: resp.related_policies,
        followUpQuestions: resp.follow_up_questions,
        feedback: null
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (msgId: string, type: 'like' | 'dislike') => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, feedback: m.feedback === type ? null : type } : m
      )
    );
  };

  // Render text with clickable citation badges [1], [2] (Docent Corp style)
  const renderFormattedText = (text: string, citations?: Citation[]) => {
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((part, i) => {
      const match = part.match(/\[(\d+)\]/);
      if (match && citations) {
        const citationId = parseInt(match[1], 10);
        const citation = citations.find((c) => c.id === citationId);
        return (
          <button
            key={i}
            onClick={() => citation && onSelectCitation(citation)}
            title={citation ? `${citation.document_name} (${citation.source_name})` : 'View citation'}
            className="inline-flex items-center justify-center mx-1 px-1.5 py-0.2 rounded font-mono text-[11px] font-bold bg-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white transition-all ring-1 ring-blue-500/30 active:scale-95 cursor-pointer"
          >
            {citationId}
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const latestAiMessage = [...messages].reverse().find((m) => m.sender === 'ai');

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      {/* Ask AI Header */}
      <div>
        <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Ask AI
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Get accurate, grounded answers from your company knowledge repository.
        </p>
      </div>

      {/* Big Ask AI Input Card (Matches Image 2) */}
      <div
        className={`p-4 rounded-2xl border transition-all shadow-md ${
          isDark
            ? 'bg-[#111827] border-slate-800 focus-within:border-blue-500'
            : 'bg-white border-slate-200 focus-within:border-blue-500'
        }`}
      >
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask a question about company knowledge, policies, engineering, or contracts..."
          className={`w-full bg-transparent resize-none text-xs focus:outline-none placeholder:text-slate-500 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        />

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/40 mt-2">
          <div className="flex items-center gap-2">
            <button
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition-all ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Focus</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            <button
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition-all ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Paperclip className="w-3.5 h-3.5 text-slate-400" />
              <span>Attach</span>
            </button>
          </div>

          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputText.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 active:scale-98 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Retrieving...' : 'Ask AI'}</span>
            <kbd className="text-[10px] font-mono px-1 py-0.2 rounded bg-white/20">⌘↵</kbd>
          </button>
        </div>
      </div>

      {/* Connected Source Connection Chips (Matches Screenshot 2) */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { name: 'Slack', dot: 'bg-emerald-500' },
            { name: 'Notion', dot: 'bg-emerald-500' },
            { name: 'Google Drive', dot: 'bg-emerald-500' },
            { name: 'Wikis', dot: 'bg-emerald-500' },
            { name: 'Docs', dot: 'bg-emerald-500' }
          ].map((src) => (
            <div
              key={src.name}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-medium ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                  : 'bg-white border-slate-200 text-slate-700 shadow-sm'
              }`}
            >
              <span>{src.name}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${src.dot}`}></span>
            </div>
          ))}
        </div>

        <button className="text-[11px] text-slate-400 hover:text-blue-500 transition-colors font-medium flex items-center gap-1">
          <span>Manage sources</span>
        </button>
      </div>

      {/* Suggested Questions Chips (Matches Screenshot 2) */}
      <div>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Suggested questions
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { icon: '🏠', text: 'What is our remote work policy?' },
            { icon: '💵', text: 'How do I request budget approval?' },
            { icon: '📊', text: 'What tools do we use for analytics?' },
            { icon: '🎯', text: 'Where can I find the OKR process?' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.text)}
              className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all truncate flex items-center gap-2 ${
                isDark
                  ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-blue-500/50 hover:bg-slate-900'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/30 shadow-sm'
              }`}
            >
              <span>{item.icon}</span>
              <span className="truncate">{item.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-slate-800/40">
        <div className="flex items-center gap-2.5">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className={`py-1 px-2.5 rounded-lg border text-[11px] font-medium ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
            }`}
          >
            <option>All departments</option>
            <option>HR</option>
            <option>Finance</option>
            <option>Operations</option>
            <option>IT</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className={`py-1 px-2.5 rounded-lg border text-[11px] font-medium ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
            }`}
          >
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className={`py-1 px-2.5 rounded-lg border text-[11px] font-medium ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
            }`}
          >
            <option>All sources</option>
            <option>Google Drive</option>
            <option>Slack</option>
            <option>Notion</option>
          </select>
        </div>

        <button
          onClick={() => {
            setDeptFilter('All departments');
            setDateFilter('Last 30 days');
            setSourceFilter('All sources');
          }}
          className="text-[11px] text-slate-400 hover:text-white"
        >
          Clear filters
        </button>
      </div>

      {/* Active Conversation Layout (Matches Screenshots 2 & 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Left Column: Chat Messages & Citations (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-3">
              {msg.sender === 'user' ? (
                /* User Question Bubble */
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl rounded-tl-sm border text-xs max-w-xl ${
                      isDark
                        ? 'bg-slate-900 border-slate-800 text-white'
                        : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                    }`}
                  >
                    <p className="font-semibold text-[13px]">{msg.text}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ) : (
                /* AI Response Bubble with Confidence & Citations */
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div
                    className={`p-4 rounded-2xl rounded-tl-sm border text-xs space-y-3 flex-1 ${
                      isDark
                        ? 'bg-[#111827] border-slate-800 text-slate-200'
                        : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                    }`}
                  >
                    {/* Top status bar: Time, latency, confidence */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/40">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="font-semibold text-blue-500">AI Answer</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                        {msg.responseTime && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <Clock className="w-3 h-3" />
                              {msg.responseTime}s
                            </span>
                          </>
                        )}
                      </div>

                      {msg.confidence && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>High confidence {msg.confidence}%</span>
                        </div>
                      )}
                    </div>

                    {/* Answer Body with interactive citation badges */}
                    <div className="leading-relaxed whitespace-pre-line text-[12.5px]">
                      {renderFormattedText(msg.text, msg.citations)}
                    </div>

                    {/* Related Policies Links (Matches Screenshot 2) */}
                    {msg.relatedPolicies && msg.relatedPolicies.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/30">
                        <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Related policies
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {msg.relatedPolicies.map((pol, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                const found = allDocuments.find((d) => d.name.toLowerCase().includes(pol.toLowerCase()));
                                if (found) onSelectDocument(found);
                              }}
                              className="text-[11px] font-medium text-blue-500 hover:underline flex items-center gap-1"
                            >
                              <span>• {pol}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Bar (Copy, Good answer, Not useful, Bookmark) */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/40 text-[11px] text-slate-400">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="flex items-center gap-1 hover:text-white transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => handleFeedback(msg.id, 'like')}
                          className={`flex items-center gap-1 transition-colors ${
                            msg.feedback === 'like' ? 'text-blue-500 font-bold' : 'hover:text-white'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Good answer</span>
                        </button>

                        <button
                          onClick={() => handleFeedback(msg.id, 'dislike')}
                          className={`flex items-center gap-1 transition-colors ${
                            msg.feedback === 'dislike' ? 'text-rose-500 font-bold' : 'hover:text-white'
                          }`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          <span>Not useful</span>
                        </button>
                      </div>

                      <button className="hover:text-white transition-colors">
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Follow-up Questions Pills (Matches Screenshot 2) */}
          {latestAiMessage?.followUpQuestions && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Follow-up questions
                </span>
                <RefreshCw className="w-3 h-3 text-slate-500 cursor-pointer hover:rotate-180 transition-all" />
              </div>
              <div className="flex flex-wrap gap-2">
                {latestAiMessage.followUpQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-medium transition-all ${
                      isDark
                        ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-blue-500 hover:text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/40 shadow-sm'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Source Metrics & Source Cards (1 col, Matches Screenshot 2) */}
        <div className="space-y-4">
          {/* Top 3 Stats: Response Time, Sources Used, Confidence */}
          <div className="grid grid-cols-3 gap-2">
            <div className={`p-3 rounded-xl border text-center ${
              isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="text-sm font-bold text-blue-500">
                {latestAiMessage?.responseTime || 12.4}s
              </div>
              <span className="text-[10px] text-slate-400">Response time</span>
            </div>

            <div className={`p-3 rounded-xl border text-center ${
              isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="text-sm font-bold text-indigo-400">
                {latestAiMessage?.sourcesCount || 7}
              </div>
              <span className="text-[10px] text-slate-400">Sources used</span>
            </div>

            <div className={`p-3 rounded-xl border text-center ${
              isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="text-sm font-bold text-emerald-500">
                {latestAiMessage?.confidence || 92}%
              </div>
              <span className="text-[10px] text-slate-400">Confidence</span>
            </div>
          </div>

          {/* Sources List Box with Excerpt Snippets */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between pb-1 border-b border-slate-800/40">
              <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Sources
              </span>
              <button className="text-[11px] text-blue-500 hover:underline font-semibold">
                View all
              </button>
            </div>

            <div className="space-y-2.5">
              {(latestAiMessage?.citations || []).map((citation) => (
                <div
                  key={citation.id}
                  onClick={() => onSelectCitation(citation)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all group ${
                    isDark
                      ? 'bg-slate-900/60 border-slate-800 hover:border-blue-500/60 hover:bg-slate-900'
                      : 'bg-slate-50 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-600/20 text-blue-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {citation.id}
                    </span>
                    <div className="overflow-hidden flex-1">
                      <span className="text-xs font-bold text-blue-500 group-hover:underline block truncate">
                        {citation.document_name}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {citation.source_name}
                      </span>
                      <p className="text-[11px] text-slate-400 italic mt-1 line-clamp-2">
                        &quot;{citation.quote}&quot;
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full text-center text-[11px] font-semibold text-slate-400 hover:text-white pt-1">
              +4 more sources
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
