"use client";

import { useState } from "react";

type AuthorHit = {
  author_id: string;
  name: string;
  works_count: number;
  cited_by_count: number;
  last_known_institution: string | null;
};

type Candidate = {
  author_id: string;
  name: string;
  institutions: string[];
  count: number;
  evidence: { paper_id: string; title: string; year: number }[];
  industry_flag?: boolean;
  industry_org?: string | null;
  score?: number;
};

type Mode = "keyword" | "author";

export default function Page() {
  const [mode, setMode] = useState<Mode>("author");
  const [q, setQ] = useState("Shunyu Yao");

  // 新增：领域关键词
  const [topic, setTopic] = useState("llm agent");

  // author search
  const [authorHits, setAuthorHits] = useState<AuthorHit[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorHit | null>(null);

  // results
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function runKeyword() {
    setLoading(true);
    setError(null);
    setCandidates([]);
    setSelectedAuthor(null);
    try {
      const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error ?? "request_failed");
      setCandidates(data.candidates ?? []);
    } catch (e: any) {
      setError(e.message ?? "failed");
    } finally {
      setLoading(false);
    }
  }

  async function runAuthorSearch() {
    setLoading(true);
    setError(null);
    setAuthorHits([]);
    setCandidates([]);
    setSelectedAuthor(null);
    try {
      const r = await fetch(`/api/author?q=${encodeURIComponent(q)}`);
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error ?? "request_failed");
      setAuthorHits(data.authors ?? []);
    } catch (e: any) {
      setError(e.message ?? "failed");
    } finally {
      setLoading(false);
    }
  }

  async function pickAuthor(a: AuthorHit) {
    setSelectedAuthor(a);
    setLoading(true);
    setError(null);
    setCandidates([]);
    try {
      const r = await fetch(
        `/api/seed?author_id=${encodeURIComponent(a.author_id)}&topic=${encodeURIComponent(topic)}`
      );
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error ?? "request_failed");
      setCandidates(data.candidates ?? []);
    } catch (e: any) {
      setError(e.message ?? "failed");
    } finally {
      setLoading(false);
    }
  }

  function onSearch() {
    if (mode === "keyword") return runKeyword();
    return runAuthorSearch();
  }

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Paper → Talent MVP</h1>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Mode 模式</label>
          <select
            className="border rounded px-3 py-2"
            value={mode}
            onChange={(e) => {
              const m = e.target.value as Mode;
              setMode(m);
              setError(null);
              setCandidates([]);
              setAuthorHits([]);
              setSelectedAuthor(null);
              setQ(m === "keyword" ? "diffusion" : "Shunyu Yao");
            }}
          >
            <option value="keyword">Keyword → papers → authors</option>
            <option value="author">Author → papers → co-authors</option>
          </select>
        </div>

        {mode === "author" && (
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded px-3 py-2"
              placeholder="研究者姓名（如 Shunyu Yao）"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button
              className="border rounded px-4 py-2"
              onClick={onSearch}
              disabled={!q.trim() || loading}
            >
              {loading ? "Working..." : "Search 搜索"}
            </button>
          </div>
        )}

        {mode === "author" && (
          <div className="flex gap-2 items-center">
            <div className="text-sm text-gray-600 w-28">Topic 领域词</div>
            <input
              className="flex-1 border rounded px-3 py-2"
              placeholder="例如：llm agent / diffusion transformer / multimodal"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
        )}

        {mode === "keyword" && (
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded px-3 py-2"
              placeholder="技术关键词 / 论文标题"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button
              className="border rounded px-4 py-2"
              onClick={onSearch}
              disabled={!q.trim() || loading}
            >
              {loading ? "Working..." : "Search"}
            </button>
          </div>
        )}

        {mode === "author" && (
          <div className="text-sm text-gray-600">
            先搜作者 → 选择一个最匹配的作者 → 按 Topic 过滤论文 → 输出共同作者（候选人才）
          </div>
        )}
      </div>

      {error && <div className="text-red-600">Error: {error}</div>}

      {mode === "author" && authorHits.length > 0 && (
        <section className="space-y-2">
          <div className="font-medium">Select an author 选择一位作者</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {authorHits.map((a) => (
              <button
                key={a.author_id}
                onClick={() => pickAuthor(a)}
                className="text-left border rounded p-4 hover:bg-gray-50"
              >
                <div className="font-medium">{a.name}</div>
                <div className="text-sm text-gray-600">
                  {a.last_known_institution ?? "—"} · works {a.works_count} · cited{" "}
                  {a.cited_by_count}
                </div>
                <div className="text-xs text-gray-500 break-all">{a.author_id}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {selectedAuthor && (
        <div className="border rounded p-4">
          <div className="font-medium">Seed author 种子作者</div>
          <div className="text-sm text-gray-700">
            {selectedAuthor.name} · {selectedAuthor.last_known_institution ?? "—"}
          </div>
          <div className="text-sm text-gray-600">Topic: {topic || "—"}</div>
          <a
            className="text-sm underline"
            href={selectedAuthor.author_id}
            target="_blank"
            rel="noreferrer"
          >
            OpenAlex profile
          </a>
        </div>
      )}

<section className="space-y-3">
  {candidates.map((c) => (
    <div key={c.author_id} className="border rounded p-4 space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="font-medium">
            {c.name}{" "}
            <span className="text-sm text-gray-500">
              ({c.count} hits{typeof c.score === "number" ? ` · score ${c.score}` : ""})
            </span>
          </div>

          {c.industry_flag && (
            <div className="text-xs text-green-600">
              Industry: {c.industry_org}
            </div>
          )}
        </div>

        <div className="flex gap-3 text-sm">
          <a
            className="underline"
            href={c.author_id}
            target="_blank"
            rel="noreferrer"
          >
            OpenAlex
          </a>

          <a
            className="underline"
            target="_blank"
            rel="noreferrer"
            href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(
              c.name + " " + (topic || "")
            )}`}
          >
            LinkedIn
          </a>

          <a
            className="underline"
            target="_blank"
            rel="noreferrer"
            href={`https://github.com/search?q=${encodeURIComponent(c.name)}&type=users`}
          >
            GitHub
          </a>
        </div>
      </div>

      {c.institutions?.length > 0 && (
        <div className="text-sm text-gray-700">
          {c.institutions.slice(0, 3).join(" · ")}
        </div>
      )}

      <div className="text-sm">
        <div className="text-gray-500">Evidence (up to 2)</div>
        <ul className="list-disc pl-5">
          {c.evidence.map((p) => (
            <li key={p.paper_id}>
              <a
                className="underline"
                href={p.paper_id}
                target="_blank"
                rel="noreferrer"
              >
                {p.title}
              </a>{" "}
              ({p.year})
            </li>
          ))}
        </ul>
      </div>
    </div>
  ))}

  {candidates.length === 0 && !loading && !error && (
    <div className="text-sm text-gray-500">No results yet. Try searching.</div>
  )}
</section>
    </main>
  );
}
