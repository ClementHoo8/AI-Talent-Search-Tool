```markdown
# 🧠 Paper → Talent MVP  
> Turn Research Collaboration Signals into Recruiting Intelligence  
> 用科研合作网络，发现真实技术人才信号

[🇺🇸 English](#-english-version) | [🇨🇳 中文](#-中文版本)

---

# 🇺🇸 English Version

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

---

## ⚖️ Disclaimer

This project uses public academic metadata from OpenAlex.
No scraping of private data.
No storage of personal data.

---

# 🇨🇳 中文版本

## 🚀 项目简介

**Paper → Talent MVP** 是一个基于科研合作网络的人才挖掘工具。

它不依赖简历关键词，而是通过：

1️⃣ 以某个研究者为起点
2️⃣ 按技术领域过滤论文
3️⃣ 提取共同作者
4️⃣ 标记是否在产业公司
5️⃣ 输出结构化候选人

本质是：

> 用科研协作信号替代简历关键词筛选。

---

## 🎯 适用场景

* 大模型 / AI Infra 创业公司
* 深科技公司
* 技术驱动型 VC
* CTO / 创始人直招
* 技术猎头

---

## 🧩 核心能力

### 1️⃣ 作者 → 论文 → 合作者

流程：

```
搜索作者
   ↓
选择正确作者
   ↓
按领域过滤论文
   ↓
聚合共同作者
   ↓
生成候选人
```

每个候选人包含：

* 姓名
* 共同论文次数（技术关联强度）
* 是否在产业公司
* 所属机构
* 代表论文（最多2篇）
* OpenAlex 链接
* LinkedIn 跳转
* GitHub 跳转

---

### 2️⃣ 领域过滤

支持多关键词过滤，例如：

* llm agent
* diffusion
* 多模态
* 强化学习

匹配范围：

* 论文标题
* 概念标签
* 摘要（若存在）

---

### 3️⃣ 产业信号识别

基于机构关键词判断是否在大厂：

* Google
* OpenAI
* Microsoft
* ByteDance
* Alibaba
* Tencent

命中后显示：

```
Industry: Google DeepMind
```

---

## 🏗️ 技术栈

前端：

* Next.js
* React
* TailwindCSS

后端：

* Next.js API Routes
* OpenAlex API

---

## 🛠️ 本地运行

```bash
npm install
npm run dev
```

访问：

```
http://localhost:3000
```

---

## 🔮 未来方向

* 论文影响力加权模型
* 产业转化概率预测
* 作者网络图谱分析
* 多种子作者对比
* ATS / CRM 系统接入

---

## ⚖️ 合规说明

本项目仅使用公开科研元数据。
不抓取隐私信息。
不存储个人数据。

---

# ✨ Vision

**Research Graph → Talent Intelligence Engine**

用科研图谱，构建下一代技术人才发现系统。

```