🧠 Paper → Talent MVP

Turn research collaboration signals into recruiting intelligence.

🇺🇸 English
 | 🇨🇳 中文

🇺🇸 English Version
🚀 Overview

Paper → Talent MVP is a recruiting intelligence tool that transforms academic research collaboration into actionable hiring signals.

Instead of searching by job title or resume keywords, this tool:

Starts from a seed researcher

Filters papers by domain topic (e.g. LLM agent, diffusion, multimodal)

Extracts co-authors

Flags industry affiliations

Outputs structured candidate profiles

This enables a research-driven talent discovery workflow.

🎯 Target Users

AI infrastructure startups

Foundation model teams

Deep tech companies

Venture capital talent scouting

CTO / Founders hiring research engineers

🧩 Core Features
1️⃣ Author → Papers → Co-authors

Workflow:

Search author
    ↓
Select correct researcher
    ↓
Filter papers by topic
    ↓
Aggregate co-authors
    ↓
Generate candidate list


Each candidate includes:

Name

Co-authorship hit count

Industry flag (Google / OpenAI / ByteDance / etc.)

Institutions

Evidence papers (up to 2)

OpenAlex profile link

LinkedIn search link

GitHub search link

2️⃣ Topic Filtering

Supports multi-keyword filtering:

Examples:

llm agent

diffusion transformer

multimodal

reinforcement learning

Filtering applies to:

Title

Concepts

Abstract (if available)

3️⃣ Industry Signal Detection

Institution-based keyword detection:

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
  "tencent",
  ...
];


If matched:

Industry: Google DeepMind

🏗️ Tech Stack

Frontend:

Next.js (App Router)

React (Client Components)

Tailwind CSS

Backend:

Next.js API Routes

OpenAlex API

Data flow:

Client → API Route → OpenAlex → Aggregate → Structured Response

🛠️ Run Locally
npm install
npm run dev


Open:

http://localhost:3000

🔮 Future Directions

Research influence scoring

Industry transition probability

Graph centrality ranking

Multi-seed comparison

Export to CRM / ATS

⚖️ Disclaimer

This tool uses only public academic metadata from OpenAlex.
No scraping of private data.
No storage of personal data.

🇨🇳 中文版本
🚀 项目简介

Paper → Talent MVP 是一个基于科研合作网络的人才挖掘工具。

它不是通过“职位关键词”找人，而是通过：

1️⃣ 以某个研究者为起点
2️⃣ 按技术领域筛选论文
3️⃣ 提取共同作者
4️⃣ 标记是否在大厂/产业
5️⃣ 输出结构化候选人列表

本质是：

用科研协作信号替代简历关键词筛选。

🎯 适用场景

大模型 / AI Infra 创业公司

深科技公司

技术驱动型 VC

CTO / 创始人直招

技术猎头

🧩 核心能力
1️⃣ 作者 → 论文 → 合作者

流程：

搜索作者
   ↓
选择正确作者
   ↓
按领域过滤论文
   ↓
聚合共同作者
   ↓
生成候选人


每个候选人包含：

姓名

共同论文次数（技术关联强度）

是否在产业公司

所属机构

代表论文（最多2篇）

OpenAlex 链接

LinkedIn 跳转

GitHub 跳转

2️⃣ 领域过滤

支持多关键词过滤：

例如：

llm agent

diffusion

多模态

强化学习

匹配范围：

论文标题

概念标签

摘要（如果存在）

3️⃣ 产业信号识别

基于机构关键词判断是否在大厂：

例如：

Google

OpenAI

Microsoft

ByteDance

Alibaba

Tencent

命中后显示：

Industry: Google DeepMind

🏗️ 技术栈

前端：

Next.js

React

TailwindCSS

后端：

Next.js API Routes

OpenAlex API

🛠️ 本地运行
npm install
npm run dev


访问：

http://localhost:3000

🔮 未来方向

论文影响力加权

产业转化概率预测

作者网络图谱

多种子作者对比

ATS/CRM 接入

⚖️ 合规说明

本项目仅使用公开科研元数据。
不抓取隐私信息。
不存储个人数据。

✨ Vision

Research Graph → Talent Intelligence Engine