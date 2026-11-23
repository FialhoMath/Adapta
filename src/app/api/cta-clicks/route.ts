import { NextResponse } from "next/server";
import { getTotal, registerClick } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const noStore = { "Cache-Control": "no-store" };

// GET /api/cta-clicks -> { total }
export async function GET() {
  try {
    return NextResponse.json({ total: await getTotal() }, { headers: noStore });
  } catch (err) {
    console.error("[cta-clicks][GET]", err);
    return NextResponse.json({ error: "Falha ao ler contador" }, { status: 503, headers: noStore });
  }
}

// POST /api/cta-clicks  body: { clickId: uuid } -> { total, duplicate }
export async function POST(req: Request) {
  let clickId: unknown;
  try {
    ({ clickId } = await req.json());
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400, headers: noStore });
  }
  if (typeof clickId !== "string" || !UUID_RE.test(clickId)) {
    return NextResponse.json({ error: "clickId inválido" }, { status: 400, headers: noStore });
  }

  try {
    const result = await registerClick(clickId);
    return NextResponse.json(result, { status: result.duplicate ? 200 : 201, headers: noStore });
  } catch (err) {
    console.error("[cta-clicks][POST]", err);
    return NextResponse.json({ error: "Falha ao registrar clique" }, { status: 503, headers: noStore });
  }
}
