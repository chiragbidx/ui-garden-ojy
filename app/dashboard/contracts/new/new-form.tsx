"use client";
import { useEffect, useState } from "react";
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
  const [draft, setDraft] = useState<{ title: string; content: string; templateId?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Use react-hook-form for state *without* default content/title for "choose" step
  const form = useForm<z.infer<typeof contractSchema>>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      method: "template",
      templateId: "",
      aiPrompt: "",
      title: "",
      content: "",
    },
    mode: "onChange",
  });

  // Ensure that "Generate with AI" click triggers correct form values and handler.
  // This function now *forces* method:ai, and syncs the used prompt ('aiPrompt') field.
  async function handleFormSubmit(values: z.infer<typeof contractSchema>) {
    setAiError(null);
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
      setTimeout(() => {
        setDraft({
          title: "Demo Contract Title",
          content: "This is a sample contract based on template. Edit as needed...",
          templateId: values.templateId,
        });
        setStep("customize");
        setLoading(false);
      }, 800);
    } else {
      try {
        // Defensive: ensure we pick the latest value (needed if the form does not update fast enough)
        const prompt =
          form.getValues("aiPrompt") || values.aiPrompt || "";
        const res = await fetch("/api/ai/generate-contract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        if (!res.ok) {
          let msg = "AI generation failed";
          try {
            const errorJson = await res.json();
            msg = errorJson.error || msg;
          } catch {}
          setAiError(msg);
          toast.error(msg);
        } else {
          const data = await res.json();
          setDraft({
            title: data.title || "Generated Contract",
            content: data.content || "AI generated contract content...",
          });
          setStep("customize");
        }
      } catch (err) {
        setAiError("Could not reach AI service.");
        toast.error("Could not reach AI service.");
      }
      setLoading(false);
    }
  }

  async function handleSave(values: z.infer<typeof contractSchema>) {
    setLoading(true);
    const response = await fetch("/api/contracts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: values.title,
        content: values.content,
        templateId: draft?.templateId,
      }),
    });
    if (response.ok) {
      setStep("done");
      setLoading(false);
      toast.success("Contract created");
      router.push("/dashboard/contracts");
    } else {
      const { error } = await response.json();
      toast.error(error?.title?.[0] || error?.content?.[0] || "Could not create contract");
      setLoading(false);
    }
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

  // The "choose" step - two separate buttons with explicit event binding for AI and Template
  return (
    <Form {...form}>
      <form
        className="space-y-8 max-w-lg"
        onSubmit={form.handleSubmit(handleFormSubmit)}
      >
        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start with</FormLabel>
              <Select
                value={field.value}
                onValueChange={(val) => {
                  form.setValue("method", val as any);
                  setAiError(null);
                }}
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

        {aiError && (
          <div className="p-3 rounded-md border border-destructive/20 bg-destructive/10 text-destructive mt-2 text-sm">
            {aiError}
          </div>
        )}

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
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="e.g. Generate a freelancer agreement for a web designer hiring a marketing agency."
                  rows={4}
                  disabled={loading}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* For extra clarity, split "Use Template" and "Generate with AI" buttons */}
        {form.watch("method") === "ai" ? (
          <Button
            type="submit"
            disabled={loading}
            onClick={() => {
              form.setValue("method", "ai");
            }}
          >
            {loading ? "Loading..." : "Generate with AI"}
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={loading}
            onClick={() => {
              form.setValue("method", "template");
            }}
          >
            {loading ? "Loading..." : "Use Template"}
          </Button>
        )}
      </form>
    </Form>
  );
}