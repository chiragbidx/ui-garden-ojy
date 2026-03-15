"use server";
import { db } from "@/lib/db/client";
import { contracts, contractAuditLog, teamMembers, AUDIT_ACTION } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth/session";
import { z } from "zod";

// Fetch contract details and verify team scoping
export async function getContractDetail(id: string) {
  const session = await getAuthSession();
  if (!session) {
    return null;
  }
  // For MVP, fetch user's team
  const [teamMember] = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);

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

// Edit contract action (for usage by future server actions if needed)
const editSchema = z.object({
  title: z.string().min(5).max(255),
  content: z.string().min(30),
});
export async function editContract(id: string, input: z.infer<typeof editSchema>) {
  const result = editSchema.safeParse(input);
  if (!result.success) return { error: result.error.flatten().fieldErrors };

  const session = await getAuthSession();
  if (!session) {
    return { error: { _: ["Not authenticated"] } };
  }

  const [teamMember] = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);

  if (!teamMember) return { error: { _: ["Not a team member."] } };

  const [contract] = await db
    .select()
    .from(contracts)
    .where(eq(contracts.id, id))
    .where(eq(contracts.teamId, teamMember.teamId))
    .limit(1);

  if (!contract) {
    return { error: { _: ["Contract not found"] } };
  }

  if (contract.createdBy !== session.userId /* && !isAdmin */) {
    return { error: { _: ["You are not allowed to edit this contract"] } };
  }

  await db
    .update(contracts)
    .set({
      title: result.data.title,
      content: result.data.content,
      updatedAt: new Date(),
    })
    .where(eq(contracts.id, id));

  await db.insert(contractAuditLog).values({
    contractId: id,
    userId: session.userId,
    action: AUDIT_ACTION.Edited,
    details: { title: result.data.title },
  });

  return { ok: true };
}