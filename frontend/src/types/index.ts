export type DocumentType = 'PDF' | 'DOCX' | 'XLSX' | 'PPTX' | 'URL' | 'TXT';
export type DocumentStatus = 'Healthy' | 'Needs Review' | 'Outdated' | 'Processing';
export type UserRole = 'Super Admin' | 'Company Admin' | 'Department Head' | 'Employee' | 'Guest';

export interface DocumentChunk {
  chunk_id: string;
  document_id: string;
  document_title: string;
  page_number: number;
  section_heading: string;
  content: string;
  department: string;
  confidentiality: 'Public' | 'Internal' | 'Restricted' | 'Confidential';
}

export interface DocumentItem {
  id: string;
  name: string;
  type: DocumentType;
  source: string;
  department: string;
  size_mb: number;
  views: number;
  ai_usage: number;
  last_updated: string;
  author: string;
  status: DocumentStatus;
  version: string;
  confidentiality: 'Public' | 'Internal' | 'Restricted' | 'Confidential';
  chunks?: DocumentChunk[];
}

export interface Citation {
  id: number;
  document_id: string;
  document_name: string;
  source_name: string;
  page_number: number;
  section_heading: string;
  quote: string;
  confidence: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  confidence?: number;
  responseTime?: number;
  sourcesCount?: number;
  citations?: Citation[];
  keyPoints?: string[];
  relatedPolicies?: string[];
  followUpQuestions?: string[];
  feedback?: 'like' | 'dislike' | null;
}

export interface SearchResult {
  id: string;
  title: string;
  type: DocumentType;
  source: string;
  department: string;
  last_updated: string;
  author: string;
  excerpt: string;
  score: number;
}

export interface MeetingItem {
  id: string;
  title: string;
  date: string;
  participants: string[];
  project: string;
  summary: string;
  key_decisions: string[];
  action_items: {
    task: string;
    assignee: string;
    deadline: string;
    status: string;
  }[];
}

export interface KnowledgeGap {
  id: string;
  topic: string;
  frequency: number;
  department: string;
  status: string;
  sample_query: string;
  recommended_action: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  department: string;
  ip: string;
  status: string;
}

export interface AIAgent {
  id: string;
  name: string;
  department: string;
  description: string;
  tools: string[];
  status: string;
}
