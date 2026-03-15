import { placeholderFeatureAction } from "@/app/dashboard/feature/actions";

type FeaturePlaceholderPageProps = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

export default async function FeaturePlaceholderPage({
  searchParams,
}: FeaturePlaceholderPageProps) {
  const params = (await searchParams) ?? {};
  const status = typeof params.status === "string" ? params.status : null;

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Feature</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Empty scaffold route for SaaS Builder feature implementation.
        </p>
      </header>

      {/* TODO: Replace this placeholder block with actual feature UI/components. */}
      <div className="rounded-lg border border-dashed p-6">
        <p className="text-sm text-muted-foreground">
          No feature has been added to this page yet.
        </p>
      </div>

      {/* TODO: Replace this action wiring with feature-specific server actions. */}
      <form action={placeholderFeatureAction}>
        <button
          type="submit"
          className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
        >
          Trigger Placeholder Action
        </button>
      </form>

      {status ? (
        <p className="text-xs text-muted-foreground">
          Placeholder action status: <span className="font-medium">{status}</span>
        </p>
      ) : null}
    </section>
  );
}
