import { Suspense } from "react";
import { EditContractForm } from "./edit-form";

export default function EditContractPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Edit Contract</h1>
      <Suspense fallback={<div className="py-8 text-center">Loading form…</div>}>
        <EditContractForm id={params.id} />
      </Suspense>
    </div>
  );
}