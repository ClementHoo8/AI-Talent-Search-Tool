import { NextResponse } from "next/server";

type Candidate = {
  author_id: string;
  name: string;
  institutions: string[];
  count: number;
  evidence: { paper_id: string; title: string; year: number }[];
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ error: "missing q" }, { status: 400 });
  }

  const url = new URL("https://api.openalex.org/works");
  url.searchParams.set("search", q);
  url.searchParams.set("per_page", "25");

  const r = await fetch(url.toString(), {
    headers: { "User-Agent": "paper-talent-mvp (local)" },
  });

  if (!r.ok) {
    return NextResponse.json({ error: "openalex_failed" }, { status: 502 });
  }

  const data = await r.json();
  const works: any[] = data?.results ?? [];

  const map = new Map<string, Candidate>();

  for (const w of works) {
    const paper = {
      paper_id: w.id,
      title: w.title,
      year: w.publication_year,
    };

    for (const a of w.authorships ?? []) {
      const authorId = a?.author?.id;
      const name = a?.author?.display_name;
      if (!authorId || !name) continue;

      const insts = (a?.institutions ?? [])
        .map((i: any) => i.display_name)
        .filter(Boolean);

      const existing = map.get(authorId);
      if (!existing) {
        map.set(authorId, {
          author_id: authorId,
          name,
          institutions: insts,
          count: 1,
          evidence: [paper],
        });
      } else {
        existing.count += 1;
        if (existing.evidence.length < 2) existing.evidence.push(paper);
        for (const inst of insts) {
          if (inst && !existing.institutions.includes(inst)) {
            existing.institutions.push(inst);
          }
        }
      }
    }
  }

  const candidates = Array.from(map.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);

  return NextResponse.json({
    q,
    seed_paper_count: works.length,
    candidates,
  });
}   