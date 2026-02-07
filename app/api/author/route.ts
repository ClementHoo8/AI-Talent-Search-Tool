import { NextResponse } from "next/server";

function uniqBy<T>(arr: T[], keyFn: (x: T) => string) {
  const m = new Map<string, T>();
  for (const x of arr) m.set(keyFn(x), x);
  return Array.from(m.values());
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ error: "missing q" }, { status: 400 });
  }

  const headers = { "User-Agent": "paper-talent-mvp (local)" };

  // ===============================
  // 1️⃣ 优先：OpenAlex Authors 搜索
  // ===============================

  const aurl = new URL("https://api.openalex.org/authors");
  aurl.searchParams.set("search", q);
  aurl.searchParams.set("per_page", "15");

  const ar = await fetch(aurl.toString(), { headers });

  if (!ar.ok) {
    return NextResponse.json({ error: "openalex_failed" }, { status: 502 });
  }

  const adata = await ar.json();
  const aresults: any[] = adata?.results ?? [];

  let authorsFromAuthors = aresults.map((a: any) => ({
    author_id: a.id,
    name: a.display_name,
    works_count: a.works_count,
    cited_by_count: a.cited_by_count,
    last_known_institution: a.last_known_institution?.display_name ?? null,
    source: "authors",
  }));

  if (authorsFromAuthors.length > 0) {

    // 🔥 排序优化（核心）
    authorsFromAuthors.sort((a, b) => {
      const citedDiff = (b.cited_by_count ?? 0) - (a.cited_by_count ?? 0);
      if (citedDiff !== 0) return citedDiff;
      return (b.works_count ?? 0) - (a.works_count ?? 0);
    });

    return NextResponse.json({
      q,
      authors: authorsFromAuthors.slice(0, 10),
    });
  }

  // ===============================
  // 2️⃣ Fallback：用 works 反查作者
  // ===============================

  const wurl = new URL("https://api.openalex.org/works");
  wurl.searchParams.set("search", q);
  wurl.searchParams.set("per_page", "10");

  const wr = await fetch(wurl.toString(), { headers });

  if (!wr.ok) {
    return NextResponse.json({ error: "openalex_failed" }, { status: 502 });
  }

  const wdata = await wr.json();
  const works: any[] = wdata?.results ?? [];

  const extracted: any[] = [];

  for (const w of works) {
    for (const au of w.authorships ?? []) {
      const id = au?.author?.id;
      const name = au?.author?.display_name;
      if (!id || !name) continue;

      const inst = (au?.institutions ?? [])[0]?.display_name ?? null;

      extracted.push({
        author_id: id,
        name,
        works_count: null,
        cited_by_count: null,
        last_known_institution: inst,
        source: "works",
      });
    }
  }

  let authors = uniqBy(extracted, (x) => x.author_id);

  return NextResponse.json({
    q,
    authors: authors.slice(0, 10),
    note: authors.length ? "fallback_from_works" : "no_results",
  });
}
