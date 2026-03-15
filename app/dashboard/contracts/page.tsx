import { Suspense } from "react";
import { ContractsTable } from "./table";
import { getContractsForTeam } from "./actions";

export default async function ContractsPage() {
  // In real usage, get teamId from session/team context.
  // For MVP, assume current user is scoped.
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Contracts</h1>
      <p className="mb-6 text-muted-foreground">
        Generate, edit, sign, and export legal contracts with AI. All contracts are team-scoped and secure.
      </p>
      <Suspense fallback={<div className="py-8 text-center">Loading contracts…</div>}>
        <ContractsTable />
      </Suspense>
    </div>
  );
}