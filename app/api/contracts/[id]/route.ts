import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { contracts, contractAuditLog, teamMembers, AUDIT_ACTION } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth/session";
import { z } from "zod";

// Helper to handle both Promise and non-Promise params
async function getParams(context: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  if ('then' in context.params && typeof context.params.then === 'function') {
    // params is a Promise
    return await context.params;
  }
  return context.params;
}

// For GET (fetch one contract, for edit hydration)
export async function GET(req: NextRequest, context: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const params = await getParams(context);
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [teamMember] = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);

  if (!teamMember) return NextResponse.json({ error: "No team" }, { status: 403 });

  const [contract] = await db
    .select({
      id: contracts.id,
      title: contracts.title,
      content: contracts.content,
    })
    .from(contracts)
    .where(eq(contracts.id, params.id))
    .where(eq(contracts.teamId, teamMember.teamId))
    .limit(1);

  if (!contract) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(contract);
}

const editSchema = z.object({
  title: z.string().min(5).max(255),
  content: z.string().min(30),
});

// PATCH (edit)
export async function PATCH(req: NextRequest, context: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const params = await getParams(context);
  const body = await req.json();
  const result = editSchema.safeParse(body);
  if (!result.success) return NextResponse.json({ error: result.error.flatten().fieldErrors }, { status: 422 });

  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: { _: ["Not authenticated"] } }, { status: 401 });
  }

  const [teamMember] = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);

  if (!teamMember) return NextResponse.json({ error: { _: ["Not a team member."] } }, { status: 403 });

  // Only allow editing if you are the contract creator or an admin
  const [contract] = await db
    .select()
    .from(contracts)
    .where(eq(contracts.id, params.id))
    .where(eq(contracts.teamId, teamMember.teamId))
    .limit(1);

  if (!contract) {
    return NextResponse.json({ error: { _: ["Contract not found"] } }, { status: 404 });
  }

  if (contract.createdBy !== session.userId /* && !isAdmin */) {
    return NextResponse.json({ error: { _: ["You are not allowed to edit this contract"] } }, { status: 403 });
  }

  await db
    .update(contracts)
    .set({
      title: result.data.title,
      content: result.data.content,
      updatedAt: new Date(),
    })
    .where(eq(contracts.id, params.id));

  await db.insert(contractAuditLog).values({
    contractId: params.id,
    userId: session.userId,
    action: AUDIT_ACTION.Edited,
    details: { title: result.data.title },
  });

  return NextResponse.json({ ok: true });
}