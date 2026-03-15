"use client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type TemplateRow = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export function TemplatesTable() {
  const [data, setData] = useState<TemplateRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/templates")
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Failed to load templates")
      )
      .then((json) => setData(json))
      .catch((err) => setError(typeof err === "string" ? err : "Failed to fetch templates"));
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
        <p className="mb-3 text-lg font-medium">No templates yet</p>
        <p className="mb-4 text-muted-foreground">
          Create your first contract template for your team or use a global template.
        </p>
        <Button asChild>
          <Link href="/dashboard/templates/new">
            New Template
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
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created</TableHead>
            <TableHead aria-label="actions"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((tpl) => (
            <TableRow key={tpl.id}>
              <TableCell>
                <Link href={`/dashboard/templates/${tpl.id}`} className="font-semibold hover:underline">
                  {tpl.name}
                </Link>
              </TableCell>
              <TableCell>
                <span>{tpl.description}</span>
              </TableCell>
              <TableCell>
                {new Date(tpl.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/templates/${tpl.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}