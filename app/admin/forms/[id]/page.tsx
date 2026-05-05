import { notFound } from "next/navigation";

import { FormBuilder } from "@/app/admin/forms/[id]/form-builder";
import { getFormById } from "@/lib/supabase";

export default async function FormBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = await getFormById(id);

  if (!form) {
    notFound();
  }

  return <FormBuilder form={form} />;
}
