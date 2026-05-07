import Link from "next/link";
import { notFound } from "next/navigation";

import { Alert } from "@/components/retroui/Alert";
import { Card } from "@/components/retroui/Card";
import { Input } from "@/components/retroui/Input";
import { Label } from "@/components/retroui/Label";
import { Text } from "@/components/retroui/Text";
import { Textarea } from "@/components/retroui/Textarea";
import { submitForm } from "@/app/actions/submit-form";
import { FileInputField } from "@/app/forms/[id]/file-input";
import { SubmitButton } from "@/app/forms/[id]/submit-button";
import {
  DeadlinePill,
  FormCover,
  SectionDivider,
  TeamBadge,
  VsmLogo,
  getDeadlineState,
} from "@/app/components/vsm-ui";
import { getFormById } from "@/lib/supabase";
import type { FormField } from "@/lib/supabase";

function HelpText({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-1 text-xs leading-5 text-muted">{text}</p>;
}

function FieldLabel({ field }: { field: FormField }) {
  return (
    <Label htmlFor={field.id} className="mb-1 block text-sm font-medium text-dark">
      {field.label}
      {field.required ? <span className="ml-1 text-saffron">*</span> : null}
    </Label>
  );
}

function FormFieldInput({ field }: { field: FormField }) {
  const { validation } = field;

  if (field.type === "textarea") {
    return (
      <div>
        <FieldLabel field={field} />
        <HelpText text={field.helpText} />
        <Textarea
          id={field.id}
          name={field.label}
          required={field.required}
          placeholder={field.placeholder ?? ""}
          className="mt-2 min-h-30 resize-y"
          minLength={validation?.minLength}
          maxLength={validation?.maxLength}
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div>
        <FieldLabel field={field} />
        <HelpText text={field.helpText} />
        <select
          id={field.id}
          name={field.label}
          required={field.required}
          className="mt-2 w-full rounded-xl border-2 border-border bg-white px-4 py-3 shadow-[3px_3px_0_0_var(--border)]"
          defaultValue=""
        >
          <option value="">{field.placeholder ?? `Select ${field.label}`}</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "radio" && field.options) {
    return (
      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-dark">
          {field.label}
          {field.required ? <span className="ml-1 text-saffron">*</span> : null}
        </legend>
        <HelpText text={field.helpText} />
        <div className="mt-2 flex flex-wrap gap-3">
          {field.options.map((option) => (
            <Label
              key={option}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-border bg-white px-4 py-2.5 text-sm text-dark shadow-[3px_3px_0_0_var(--border)] transition-all duration-150 has-checked:translate-x-px has-checked:translate-y-px has-checked:bg-[rgba(232,100,10,0.06)]"
            >
              <input type="radio" name={field.label} value={option} required={field.required} className="sr-only" />
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-current transition-colors">
                <span className="h-2 w-2 rounded-full bg-current opacity-0 group-has-checked:opacity-100" />
              </span>
              {option}
            </Label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (field.type === "checkbox") {
    return (
      <>
        <input type="hidden" name="_checkboxKeys" value={field.label} />
        <Label className="group flex cursor-pointer items-start gap-3 rounded-[16px] border-2 border-border bg-white px-4 py-3.5 text-sm text-dark shadow-[3px_3px_0_0_var(--border)] transition-all duration-150 has-checked:translate-x-px has-checked:translate-y-px has-checked:bg-[rgba(232,100,10,0.05)]">
          <input
            type="checkbox"
            name={field.label}
            value="true"
            required={field.required}
            className="mt-0.5 h-5 w-5 shrink-0 accent-saffron"
          />
          <span>
            {field.label}
            {field.required ? <span className="ml-1 text-saffron">*</span> : null}
            {field.helpText ? <span className="mt-0.5 block text-xs text-muted">{field.helpText}</span> : null}
          </span>
        </Label>
      </>
    );
  }

  if (field.type === "linear-scale") {
    const min = field.scaleMin ?? 1;
    const max = field.scaleMax ?? 5;
    const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);

    return (
      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-dark">
          {field.label}
          {field.required ? <span className="ml-1 text-saffron">*</span> : null}
        </legend>
        <HelpText text={field.helpText} />
        <div className="mt-3 space-y-2">
          <div className="flex flex-wrap gap-3">
            {steps.map((n) => (
              <Label
                key={n}
                className="group flex shrink-0 cursor-pointer flex-col items-center gap-1.5 rounded-[14px] border-2 border-border bg-white px-3 py-3 text-sm font-semibold text-muted shadow-[3px_3px_0_0_var(--border)] transition-all has-checked:translate-x-px has-checked:translate-y-px has-checked:border-saffron has-checked:bg-[rgba(232,100,10,0.06)] has-checked:text-saffron"
              >
                <input type="radio" name={field.label} value={String(n)} required={field.required} className="sr-only" />
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-current bg-white text-sm transition-all group-has-checked:bg-saffron group-has-checked:text-white">
                  {n}
                </span>
              </Label>
            ))}
          </div>
          {(field.scaleMinLabel || field.scaleMaxLabel) && (
            <div className="flex justify-between px-1">
              <span className="text-xs text-muted">{field.scaleMinLabel}</span>
              <span className="text-xs text-muted">{field.scaleMaxLabel}</span>
            </div>
          )}
        </div>
      </fieldset>
    );
  }

  if (field.type === "file") {
    return (
      <div>
        <FieldLabel field={field} />
        <HelpText text={field.helpText} />
        <div className="mt-2">
          <FileInputField id={field.id} name={field.label} required={field.required} />
        </div>
      </div>
    );
  }

  const inputType =
    field.type === "email"
      ? "email"
      : field.type === "number"
        ? "number"
        : field.type === "date"
          ? "date"
          : field.type === "tel"
            ? "tel"
            : "text";

  return (
    <div>
      <FieldLabel field={field} />
      <HelpText text={field.helpText} />
      <Input
        id={field.id}
        name={field.label}
        type={inputType}
        required={field.required}
        placeholder={field.placeholder ?? ""}
        minLength={validation?.minLength}
        maxLength={validation?.maxLength}
        min={validation?.min}
        max={validation?.max}
        pattern={validation?.pattern}
        title={validation?.errorMessage}
        className="mt-2"
      />
    </div>
  );
}

export default async function FormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = await getFormById(id);

  if (!form) notFound();

  const deadline = getDeadlineState(form.closingDate);
  const isClosed = form.status === "closed" || deadline?.tone === "closed";
  const action = submitForm.bind(null, form.id);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="pattern-orb pattern-orb-top" aria-hidden />
      <div className="pattern-orb pattern-orb-bottom" aria-hidden />

      <div className="mx-auto flex w-full max-w-190 flex-col gap-5">
        <Link
          href="/"
          className="fade-up fade-up-1 inline-flex w-fit items-center gap-2 rounded-full border-2 border-border bg-(--color-card) px-4 py-2 text-sm font-medium text-muted shadow-[3px_3px_0_0_var(--border)] transition-all hover:-translate-y-px hover:text-saffron"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
            <path d="M10 12L6 8l4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="inline-flex items-center gap-2">
            <span>Back to</span>
            <VsmLogo size={16} tone="neutral" shadow={false} />
            <span>Forms</span>
          </span>
        </Link>

        <Card className="fade-up fade-up-2 block overflow-hidden rounded-[28px] border-2 border-border bg-(--color-card) shadow-[6px_6px_0_0_var(--border)]">
          <FormCover form={form} tall />

          <div className="space-y-6 p-5 sm:p-6 lg:p-8">
            <header className="space-y-3">
              <Text as="h1" className="text-[28px] leading-tight text-dark">
                {form.title}
              </Text>
              <div className="flex flex-wrap items-center gap-3">
                <TeamBadge team={form.team} />
                {deadline ? <DeadlinePill deadline={deadline} /> : null}
              </div>
            </header>

            <section className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                About this initiative
              </p>
              <p className="text-sm leading-7 text-muted">{form.description}</p>
            </section>

            <SectionDivider label="Registration Form" />

            {isClosed ? (
              <Alert
                status="warning"
                className="rounded-[16px] text-center shadow-[3px_3px_0_0_var(--border)]"
              >
                <Alert.Title className="text-base font-semibold">
                  Registrations are closed
                </Alert.Title>
                <Alert.Description className="mt-1 text-sm">
                  This form is no longer accepting new submissions.
                </Alert.Description>
              </Alert>
            ) : (
              <form action={action} className="space-y-4">
                {form.fields.map((field) => (
                  <FormFieldInput key={field.id} field={field} />
                ))}
                <div className="pt-2">
                  <SubmitButton />
                </div>
              </form>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
