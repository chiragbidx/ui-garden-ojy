"use server";
import { db } from "@/lib/db/client";
import { contracts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth/session";

// Return contracts for current user's team (MVP: just user as "team-solo" if not implemented)
export async function getContractsForTeam() {
  const session = await getAuthSession();
  if (!session) {
    return [];
  }

  // For MVP, assume only one team per user; real impl would fetch teamId from context
  // TODO: Support true multi-team fetch
  const [teamMember] = await db.query.teamMembers.findMany({
    where: eq("user_id", session.userId),
    limit: 1,
  });
  if (!teamMember) return [];
  const teamId = teamMember.teamId;

  const items = await db
    .select({
      id: contracts.id,
      title: contracts.title,
      status: contracts.status,
      updatedAt: contracts.updatedAt,
    })
    .from(contracts)
    .where(eq(contracts.teamId, teamId));

  return items;
}