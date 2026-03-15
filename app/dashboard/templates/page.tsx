import { Suspense } from "react";
import { TemplatesTable } from "./table";
import { getTemplatesForTeam } from "./actions";

export default async function TemplatesPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Templates</h1>
      <p className="mb-6 text-muted-foreground">
        Browse contract templates or create your own. Templates can be global or private to your team.
      </p>
      <Suspense fallback={<div className="py-8 text-center">Loading templates…</div>}>
        <TemplatesTable />
      </Suspense>
    </div>
  );
}