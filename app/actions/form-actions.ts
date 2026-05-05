"use server";

import { revalidatePath } from "next/cache";

import { supabase } from "@/lib/supabase";
import type { FormField, FormSettings, FormStatus, Team } from "@/lib/supabase";

export interface FormPayload {
  title: string;
  description: string;
  team: Team;
  status: FormStatus;
  closingDate: string;
  coverGradient: string;
  coverImageUrl?: string;
  fields: FormField[];
  settings?: FormSettings;
}

export async function updateForm(id: string, payload: FormPayload) {
  const { error } = await supabase
    .from("forms")
    .update({
      title: payload.title,
      description: payload.description,
      team: payload.team,
      status: payload.status,
      closingDate: payload.closingDate || null,
      coverGradient: payload.coverGradient,
      coverImageUrl: payload.coverImageUrl ?? null,
      fields: payload.fields,
      settings: payload.settings ?? {},
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/forms/${id}`);
  revalidatePath(`/forms/${id}`);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createForm(payload: FormPayload & { createdBy: string }) {
  const id = `form-${Date.now()}`;

  const { error } = await supabase.from("forms").insert({
    id,
    title: payload.title,
    description: payload.description,
    team: payload.team,
    status: payload.status,
    closingDate: payload.closingDate || null,
    coverGradient: payload.coverGradient,
    coverImageUrl: payload.coverImageUrl ?? null,
    fields: payload.fields,
    settings: payload.settings ?? {},
    responseCount: 0,
    createdAt: new Date().toISOString().split("T")[0],
    createdBy: payload.createdBy,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/forms");
  revalidatePath("/admin");

  return id;
}

// Upload a banner image server-side and return the public URL
export async function uploadBannerImage(
  formId: string,
  formData: FormData,
): Promise<string> {
  const file = formData.get("file") as File;
  if (!file || file.size === 0) throw new Error("No file provided");

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${formId}/banner.${ext}`;

  const bytes = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from("form-banners")
    .upload(path, bytes, { contentType: file.type, upsert: true });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("form-banners").getPublicUrl(path);
  return data.publicUrl;
}
