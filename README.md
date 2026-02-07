```markdown
# 🧠 Paper → Talent MVP  

## 🚀 Overview

**Paper → Talent MVP** is a recruiting intelligence tool that transforms academic collaboration networks into actionable hiring signals.

Instead of searching by job titles or resume keywords, this tool:

1. Starts from a seed researcher  
2. Filters papers by technical topic  
3. Extracts co-authors  
4. Detects industry affiliations  
5. Outputs structured candidate profiles  

It enables a **research-driven talent discovery workflow**.

---

## 🎯 Target Users

- AI infrastructure startups  
- Foundation model teams  
- Deep tech companies  
- VC talent scouting teams  
- CTO / Founders hiring research engineers  

---

## 🧩 Core Features

### 1️⃣ Author → Papers → Co-authors

Workflow:

```

Search Author
↓
Select Correct Researcher
↓
Filter Papers by Topic
↓
Aggregate Co-authors
↓
Generate Candidate List

````

Each candidate includes:

- Name  
- Co-authorship hit count  
- Industry flag (Google / OpenAI / ByteDance / etc.)  
- Institutions  
- Evidence papers (up to 2)  
- OpenAlex profile link  
- LinkedIn search link  
- GitHub search link  

---

### 2️⃣ Topic Filtering

Supports multi-keyword filtering.

Examples:

- `llm agent`
- `diffusion transformer`
- `multimodal`
- `reinforcement learning`

Filtering applies to:

- Paper title  
- Concepts  
- Abstract (if available)  

---

### 3️⃣ Industry Signal Detection

Institution keyword matching:

```ts
const COMPANY_KEYWORDS = [
  "google",
  "deepmind",
  "openai",
  "anthropic",
  "meta",
  "microsoft",
  "nvidia",
  "bytedance",
  "alibaba",
  "tencent"
];
````

If matched:

```
Industry: Google DeepMind
```

---

## 🏗️ Tech Stack

Frontend:

* Next.js (App Router)
* React (Client Components)
* Tailwind CSS

Backend:

* Next.js API Routes
* OpenAlex API

Data Flow:

```
Client → API Route → OpenAlex → Aggregate → Structured Response
```

---

## 📂 Project Structure

```
app/
 ├── page.tsx
 └── api/
      ├── author/route.ts
      ├── seed/route.ts
      └── search/route.ts
```

---

## 🛠️ Run Locally

```bash
npm install
npm run dev
```

Visit:

```
http://localhost:3000
```

---

## 🔮 Roadmap

* Weighted scoring (recency, citation influence)
* Industry transition probability modeling
* Author graph proximity analysis
* Multi-seed comparison
* Export to CRM / ATS systems

