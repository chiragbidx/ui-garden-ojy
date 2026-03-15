import { Suspense } from "react";
import { getContractDetail } from "./actions";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ContractDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="py-8 text-center">Loading contract…</div>}>
      <ContractDetail id={params.id} />
    </Suspense>
  );
}

async function ContractDetail({ id }: { id: string }) {
  const contract = await getContractDetail(id);
  if (!contract) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-2xl font-semibold">{contract.title}</h1>
        <span className="inline-block px-2 py-1 rounded bg-muted">{contract.status.replace(/^\w/, (t) => t.toUpperCase())}</span>
      </div>
      <div className="mb-6 prose max-w-none bg-card p-6 rounded-lg border shadow">
        <pre className="whitespace-pre-line">{contract.content}</pre>
      </div>
      <div className="flex gap-2">
        <Button asChild>
          <Link href={`/dashboard/contracts/${id}/edit`}>Edit</Link>
        </Button>
        <Button variant="outline">Sign</Button>
        <Button variant="outline">Export PDF</Button>
      </div>
    </div>
  );
}