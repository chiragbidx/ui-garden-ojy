"use server";
import { db } from "@/lib/db/client";
import { contracts, contractAuditLog, teamMembers, CONTRACT_STATUS, AUDIT_ACTION } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth/session";
import { z } from "zod";

// Zod validation for contract creation
const contractCreateSchema = z.object({
  title: z.string().min(5).max(255),
  content: z.string().min(30),
  templateId: z.string().optional(),
});

export async function createContract(input: z.infer<typeof contractCreateSchema>) {
  const result = contractCreateSchema.safeParse(input);
  if (!result.success) return { error: result.error.flatten().fieldErrors };

  const session = await getAuthSession();
  if (!session) {
    return { error: { _: ["Not authenticated"] } };
  }

  // For MVP, use first team for user (multi-team support can be extended)
  const [teamMember] = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);

  if (!teamMember) return { error: { _: ["You are not part of a team."] } };
  const teamId = teamMember.teamId;

  // Create contract
  const [contract] = await db
    .insert(contracts)
    .values({
      teamId,
      createdBy: session.userId,
      title: input.title,
      content: input.content,
      templateId: input.templateId ?? undefined,
      status: CONTRACT_STATUS.Draft,
    })
    .returning();

  // Audit log
  await db.insert(contractAuditLog).values({
    contractId: contract.id,
    userId: session.userId,
    action: AUDIT_ACTION.Created,
    details: { title: contract.title },
  });

  return { ok: true, id: contract.id };
}

// Return contracts for current user's team (MVP: just user as "team-solo" if not implemented)
export async function getContractsForTeam() {
  const session = await getAuthSession();
  if (!session) {
    return [];
  }

  // For MVP, assume only one team per user; real impl would fetch teamId from context
  const [teamMember] = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);

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