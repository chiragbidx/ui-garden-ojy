import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { teamInvitations, teamMembers, teams, users } from "@/lib/db/schema";

import { acceptInvitationAction } from "./actions";

type InvitePageProps = {
  params: Promise<{ token: string }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;

  const [invitation] = await db
    .select({
      id: teamInvitations.id,
      teamId: teamInvitations.teamId,
      email: teamInvitations.email,
      role: teamInvitations.role,
      status: teamInvitations.status,
      expiresAt: teamInvitations.expiresAt,
    })
    .from(teamInvitations)
    .where(eq(teamInvitations.token, token))
    .limit(1);

  if (!invitation) {
    return (
      <CenteredCard
        title="Invalid Invitation"
        description="This invitation link is not valid."
      >
        <p className="text-sm text-muted-foreground mb-4">
          The invitation may have been revoked or the link is incorrect.
        </p>
        <Button asChild className="w-full">
          <Link href="/">Go to homepage</Link>
        </Button>
      </CenteredCard>
    );
  }

  if (invitation.status !== "pending") {
    return (
      <CenteredCard
        title="Invitation Already Used"
        description="This invitation has already been accepted or expired."
      >
        <Button asChild className="w-full">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </CenteredCard>
    );
  }

  const now = new Date();
  if (invitation.expiresAt < now) {
    await db
      .update(teamInvitations)
      .set({ status: "expired" })
      .where(eq(teamInvitations.id, invitation.id));

    return (
      <CenteredCard
        title="Invitation Expired"
        description="This invitation has expired. Please ask the team admin to send a new one."
      >
        <Button asChild className="w-full">
          <Link href="/">Go to homepage</Link>
        </Button>
      </CenteredCard>
    );
  }

  const [team] = await db
    .select({ name: teams.name })
    .from(teams)
    .where(eq(teams.id, invitation.teamId))
    .limit(1);

  const teamName = team?.name ?? "a team";

  const session = await getAuthSession();

  if (!session) {
    redirect(`/auth?redirect=${encodeURIComponent(`/invite/${token}`)}#signin`);
  }

  const [alreadyMember] = await db
    .select({ id: teamMembers.id })
    .from(teamMembers)
    .where(
      and(
        eq(teamMembers.teamId, invitation.teamId),
        eq(teamMembers.userId, session.userId)
      )
    )
    .limit(1);

  if (alreadyMember) {
    return (
      <CenteredCard
        title="Already a Member"
        description={`You are already a member of ${teamName}.`}
      >
        <Button asChild className="w-full">
          <Link href="/dashboard/team">Go to team</Link>
        </Button>
      </CenteredCard>
    );
  }

  return (
    <CenteredCard
      title="Team Invitation"
      description={`You've been invited to join ${teamName} as a ${invitation.role}.`}
    >
      <form action={acceptInvitationAction} className="space-y-4">
        <input type="hidden" name="token" value={token} />
        <p className="text-sm text-muted-foreground">
          Signed in as <strong>{session.email}</strong>
        </p>
        <Button type="submit" className="w-full">
          Accept Invitation
        </Button>
      </form>
      <Button asChild variant="outline" className="w-full mt-2">
        <Link href="/dashboard">Cancel</Link>
      </Button>
    </CenteredCard>
  );
}

function CenteredCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </main>
  );
}
