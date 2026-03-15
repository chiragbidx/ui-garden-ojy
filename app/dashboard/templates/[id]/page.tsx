import { Suspense } from "react";
import { getTemplateDetail } from "./actions";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function TemplateDetailPage({ params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const _params = "then" in params && typeof params.then === "function" ? await params : params;
  const id = _params.id;

  return (
    <Suspense fallback={<div className="py-8 text-center">Loading template…</div>}>
      <TemplateDetail id={id} />
    </Suspense>
  );
}

async function TemplateDetail({ id }: { id: string }) {
  const tpl = await getTemplateDetail(id);
  if (!tpl) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-2xl font-semibold">{tpl.name}</h1>
      </div>
      <div className="mb-6 prose max-w-none bg-card p-6 rounded-lg border shadow">
        <p className="font-semibold text-muted-foreground mb-2">{tpl.description}</p>
        <pre className="whitespace-pre-line">{tpl.content}</pre>
      </div>
      <div className="flex gap-2">
        <Button asChild>
          <Link href={`/dashboard/templates/${id}/edit`}>Edit</Link>
        </Button>
      </div>
    </div>
  );
}