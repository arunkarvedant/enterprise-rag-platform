import { DocumentItem, ChatMessage, Citation, MeetingItem, KnowledgeGap, AuditLog, AIAgent } from '@/types';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export const INITIAL_DOCUMENTS_FALLBACK: DocumentItem[] = [
  {
    id: 'doc-1',
    name: 'Expense Reimbursement Policy.pdf',
    type: 'PDF',
    source: 'HR Team',
    department: 'HR',
    size_mb: 2.4,
    views: 312,
    ai_usage: 312,
    last_updated: 'May 19, 2026',
    author: 'Sarah Ahmed',
    status: 'Healthy',
    version: 'v3.1',
    confidentiality: 'Internal',
    chunks: [
      {
        chunk_id: 'chunk-1-1',
        document_id: 'doc-1',
        document_title: 'Expense Reimbursement Policy.pdf',
        page_number: 3,
        section_heading: 'Section 3: Meal & Travel Per-Diem',
        content: 'Employees traveling for business are eligible for a per-diem meal allowance of $75/day for domestic travel and $120/day for international travel. Receipts are mandatory for all individual transactions exceeding $25.',
        department: 'HR',
        confidentiality: 'Internal'
      },
      {
        chunk_id: 'chunk-1-2',
        document_id: 'doc-1',
        document_title: 'Expense Reimbursement Policy.pdf',
        page_number: 5,
        section_heading: 'Section 5: Submission Timeline & Approvals',
        content: 'All reimbursement claims must be submitted via the finance portal within 30 calendar days of incurring the expense. Claims submitted after 60 days require Department Head and CFO sign-off.',
        department: 'HR',
        confidentiality: 'Internal'
      }
    ]
  },
  {
    id: 'doc-2',
    name: 'Vendor Management Guidelines.docx',
    type: 'DOCX',
    source: 'Operations',
    department: 'Operations',
    size_mb: 4.8,
    views: 245,
    ai_usage: 245,
    last_updated: 'May 18, 2026',
    author: 'Rafiq Hasan',
    status: 'Healthy',
    version: 'v2.0',
    confidentiality: 'Internal',
    chunks: [
      {
        chunk_id: 'chunk-2-1',
        document_id: 'doc-2',
        document_title: 'Vendor Management Guidelines.docx',
        page_number: 2,
        section_heading: 'Section 2: Due Diligence & SOC2',
        content: 'Any third-party vendor handling customer PII or critical infrastructure must hold valid SOC2 Type II compliance and undergo annual cybersecurity risk audits.',
        department: 'Operations',
        confidentiality: 'Internal'
      }
    ]
  },
  {
    id: 'doc-3',
    name: 'Pricing & Discount Matrix.xlsx',
    type: 'XLSX',
    source: 'Finance',
    department: 'Finance',
    size_mb: 1.2,
    views: 189,
    ai_usage: 189,
    last_updated: 'May 18, 2026',
    author: 'Nusrat Jahan',
    status: 'Needs Review',
    version: 'v4.2',
    confidentiality: 'Restricted',
    chunks: [
      {
        chunk_id: 'chunk-3-1',
        document_id: 'doc-3',
        document_title: 'Pricing & Discount Matrix.xlsx',
        page_number: 1,
        section_heading: 'Sheet 1: Enterprise Tier Discounts',
        content: 'Standard enterprise discount is capped at 15% for annual commitments under $100k ARR. Discounts above 20% require written VP of Sales approval.',
        department: 'Finance',
        confidentiality: 'Restricted'
      }
    ]
  },
  {
    id: 'doc-4',
    name: 'Onboarding Process Overview.pptx',
    type: 'PPTX',
    source: 'HR Team',
    department: 'HR',
    size_mb: 8.5,
    views: 156,
    ai_usage: 156,
    last_updated: 'May 17, 2026',
    author: 'Sarah Ahmed',
    status: 'Healthy',
    version: 'v1.4',
    confidentiality: 'Internal'
  },
  {
    id: 'doc-7',
    name: 'Industry Regulations & Compliance',
    type: 'URL',
    source: 'Legal',
    department: 'Legal',
    size_mb: 0.1,
    views: 142,
    ai_usage: 142,
    last_updated: 'May 16, 2026',
    author: 'Hasan Mahmud',
    status: 'Healthy',
    version: 'v1.2',
    confidentiality: 'Internal'
  },
  {
    id: 'doc-8',
    name: 'Employee Code of Conduct.txt',
    type: 'TXT',
    source: 'HR Team',
    department: 'HR',
    size_mb: 0.5,
    views: 98,
    ai_usage: 98,
    last_updated: 'May 15, 2026',
    author: 'Sarah Ahmed',
    status: 'Outdated',
    version: 'v1.0',
    confidentiality: 'Public'
  },
  {
    id: 'doc-6',
    name: 'Q1 Financial Report 2026.pdf',
    type: 'PDF',
    source: 'Finance',
    department: 'Finance',
    size_mb: 5.4,
    views: 87,
    ai_usage: 87,
    last_updated: 'May 14, 2026',
    author: 'Nusrat Jahan',
    status: 'Healthy',
    version: 'v1.0',
    confidentiality: 'Restricted'
  },
  {
    id: 'doc-5',
    name: 'IT Security Best Practices.docx',
    type: 'DOCX',
    source: 'IT Team',
    department: 'IT',
    size_mb: 2.1,
    views: 65,
    ai_usage: 65,
    last_updated: 'May 14, 2026',
    author: 'Jahid Hasan',
    status: 'Healthy',
    version: 'v1.8',
    confidentiality: 'Internal',
    chunks: [
      {
        chunk_id: 'chunk-5-1',
        document_id: 'doc-5',
        document_title: 'IT Security Best Practices.docx',
        page_number: 1,
        section_heading: 'Section 1.4: MFA & Device Encryption',
        content: 'Hardware security keys or FIDO2-compliant authenticator apps are mandatory for all internal accounts. Full-disk BitLocker/FileVault encryption must remain active on all corporate laptops.',
        department: 'IT',
        confidentiality: 'Internal'
      }
    ]
  }
];

export async function fetchDocuments(): Promise<DocumentItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/documents`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch {
    return INITIAL_DOCUMENTS_FALLBACK;
  }
}

export async function askQuestion(
  question: string,
  department: string = 'All',
  dateRange: string = 'Last 30 days',
  sources: string[] = []
): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/chat/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, department, date_range: dateRange, sources })
    });
    if (!res.ok) throw new Error('Ask AI failed');
    return await res.json();
  } catch {
    // Return grounded simulated response matching Screenshot 2
    return {
      question,
      answer: `Acme Corp's remote work policy is designed to support flexibility while maintaining productivity, collaboration, and alignment with our company goals [1].\n\nKey points:\n• Employees can work remotely up to 3 days per week [1].\n• Team leads should coordinate in-office days for better collaboration [2].\n• Core hours are 10:00 AM - 3:00 PM local time [1].\n• All remote work must be pre-approved by your manager [2].\n• Employees are responsible for maintaining a productive home workspace [3].`,
      confidence_score: 92,
      response_time_seconds: 12.4,
      sources_count: 7,
      citations: [
        {
          id: 1,
          document_id: 'doc-4',
          document_name: 'Workplace Guidelines.pdf',
          source_name: 'Google Drive • Updated 1 week ago',
          page_number: 4,
          section_heading: 'Section 2.1: Remote Work Schedule & Core Hours',
          quote: 'Acme Corp\'s remote work policy is designed to support flexibility while maintaining productivity and alignment. Employees can work remotely up to 3 days per week with manager coordination. Core collaboration hours are 10:00 AM - 3:00 PM local time across all timezones.',
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
      key_points: [
        'Employees can work remotely up to 3 days per week.',
        'Team leads should coordinate in-office days for better collaboration.',
        'Core hours are 10:00 AM - 3:00 PM local time.',
        'All remote work must be pre-approved by your manager.',
        'Employees are responsible for maintaining a productive home workspace.'
      ],
      related_policies: [
        'IT Security Policy',
        'Employee Handbook - Work Arrangements'
      ],
      follow_up_questions: [
        'What are the in-office expectations?',
        'How do I request remote work?',
        'What equipment is provided?',
        'How is performance measured remotely?'
      ]
    };
  }
}

export async function searchHybrid(query: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/search/hybrid?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Search failed');
    return await res.json();
  } catch {
    return {
      query,
      ai_summary: `I found several resources for '${query}'. These include documents on sales all hands, value framework services team and roadmap decks [1]. Additionally, there are Slack channels and meetings related to sales topics [2].`,
      summary_citations: ['1. FY24 Moveworks...', '2. Google Drive...'],
      total_results: 18,
      sources_distribution: {
        'All': 19,
        'Google Drive': 10,
        'Box': 5,
        'Slack': 2,
        'Google Calendar': 1,
        'Notion': 1
      },
      results: [
        {
          id: 's-1',
          title: 'FY25 Sales Deck Q4.pptx',
          type: 'PPTX',
          source: 'Box',
          department: 'Sales',
          last_updated: 'Oct 22, 2026',
          author: 'Aisha Khan',
          excerpt: 'In this document we capture the major contributors to the recurring revenue model in Q4 that we implemented with new service model. It also captures projections...',
          score: 0.98
        },
        {
          id: 's-2',
          title: 'Q4 Value Framework 2.0 - Business Value Services.pdf',
          type: 'PDF',
          source: 'Google Drive',
          department: 'Customer Success',
          last_updated: 'Oct 19, 2026',
          author: 'Carlos Rodriguez, Mei Ling',
          excerpt: 'This document focuses on operationalizing a standard approach to positioning value messaging and value models. It includes building a framework that aligns business value...',
          score: 0.94
        },
        {
          id: 's-3',
          title: 'Slack post • #q4-customer-success',
          type: 'TXT',
          source: 'Slack',
          department: 'Sales',
          last_updated: 'Oct 2, 2026',
          author: 'Mei Ling',
          excerpt: 'Hey CS team, I have found this interesting deck about Acme\'s ARR impacting business line, what\'s the best way to share it to your group for the right level of attention?',
          score: 0.89
        }
      ]
    };
  }
}

export async function fetchAnalytics(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics/overview`);
    if (!res.ok) throw new Error('Analytics failed');
    return await res.json();
  } catch {
    return {
      metrics: {
        total_documents_display: '1,248',
        total_documents_change: '+18% vs last month',
        total_size_display: '24.6 GB',
        total_size_change: '+12% vs last month',
        sources_count: 38,
        sources_change: '+15% vs last month',
        ai_usage_display: '4.2K',
        ai_usage_change: '+22% vs last month'
      },
      knowledge_health: {
        overall_score: 92,
        healthy_percent: 92,
        needs_review_percent: 6,
        outdated_percent: 2
      },
      top_accessed: [
        { id: 'doc-1', name: 'Expense Reimbursement Policy.pdf', views: 312, type: 'PDF' },
        { id: 'doc-2', name: 'Vendor Management Guidelines.docx', views: 245, type: 'DOCX' },
        { id: 'doc-3', name: 'Pricing & Discount Matrix.xlsx', views: 189, type: 'XLSX' },
        { id: 'doc-4', name: 'Onboarding Process Overview.pptx', views: 156, type: 'PPTX' },
        { id: 'doc-7', name: 'Industry Regulations & Compliance', views: 142, type: 'URL' }
      ],
      recent_activity: [
        { id: 'a-1', target: 'Vendor Management Guidelines.docx', user: 'Rafiq Hasan', timestamp: '10:42 AM', action: 'Updated' },
        { id: 'a-2', target: 'Expense Reimbursement Policy.pdf', user: 'AI Agent - Finance Agent', timestamp: '10:35 AM', action: 'Viewed' },
        { id: 'a-3', target: 'Pricing & Discount Matrix.xlsx', user: 'System (pgvector)', timestamp: '10:30 AM', action: 'Indexed successfully' },
        { id: 'a-4', target: 'Q1 Financial Report 2026.pdf', user: 'Nusrat Jahan', timestamp: '10:18 AM', action: 'Updated' },
        { id: 'a-5', target: 'IT Security Best Practices.docx', user: 'Jahid Hasan', timestamp: '10:05 AM', action: 'Added' }
      ],
      most_viewed_cards: [
        { title: 'Directory of Company Terminology', views: '1.5K', users: 163 },
        { title: 'Internal Certification Program', views: '1.2K', users: 112 },
        { title: 'Subject Matter Experts - Go to Market Team', views: '927', users: 98 },
        { title: 'Learning Roadmaps for the Product & Engineering Team', views: '746', users: 43 },
        { title: 'Manager Training - Calendar and Signup Link', views: '534', users: 37 }
      ],
      most_favorited_cards: [
        { title: 'How to request professional development budget', score: 95 },
        { title: 'Directory of Company Terminology', score: 78 },
        { title: 'Security Training Certification Process', score: 58 },
        { title: 'CS Team Skills Training', score: 42 },
        { title: 'Subject Matter Experts - Go to Market Team', score: 38 }
      ]
    };
  }
}
