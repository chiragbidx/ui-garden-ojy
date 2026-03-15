"use client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ContractRow = {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
};

export function ContractsTable() {
  const [data, setData] = useState<ContractRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/contracts")
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Failed to load contracts")
      )
      .then((json) => setData(json))
      .catch((err) => setError(typeof err === "string" ? err : "Failed to fetch contracts"));
  }, []);

  if (error) {
    return <div className="py-12 text-center text-destructive">{error}</div>;
  }

  if (!data) {
    return <div className="py-12 text-center text-muted-foreground">Loading…</div>;
  }

  if (data.length === 0) {
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
          {data.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <Link href={`/dashboard/contracts/${c.id}`} className="font-semibold hover:underline">
                  {c.title}
                </Link>
              </TableCell>
              <TableCell>
                <span className="inline-block px-2 py-1 rounded bg-muted">{c.status.replace(/^\w/, (t) => t.toUpperCase())}</span>
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