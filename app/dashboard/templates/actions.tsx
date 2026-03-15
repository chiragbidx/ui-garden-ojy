"use server";
import { db } from "@/lib/db/client";
import { templates, teamMembers } from "@/lib/db/schema";
import { eq, or, isNull } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth/session";

// Return templates for current user's team and global templates (teamId null)
export async function getTemplatesForTeam() {
  const session = await getAuthSession();
  if (!session) {
    return [];
  }
  // MVP: Just user first team for now
  const [teamMember] = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);

  if (!teamMember) return [];

  const teamId = teamMember.teamId;

  const items = await db
    .select({
      id: templates.id,
      name: templates.name,
      description: templates.description,
      createdAt: templates.createdAt,
    })
    .from(templates)
    .where(or(eq(templates.teamId, teamId), isNull(templates.teamId)));

  return items;
}