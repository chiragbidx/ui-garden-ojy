"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";

// Placeholder templates (should be fetched from API)
const placeholderTemplates = [
  { id: "tpl-nda", name: "NDA (Non-Disclosure Agreement)" },
  { id: "tpl-freelancer", name: "Freelancer Agreement" },
  { id: "tpl-service", name: "Service Agreement" },
];

const contractSchema = z.object({
  method: z.enum(["template", "ai"]),
  templateId: z.string().optional(),
  aiPrompt: z.string().optional(),
  title: z.string().min(5, "Title too short"),
  content: z.string().min(30, "Provide contract content"),
});

export function NewContractForm() {
  const router = useRouter();
  const [step, setStep] = useState<"choose" | "customize" | "done">("choose");
  const [draft, setDraft] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof contractSchema>>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      method: "template",
      templateId: "",
      aiPrompt: "",
      title: "",
      content: "",
    },
  });

  function handleChooseMethod(values: z.infer<typeof contractSchema>) {
    if (values.method === "template" && !values.templateId) {
      form.setError("templateId", { message: "Select a template" });
      return;
    }
    if (values.method === "ai" && (!values.aiPrompt || values.aiPrompt.length < 10)) {
      form.setError("aiPrompt", { message: "Enter a detailed prompt" });
      return;
    }
    setLoading(true);
    if (values.method === "template") {
      // For demo: insert placeholder content
      setTimeout(() => {
        setDraft({
          title: "Demo Contract Title",
          content: "This is a sample contract based on template. Edit as needed...",
        });
        setStep("customize");
        setLoading(false);
      }, 800);
    } else {
      // Call OpenAI API (TODO: replace with server action)
      fetch("/api/ai/generate-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: values.aiPrompt }),
      })
        .then((res) =>
          res.ok ? res.json() : Promise.reject("Failed to generate contract")
        )
        .then((data) => {
          setDraft({
            title: data.title || "Generated Contract",
            content: data.content || "AI generated contract content...",
          });
          setStep("customize");
        })
        .catch(() => {
          toast.error("AI generation failed");
        })
        .finally(() => setLoading(false));
    }
  }

  function handleSave(values: z.infer<typeof contractSchema>) {
    setLoading(true);
    // Save to DB (TODO: call server action)
    setTimeout(() => {
      setStep("done");
      setLoading(false);
      toast.success("Contract created");
      router.push("/dashboard/contracts");
    }, 800);
  }

  if (step === "done") {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-semibold mb-3">Contract created successfully!</p>
        <Button asChild>
          <Link href="/dashboard/contracts">Back to contracts</Link>
        </Button>
      </div>
    );
  }

  if (step === "customize" && draft) {
    return (
      <Form {...form}>
        <form
          className="space-y-6 max-w-lg"
          onSubmit={form.handleSubmit(handleSave)}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract Title</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? draft.title} placeholder="Enter contract title" />
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
                  <Textarea {...field} rows={18} value={field.value ?? draft.content} placeholder="Paste or edit contract here" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button type="button" variant="outline" disabled={loading} onClick={() => setStep("choose")}>
              Go Back
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  // initial step: choose template or AI
  return (
    <Form {...form}>
      <form
        className="space-y-8 max-w-lg"
        onSubmit={form.handleSubmit(handleChooseMethod)}
      >
        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start with</FormLabel>
              <Select
                value={field.value}
                onValueChange={(val) => form.setValue("method", val as any)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose method…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="template">Template</SelectItem>
                  <SelectItem value="ai">AI (custom prompt)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("method") === "template" ? (
          <FormField
            control={form.control}
            name="templateId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract Template</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(val) => form.setValue("templateId", val)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose template…" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {placeholderTemplates.map((tpl) => (
                      <SelectItem value={tpl.id} key={tpl.id}>
                        {tpl.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="aiPrompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Describe your contract need (AI will generate draft)</FormLabel>
                <Textarea
                  {...field}
                  placeholder="e.g. Generate a freelancer agreement for a web designer hiring a marketing agency."
                  rows={4}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={loading}>
          {loading
            ? "Loading..."
            : form.watch("method") === "ai"
            ? "Generate with AI"
            : "Use Template"}
        </Button>
      </form>
    </Form>
  );
}