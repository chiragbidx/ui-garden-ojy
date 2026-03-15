"use server";
import { db } from "@/lib/db/client";
import { templates, teamMembers } from "@/lib/db/schema";
import { eq, or, isNull } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth/session";

export async function getTemplateDetail(id: string) {
  const session = await getAuthSession();
  if (!session) {
    return null;
  }
  // For MVP, team-scoped OR global
  const [teamMember] = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);

  if (!teamMember) return null;

  const teamId = teamMember.teamId;

  const [tpl] = await db
    .select()
    .from(templates)
    .where(eq(templates.id, id))
    .where(or(eq(templates.teamId, teamId), isNull(templates.teamId)))
    .limit(1);

  return tpl ?? null;
}