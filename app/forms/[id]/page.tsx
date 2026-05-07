import Link from "next/link";
import { notFound } from "next/navigation";

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

// ─── field renderer ───────────────────────────────────────────────────────────

function HelpText({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-1 text-xs leading-5 text-[color:var(--color-muted)]">{text}</p>;
}

function FieldLabel({ field }: { field: FormField }) {
  return (
    <label
      htmlFor={field.id}
      className="mb-1 block text-sm font-medium text-[color:var(--color-dark)]"
    >
      {field.label}
      {field.required ? (
        <span className="ml-1 text-[color:var(--color-saffron)]">*</span>
      ) : null}
    </label>
  );
}

function FormFieldInput({ field }: { field: FormField }) {
  const { validation } = field;

  if (field.type === "textarea") {
    return (
      <div>
        <FieldLabel field={field} />
        <HelpText text={field.helpText} />
        <textarea
          id={field.id}
          name={field.label}
          required={field.required}
          className="vsm-input mt-2 min-h-[120px] resize-y"
          placeholder={field.placeholder ?? ""}
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
        <select id={field.id} name={field.label} required={field.required} className="vsm-input mt-2">
          <option value="">{field.placeholder ?? `Select ${field.label}`}</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "radio" && field.options) {
    return (
      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-[color:var(--color-dark)]">
          {field.label}
          {field.required ? (
            <span className="ml-1 text-[color:var(--color-saffron)]">*</span>
          ) : null}
        </legend>
        <HelpText text={field.helpText} />
        <div className="mt-2 flex flex-wrap gap-3">
          {field.options.map((option) => (
            <label
              key={option}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-white px-4 py-2.5 text-sm text-[color:var(--color-dark)] transition-all duration-150 has-[:checked]:border-[color:var(--color-saffron)] has-[:checked]:bg-[color:rgba(232,100,10,0.06)] has-[:checked]:text-[color:var(--color-saffron)]"
            >
              <input type="radio" name={field.label} value={option} required={field.required} className="sr-only" />
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-current transition-colors">
                <span className="h-2 w-2 rounded-full bg-current opacity-0 group-has-[:checked]:opacity-100" />
              </span>
              {option}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (field.type === "checkbox") {
    return (
      <>
        <input type="hidden" name="_checkboxKeys" value={field.label} />
        <label className="group flex cursor-pointer items-start gap-3 rounded-[16px] border border-[color:var(--color-border)] bg-white px-4 py-3.5 text-sm text-[color:var(--color-dark)] transition-all duration-150 has-[:checked]:border-[color:var(--color-saffron)] has-[:checked]:bg-[color:rgba(232,100,10,0.05)]">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-[color:var(--color-border)] transition-all group-has-[:checked]:border-[color:var(--color-saffron)] group-has-[:checked]:bg-[color:var(--color-saffron)]">
            <svg className="h-3 w-3 text-white opacity-0 group-has-[:checked]:opacity-100" viewBox="0 0 12 10" fill="none" aria-hidden>
              <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <input type="checkbox" name={field.label} value="true" required={field.required} className="sr-only" />
          <span>
            {field.label}
            {field.required ? <span className="ml-1 text-[color:var(--color-saffron)]">*</span> : null}
            {field.helpText ? <span className="mt-0.5 block text-xs text-[color:var(--color-muted)]">{field.helpText}</span> : null}
          </span>
        </label>
      </>
    );
  }

  if (field.type === "linear-scale") {
    const min = field.scaleMin ?? 1;
    const max = field.scaleMax ?? 5;
    const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);

    return (
      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-[color:var(--color-dark)]">
          {field.label}
          {field.required ? <span className="ml-1 text-[color:var(--color-saffron)]">*</span> : null}
        </legend>
        <HelpText text={field.helpText} />
        <div className="mt-3 space-y-2">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {steps.map((n) => (
              <label key={n}
                className="group flex shrink-0 cursor-pointer flex-col items-center gap-1.5">
                <input type="radio" name={field.label} value={String(n)} required={field.required} className="sr-only" />
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[color:var(--color-border)] bg-white text-sm font-semibold text-[color:var(--color-muted)] transition-all group-has-[:checked]:border-[color:var(--color-saffron)] group-has-[:checked]:bg-[color:var(--color-saffron)] group-has-[:checked]:text-white">
                  {n}
                </span>
              </label>
            ))}
          </div>
          {(field.scaleMinLabel || field.scaleMaxLabel) && (
            <div className="flex justify-between px-1">
              <span className="text-xs text-[color:var(--color-muted)]">{field.scaleMinLabel}</span>
              <span className="text-xs text-[color:var(--color-muted)]">{field.scaleMaxLabel}</span>
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
    field.type === "email" ? "email"
    : field.type === "number" ? "number"
    : field.type === "date" ? "date"
    : field.type === "tel" ? "tel"
    : "text";

  return (
    <div>
      <FieldLabel field={field} />
      <HelpText text={field.helpText} />
      <input
        id={field.id}
        name={field.label}
        type={inputType}
        required={field.required}
        className="vsm-input mt-2"
        placeholder={field.placeholder ?? ""}
        minLength={validation?.minLength}
        maxLength={validation?.maxLength}
        min={validation?.min}
        max={validation?.max}
        pattern={validation?.pattern}
        title={validation?.errorMessage}
      />
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

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
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6">
      <div className="pattern-orb pattern-orb-top" aria-hidden />
      <div className="pattern-orb pattern-orb-bottom" aria-hidden />

      <div className="mx-auto flex w-full max-w-[600px] flex-col gap-5">
        <Link
          href="/"
          className="fade-up fade-up-1 inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-4 py-2 text-sm font-medium text-[color:var(--color-muted)] transition-all hover:border-[color:rgba(232,100,10,0.22)] hover:text-[color:var(--color-saffron)]"
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

        <article className="fade-up fade-up-2 overflow-hidden rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] shadow-warm">
          <FormCover form={form} tall />

          <div className="space-y-6 p-5 sm:p-6">
            <header className="space-y-3">
              <h1 className="font-serif text-[28px] leading-tight text-[color:var(--color-dark)]">
                {form.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <TeamBadge team={form.team} />
                {deadline ? <DeadlinePill deadline={deadline} /> : null}
              </div>
            </header>

            <section className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-muted)]">
                About this initiative
              </p>
              <p className="text-sm leading-7 text-[color:var(--color-muted)]">
                {form.description}
              </p>
            </section>

            <SectionDivider label="Registration Form" />

            {isClosed ? (
              <div className="rounded-[16px] border border-[color:rgba(107,91,69,0.2)] bg-[color:rgba(107,91,69,0.06)] px-5 py-4 text-center">
                <p className="font-serif text-lg text-[color:var(--color-dark)]">Registrations are closed</p>
                <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                  This form is no longer accepting new submissions.
                </p>
              </div>
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
        </article>
      </div>
    </main>
  );
}
