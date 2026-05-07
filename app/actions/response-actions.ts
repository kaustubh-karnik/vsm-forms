"use server";

import { revalidatePath } from "next/cache";

import { supabaseAdmin } from "@/lib/supabase-server";
import type { FormResponse } from "@/lib/supabase";

function extractStorageLocation(url: string) {
  try {
    const parsed = new URL(url);
    const marker = "/storage/v1/object/public/";
    const index = parsed.pathname.indexOf(marker);
    if (index === -1) return null;

    const remainder = parsed.pathname.slice(index + marker.length);
    const [bucket, ...pathParts] = remainder.split("/");
    if (!bucket || pathParts.length === 0) return null;

    return {
      bucket: decodeURIComponent(bucket),
      path: decodeURIComponent(pathParts.join("/")),
    };
  } catch {
    return null;
  }
}

function collectStoragePaths(responses: FormResponse[]) {
  const pathsByBucket = new Map<string, Set<string>>();

  const addPath = (value: string) => {
    const location = extractStorageLocation(value);
    if (!location) return;

    if (!pathsByBucket.has(location.bucket)) {
      pathsByBucket.set(location.bucket, new Set());
    }
    pathsByBucket.get(location.bucket)!.add(location.path);
  };

  responses.forEach((response) => {
    Object.values(response.data).forEach((value) => {
      if (typeof value === "string") {
        addPath(value);
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((entry) => {
          if (typeof entry === "string") {
            addPath(entry);
          }
        });
      }
    });
  });

  return pathsByBucket;
}

async function removeStoredFiles(responses: FormResponse[]) {
  const pathsByBucket = collectStoragePaths(responses);

  for (const [bucket, paths] of pathsByBucket.entries()) {
    if (paths.size === 0) continue;
    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove(Array.from(paths));

    if (error) throw new Error(error.message);
  }
}

export async function deleteResponses(formId: string, responseIds: string[]) {
  if (responseIds.length === 0) return;

  const { data: responses, error: fetchError } = await supabaseAdmin
    .from("responses")
    .select("id, formId, submittedAt, data")
    .in("id", responseIds);

  if (fetchError) throw new Error(fetchError.message);

  await removeStoredFiles(responses || []);

  const { error } = await supabaseAdmin
    .from("responses")
    .delete()
    .in("id", responseIds);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/forms/${formId}/responses`);
  revalidatePath(`/admin/forms/${formId}`);
  revalidatePath("/admin");
}

export async function deleteAllResponses(formId: string) {
  const { data: responses, error: fetchError } = await supabaseAdmin
    .from("responses")
    .select("id, formId, submittedAt, data")
    .eq("formId", formId);

  if (fetchError) throw new Error(fetchError.message);

  await removeStoredFiles(responses || []);

  const { error } = await supabaseAdmin
    .from("responses")
    .delete()
    .eq("formId", formId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/forms/${formId}/responses`);
  revalidatePath(`/admin/forms/${formId}`);
  revalidatePath("/admin");
}
