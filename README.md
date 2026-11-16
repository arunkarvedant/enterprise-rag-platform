# Enterprise Knowledge Hub (EKH) 🚀

An AI-powered enterprise knowledge management platform that transforms scattered organizational documents into a centralized, intelligent, and searchable knowledge system.

Enterprise Knowledge Hub leverages Retrieval-Augmented Generation (RAG) to allow employees to interact with company knowledge through natural-language conversations and receive context-aware, source-cited answers.

### 🌐 Live Demo
https://enterprise-knowledge-hub-puce.vercel.app

---

### 🎯 Key Capabilities & Unified Interface

The platform combines 5 enterprise knowledge workflows into an integrated command hub:

1. **Nexora AI Knowledge Base & Telemetry:**
   - Real-time telemetry: Total Documents, Total Size, Connected Sources, and AI Usage metrics.
   - 3-tier Knowledge Health Gauge (Healthy, Needs Review, Outdated).
   - Document metadata catalog supporting PDF, DOCX, XLSX, PPTX, TXT, and Web URLs.

2. **Ask AI Internal Knowledge Search:**
   - Natural language enterprise question-answering with pre-retrieval RBAC protection.
   - Connected data source chips (Slack, Notion, Google Drive, Box, Wikis).
   - Grounded citations `[1]`, `[2]` with confidence scores and latency telemetry.

3. **Guru Analytics & Knowledge Gaps:**
   - Most viewed cards and most favorited knowledge progress bars.
   - Automated identification of organizational knowledge gaps (e.g. unaddressed employee queries).

4. **Docent Corp Document Context Inspector:**
   - Side-by-side split screen showing exact page numbers, section headers, and highlighted quotes from source documents.

5. **Moveworks Multi-Source Filter Drawer:**
   - Multi-source distribution breakdown and filtering across Google Drive, Box, Slack, Calendar, and Notion.

---

### 🎨 Design System

Built with **Cubby UI** (`cubby-ui.dev`):
- 8-step surface elevation model with inset specular highlights.
- OKLCH-styled tags with pulsating status indicators.
- High-density telemetry stat cards.
- Keyboard-accessible command palette (`⌘K` / `Ctrl+K`).
- Dual theme support (Dark / Light mode).

---

### 💼 Business Use Cases

- Human Resources and employee policies.
- Technical documentation and engineering knowledge.
- Finance and company compliance documents.
- Standard Operating Procedures (SOPs).
- Internal company knowledge bases.
- Employee onboarding and organizational support.

---

### 🛠️ Tech Stack

- **Frontend:** Next.js 16 (Turbopack), React 19, TypeScript, Tailwind CSS 4, Base UI, Lucide Icons, Cubby UI
- **Backend:** Python, FastAPI, Uvicorn, Pydantic, pgvector, RAG pipeline, Model Context Protocol (MCP)
- **Deployment:** Vercel (Frontend), Python ASGI (Backend)

---

### 💻 Getting Started

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
