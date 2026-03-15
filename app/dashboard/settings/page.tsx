import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { User, Mail, Lock, AlertTriangle } from "lucide-react";

import {
  updateProfileAction,
  updateEmailAction,
  updatePasswordAction,
} from "@/app/dashboard/settings/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DeleteAccountDialog } from "@/components/dashboard/delete-account-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

type SettingsPageProps = {
  searchParams?: Promise<{
    status?: string;
    message?: string;
  }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const session = await getAuthSession();
  if (!session) {
    redirect("/auth#signin");
  }

  const [user] = await db
    .select({
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!user) {
    redirect("/auth#signin");
  }

  const params = (await searchParams) ?? {};
  const status =
    params.status === "success" || params.status === "error"
      ? params.status
      : null;
  const message = typeof params.message === "string" ? params.message : null;

  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const initials =
    `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase() || "U";

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account profile, email, and security.
        </p>
      </div>

      {status && message ? (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            status === "success"
              ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
              : "border-destructive/20 bg-destructive/5 text-destructive"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div className="space-y-6">
        {/* Profile card with avatar */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="size-4 text-muted-foreground" />
              <CardTitle className="text-base">Profile</CardTitle>
            </div>
            <CardDescription>
              Update your personal details. This is how others will see you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateProfileAction} className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-16 border shadow-sm">
                  <AvatarFallback className="text-lg font-medium bg-muted">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{fullName}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    defaultValue={user.firstName}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    defaultValue={user.lastName}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Email card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground" />
              <CardTitle className="text-base">Email Address</CardTitle>
            </div>
            <CardDescription>
              Change the email address associated with your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateEmailAction} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newEmail">New email</Label>
                  <Input
                    id="newEmail"
                    name="newEmail"
                    type="email"
                    defaultValue={user.email}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailCurrentPassword">
                    Current password
                  </Label>
                  <Input
                    id="emailCurrentPassword"
                    name="currentPassword"
                    type="password"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Update email</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="size-4 text-muted-foreground" />
              <CardTitle className="text-base">Password</CardTitle>
            </div>
            <CardDescription>
              Update your password to keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={updatePasswordAction}
              className="max-w-md space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="passwordCurrentPassword">
                  Current password
                </Label>
                <Input
                  id="passwordCurrentPassword"
                  name="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="Minimum 8 characters"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat new password"
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Update password</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-destructive/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-destructive" />
              <CardTitle className="text-base text-destructive">
                Danger Zone
              </CardTitle>
            </div>
            <CardDescription>
              Permanently delete your account and all associated data. This
              action is irreversible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeleteAccountDialog />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
