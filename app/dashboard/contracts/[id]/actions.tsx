"use server";
import { db } from "@/lib/db/client";
import { contracts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth/session";

// Fetch contract details and verify team scoping
export async function getContractDetail(id: string) {
  const session = await getAuthSession();
  if (!session) {
    return null;
  }
  // For MVP, fetch user's team
  const [teamMember] = await db.query.teamMembers.findMany({
    where: eq("user_id", session.userId),
    limit: 1,
  });
  if (!teamMember) return null;
  const teamId = teamMember.teamId;

  const [contract] = await db
    .select()
    .from(contracts)
    .where(eq(contracts.id, id))
    .where(eq(contracts.teamId, teamId))
    .limit(1);

  return contract ?? null;
}