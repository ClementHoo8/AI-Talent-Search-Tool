import { NextResponse } from "next/server";

const COMPANY_KEYWORDS = [
  "google",
  "deepmind",
  "openai",
  "anthropic",
  "meta",
  "facebook",
  "microsoft",
  "amazon",
  "apple",
  "nvidia",
  "tesla",
  "bytedance",
  "byte",
  "alibaba",
  "tencent",
  "huawei",
  "xiaomi",
  "baidu",
  "sensetime",
  "meituan",
  "jd.com",
  "kuaishou",
];

type Evidence = { paper_id: string; title: string; year: number };

type Candidate = {
  author_id: string;
  name: string;
  institutions: string[];
  count: number;
  evidence: Evidence[];
  industry_flag: boolean;
  industry_org: string | null;
  score: number;
};

function norm(s: string) {
  return (s || "").toLowerCase();
}

// 简单关键词命中：title / concepts / abstract_inverted_index(粗糙但够MVP)
function workMatchesTopic(work: any, topic: string) {
  const t = norm(topic);
  if (!t) return true;

  const title = norm(work?.title ?? "");
  const abs = norm(
    work?.abstract_inverted_index
      ? JSON.stringify(work.abstract_inverted_index)
      : ""
  );
  const concepts = norm(
    (work?.concepts ?? [])
      .map((c: any) => c?.display_name)
      .filter(Boolean)
      .join(" ")
  );

  const tokens = t.split(/\s+/).filter(Boolean);
  const hay = `${title} ${concepts} ${abs}`;

  // 任意 token 命中即可（更宽松、适合MVP）
  return tokens.some((kw) => hay.includes(kw));
}

function detectIndustryOrg(insts: string[]) {
  const lowerInst = insts.join(" ").toLowerCase();
  let industryOrg: string | null = null;

  for (const kw of COMPANY_KEYWORDS) {
    if (lowerInst.includes(kw)) {
      industryOrg =
        insts.find((i) => i.toLowerCase().includes(kw)) ?? null;
      break;
    }
  }
  return industryOrg;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const author_id = searchParams.get("author_id")?.trim();
  const topic = searchParams.get("topic")?.trim() ?? "";

  if (!author_id) {
    return NextResponse.json({ error: "missing author_id" }, { status: 400 });
  }

  // 1) 拉该作者的论文
  const url = new URL("https://api.openalex.org/works");
  url.searchParams.set("filter", `author.id:${author_id}`);
  url.searchParams.set("per_page", "50");

  const r = await fetch(url.toString(), {
    headers: { "User-Agent": "paper-talent-mvp (local)" },
  });

  if (!r.ok) {
    return NextResponse.json({ error: "openalex_failed" }, { status: 502 });
  }

  const data = await r.json();
  const worksAll: any[] = data?.results ?? [];

  // 2) 领域过滤
  const works = worksAll.filter((w) => workMatchesTopic(w, topic));

  // 3) 聚合共同作者
  const map = new Map<string, Candidate>();

  for (const w of works) {
    const paper: Evidence = {
      paper_id: w.id,
      title: w.title,
      year: w.publication_year,
    };

    for (const a of w.authorships ?? []) {
      const aid = a?.author?.id;
      const name = a?.author?.display_name;
      if (!aid || !name) continue;
      if (aid === author_id) continue;

      const insts: string[] = (a?.institutions ?? [])
        .map((i: any) => i.display_name)
        .filter(Boolean);

      const industryOrg = detectIndustryOrg(insts);

      const existing = map.get(aid);

      if (!existing) {
        map.set(aid, {
          author_id: aid,
          name,
          institutions: insts,
          count: 1,
          evidence: [paper],
          industry_flag: !!industryOrg,
          industry_org: industryOrg,
          score: 0, // 下面统一算
        });
      } else {
        existing.count += 1;

        // evidence 最多保留2条
        if (existing.evidence.length < 2) existing.evidence.push(paper);

        // institutions 去重追加
        for (const inst of insts) {
          if (inst && !existing.institutions.includes(inst)) {
            existing.institutions.push(inst);
          }
        }

        // ✅ 产业标记升级：后面某次命中也要算
        if (!existing.industry_flag && industryOrg) {
          existing.industry_flag = true;
          existing.industry_org = industryOrg;
        }
        if (!existing.industry_org && industryOrg) {
          existing.industry_org = industryOrg;
        }
      }
    }
  }

  // 4) 产业信号评分 + 排序
  const currentYear = new Date().getFullYear();

  const candidates = Array.from(map.values())
    .map((c) => {
      const recentBonus = c.evidence.some(
        (e) => e.year && currentYear - e.year <= 3
      )
        ? 2
        : 0;

      const score =
        c.count * 2 + (c.industry_flag ? 5 : 0) + recentBonus;

      return { ...c, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 30);

  return NextResponse.json({
    seed_author_id: author_id,
    topic: topic || null,
    seed_paper_count_total: worksAll.length,
    seed_paper_count_after_filter: works.length,
    candidates,
  });
}
