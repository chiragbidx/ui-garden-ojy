"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Used for initial contract fetching (SSR+hydration)
async function fetchContract(id: string) {
  const res = await fetch(`/api/contracts/${id}`);
  if (!res.ok) throw new Error("Could not load contract");
  return res.json();
}

const schema = z.object({
  title: z.string().min(5, "Title too short"),
  content: z.string().min(30, "Contract body too short"),
});

export function EditContractForm({ id }: { id: string }) {
  const router = useRouter();
  const [initialData, setInitialData] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContract(id)
      .then((data) => setInitialData({ title: data.title, content: data.content }))
      .catch(() => toast.error("Could not load contract"));
  }, [id]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialData || { title: "", content: "" },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData]); // Once we have contract, update form values

  async function handleSubmit(values: z.infer<typeof schema>) {
    setLoading(true);
    // Call server action via API (route) for edit
    const response = await fetch(`/api/contracts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      toast.success("Contract updated");
      router.push(`/dashboard/contracts/${id}`);
    } else {
      const { error } = await response.json();
      toast.error(error?.content?.[0] || "Could not update contract");
    }
    setLoading(false);
  }

  if (!initialData) {
    return <div className="py-8 text-center text-muted-foreground">Loading…</div>;
  }

  return (
    <Form {...form}>
      <form className="space-y-6 max-w-lg" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contract Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter contract title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contract Content</FormLabel>
              <FormControl>
                <Textarea {...field} rows={18} placeholder="Paste or edit contract here" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" disabled={loading} onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}