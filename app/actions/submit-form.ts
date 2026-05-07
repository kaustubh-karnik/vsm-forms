"use server";

import { redirect } from "next/navigation";

import { submitFormResponse } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function submitForm(formId: string, formData: FormData) {
  const raw: Record<string, unknown> = {};
  const uploadBucket =
    process.env.NEXT_PUBLIC_SUPABASE_UPLOADS_BUCKET ?? "form-uploads";

  // Collect checkbox keys declared by the form
  const checkboxKeys = formData.getAll("_checkboxKeys") as string[];

  for (const [key, value] of formData.entries()) {
    const isSystemKey =
      key === "_formId" ||
      key === "_checkboxKeys" ||
      key.startsWith("$ACTION") ||
      key.startsWith("ACTION_") ||
      key.startsWith("ACTION_REF") ||
      key.startsWith("ACTION_ID") ||
      key.startsWith("$ACTION_REF") ||
      key.startsWith("$ACTION_ID");

    if (isSystemKey) continue;

    const isFileValue =
      typeof value === "object" &&
      value !== null &&
      "arrayBuffer" in value &&
      "name" in value &&
      "size" in value;

    if (isFileValue) {
      const file = value as File;
      if (file.size === 0) continue;

      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${formId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const bytes = await file.arrayBuffer();
      const { error } = await supabaseAdmin.storage
        .from(uploadBucket)
        .upload(path, bytes, { contentType: file.type, upsert: false });

      if (error) throw new Error(`File upload failed: ${error.message}`);

      const { data } = supabaseAdmin.storage
        .from(uploadBucket)
        .getPublicUrl(path);
      raw[key] = data.publicUrl;
    } else {
      raw[key] = value;
    }
  }

  // Resolve checkbox values
  for (const key of checkboxKeys) {
    if (!(key in raw)) {
      raw[key] = false;
    } else if (raw[key] === "true" || raw[key] === true) {
      raw[key] = true;
    }
  }

  await submitFormResponse(formId, raw);

  const firstName = (raw["Full Name"] as string | undefined)?.split(" ")[0] ?? "";
  redirect(`/forms/${formId}/success?name=${encodeURIComponent(firstName)}`);
}
