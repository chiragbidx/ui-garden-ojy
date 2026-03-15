import { Suspense } from "react";
import { NewContractForm } from "./new-form";

export default function NewContractPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Generate a New Contract</h1>
      <p className="mb-6 text-muted-foreground">
        Create a legal contract using a template or leverage AI to draft a fully custom contract. You can edit clauses, add signers, and export after saving.
      </p>
      <Suspense fallback={<div className="py-8 text-center">Loading form…</div>}>
        <NewContractForm />
      </Suspense>
    </div>
  );
}