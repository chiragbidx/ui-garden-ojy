import { NextRequest, NextResponse } from "next/server";
import { getTemplatesForTeam } from "@/app/dashboard/templates/actions";

export async function GET(req: NextRequest) {
  const rows = await getTemplatesForTeam();
  return NextResponse.json(
    rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.createdAt,
    }))
  );
}