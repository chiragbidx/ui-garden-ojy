import { NextRequest, NextResponse } from "next/server";
import { createContract, getContractsForTeam } from "@/app/dashboard/contracts/actions";

export async function GET(req: NextRequest) {
  const rows = await getContractsForTeam();
  return NextResponse.json(
    rows.map((row) => ({
      id: row.id,
      title: row.title,
      status: row.status,
      updatedAt: row.updatedAt,
    }))
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await createContract(body);
  if (result?.ok) {
    return NextResponse.json({ id: result.id });
  }
  return NextResponse.json({ error: result.error || { _: ["Could not create contract"] } }, { status: 422 });
}