"use server";

import { redirect } from "next/navigation";

/**
 * Placeholder server action for future SaaS Builder features.
 * Replace this with real validation, writes, and side effects when needed.
 */
export async function placeholderFeatureAction() {
  // Keep the action wired for now so this route is ready for incremental feature work.
  redirect("/dashboard/feature?status=ready");
}
