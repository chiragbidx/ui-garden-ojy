"use client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ContractRow = {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
};

export function ContractsTable() {
  const [data, setData] = useState<ContractRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Fetch contracts list from API
  async function fetchContracts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contracts", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load contracts");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch contracts"
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  // Fetch on mount & whenever route changes to /dashboard/contracts (after create/save)
  useEffect(() => {
    fetchContracts();
    // Listen for route change to /dashboard/contracts to refresh after create/edit
    const handle = () => {
      if (window.location.pathname === "/dashboard/contracts") fetchContracts();
    };
    window.addEventListener("popstate", handle);
    return () => window.removeEventListener("popstate", handle);
  }, []);

  if (error) {
    return (
      <div className="py-12 text-center text-destructive">
        Something went wrong: {error} <br />
        <Button variant="outline" size="sm" onClick={fetchContracts}>Retry</Button>
      </div>
    );
  }

  if (loading && !data) {
    return <div className="py-12 text-center text-muted-foreground">Loading…</div>;
  }

  if (data && data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="mb-3 text-lg font-medium">No contracts yet</p>
        <p className="mb-4 text-muted-foreground">
          Generate your first legal contract with AI — select a template or prompt to get started.
        </p>
        <Button asChild>
          <Link href="/dashboard/contracts/new">
            Generate Contract
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead aria-label="actions"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data &&
            data.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <Link href={`/dashboard/contracts/${c.id}`} className="font-semibold hover:underline">
                    {c.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded ${
                    c.status === "signed"
                      ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300"
                      : c.status === "archived"
                      ? "bg-muted/50 text-muted-foreground/70"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {c.status.replace(/^\w/, (t) => t.toUpperCase())}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(c.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/dashboard/contracts/${c.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}