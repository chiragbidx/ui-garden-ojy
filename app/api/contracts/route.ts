import { NextRequest, NextResponse } from "next/server";
import { getContractsForTeam } from "@/app/dashboard/contracts/actions";

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