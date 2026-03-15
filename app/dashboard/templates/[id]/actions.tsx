"use server";
import { db } from "@/lib/db/client";
import { templates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth/session";

export async function getTemplateDetail(id: string) {
  const session = await getAuthSession();
  if (!session) {
    return null;
  }
  // For MVP, team-scoped OR global
  const [teamMember] = await db.query.teamMembers.findMany({
    where: eq("user_id", session.userId),
    limit: 1,
  });
  if (!teamMember) return null;

  const teamId = teamMember.teamId;

  const [tpl] = await db
    .select()
    .from(templates)
    .where(eq(templates.id, id))
    .where((tpl) => tpl.teamId === teamId || tpl.teamId == null)
    .limit(1);

  return tpl ?? null;
}