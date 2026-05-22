"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";

import { updateForm, uploadBannerImage } from "@/app/actions/form-actions";
import type {
  FieldType,
  FieldValidation,
  FormField,
  FormSettings,
  FormStatus,
  Team,
  VSMForm,
} from "@/lib/supabase";

// ─── constants ───────────────────────────────────────────────────────────────

const TEAMS: Team[] = ["Yuva Chetana", "Gram Vikas", "Nalanda", "MUSE", "SDA", "ECC", "Others"];

const TEAM_GRADIENTS: Record<Team, string> = {
  "Yuva Chetana": "linear-gradient(135deg, #E8640A 0%, #C2500A 50%, #7C2D0A 100%)",
  "Gram Vikas": "linear-gradient(135deg, #2D6A3F 0%, #1A4A2A 50%, #0F2E18 100%)",
  Nalanda: "linear-gradient(135deg, #1E4FC2 0%, #1E3A8A 50%, #172554 100%)",
  MUSE: "linear-gradient(135deg, #D43E8D 0%, #A8266A 50%, #7C1A4E 100%)",
  SDA: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 50%, #3B0764 100%)",
  ECC: "linear-gradient(135deg, #14B8A6 0%, #0F766E 50%, #134E4A 100%)",
  Others: "linear-gradient(135deg, #9CA3AF 0%, #6B7280 50%, #4B5563 100%)",
};

const FIELD_TYPES: Array<{ type: FieldType; label: string; hint: string; icon: React.ReactNode }> = [
  { type: "text", label: "Short Text", hint: "Single line", icon: <ShortTextIcon /> },
  { type: "textarea", label: "Long Text", hint: "Paragraph", icon: <LongTextIcon /> },
  { type: "email", label: "Email", hint: "Email address", icon: <EmailIcon /> },
  { type: "tel", label: "Phone", hint: "Phone number", icon: <PhoneIcon /> },
  { type: "number", label: "Number", hint: "Numeric value", icon: <NumberIcon /> },
  { type: "select", label: "Dropdown", hint: "One from list", icon: <SelectIcon /> },
  { type: "radio", label: "Multiple Choice", hint: "Radio buttons", icon: <RadioIcon /> },
  { type: "checkbox", label: "Checkbox", hint: "Tick box", icon: <CheckboxIcon /> },
  { type: "linear-scale", label: "Linear Scale", hint: "Rating 1–10", icon: <ScaleIcon /> },
  { type: "date", label: "Date", hint: "Date picker", icon: <DateIcon /> },
  { type: "file", label: "File Upload", hint: "Upload files", icon: <FileIcon /> },
];

const HAS_OPTIONS: FieldType[] = ["select", "radio"];
const HAS_PLACEHOLDER: FieldType[] = ["text", "textarea", "email", "tel", "number"];
const HAS_VALIDATION: FieldType[] = ["text", "textarea", "email", "tel", "number"];

// ─── icons ───────────────────────────────────────────────────────────────────

function ShortTextIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden>
      <path d="M3 6h14M3 10h9M3 14h6" strokeLinecap="round" />
    </svg>
  );
}
function LongTextIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden>
      <path d="M3 5h14M3 9h14M3 13h14M3 17h8" strokeLinecap="round" />
    </svg>
  );
}
function EmailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden>
      <rect x="2" y="4" width="16" height="12" rx="2" />
      <path d="M2 7l8 5 8-5" strokeLinecap="round" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
  );
}
function NumberIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden>
      <path d="M4 4l3 12M9 4l3 12M3 8h14M3 12h14" strokeLinecap="round" />
    </svg>
  );
}
function SelectIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden>
      <rect x="2" y="5" width="16" height="10" rx="2" />
      <path d="M7 10h6M11 8l2 2-2 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function RadioIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden>
      <circle cx="5" cy="7" r="2.5" />
      <circle cx="5" cy="7" r="1" fill="currentColor" stroke="none" />
      <path d="M9 7h8M9 13h8" strokeLinecap="round" />
      <circle cx="5" cy="13" r="2.5" />
    </svg>
  );
}
function CheckboxIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden>
      <rect x="2.5" y="4.5" width="7" height="7" rx="1.5" />
      <path d="M4 8l2 2 3-3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 8h5M12.5 12h5" strokeLinecap="round" />
    </svg>
  );
}
function ScaleIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden>
      <path d="M2 10h16M5 7v6M8 5v10M11 7v6M14 4v12M17 7v6" strokeLinecap="round" />
    </svg>
  );
}
function DateIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden>
      <rect x="2" y="4" width="16" height="14" rx="2" />
      <path d="M2 8h16M7 2v4M13 2v4" strokeLinecap="round" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden>
      <path d="M4 4a2 2 0 012-2h5l5 5v9a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" strokeLinejoin="round" />
      <path d="M11 2v5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DragHandleIcon() {
  return (
    <svg viewBox="0 0 16 20" fill="currentColor" className="h-4 w-4" aria-hidden>
      <circle cx="5" cy="5" r="1.5" />
      <circle cx="11" cy="5" r="1.5" />
      <circle cx="5" cy="10" r="1.5" />
      <circle cx="11" cy="10" r="1.5" />
      <circle cx="5" cy="15" r="1.5" />
      <circle cx="11" cy="15" r="1.5" />
    </svg>
  );
}

// ─── field type label lookup ──────────────────────────────────────────────────

const fieldTypeLabel = Object.fromEntries(
  FIELD_TYPES.map((f) => [f.type, f.label])
) as Record<FieldType, string>;

const fieldTypeIcon = Object.fromEntries(
  FIELD_TYPES.map((f) => [f.type, f.icon])
) as Record<FieldType, React.ReactNode>;

// ─── options editor ───────────────────────────────────────────────────────────

function OptionsEditor({ options, onChange }: { options: string[]; onChange: (next: string[]) => void }) {
  function update(index: number, value: string) {
    const next = [...options];
    next[index] = value;
    onChange(next);
  }
  function remove(index: number) { onChange(options.filter((_, i) => i !== index)); }
  function add() { onChange([...options, `Option ${options.length + 1}`]); }

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-[0.13em] text-[color:var(--color-dark)]">Options</p>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="shrink-0 text-[color:var(--color-muted)]">
              <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3" aria-hidden><circle cx="8" cy="8" r="5" /></svg>
            </span>
            <input value={opt} onChange={(e) => update(i, e.target.value)} className="vsm-input py-2 text-sm" placeholder={`Option ${i + 1}`} />
            <button type="button" onClick={() => remove(i)} disabled={options.length <= 1}
              className="shrink-0 rounded-lg border-2 border-black p-1 bg-[color:var(--color-cream)] text-[color:var(--color-dark)] shadow-[1px_1px_0_0_#000] transition-all hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Remove option">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5" aria-hidden>
                <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={add}
        className="inline-flex items-center gap-1.5 rounded-lg border-2 border-dashed border-black bg-[color:var(--color-card)] px-3 py-2 text-sm text-[color:var(--color-dark)] font-bold transition-all shadow-[2px_2px_0_0_#000] hover:shadow-[3px_3px_0_0_#E8640A] hover:border-[color:var(--color-saffron)] hover:text-[color:var(--color-saffron)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5" aria-hidden>
          <path d="M8 3v10M3 8h10" strokeLinecap="round" />
        </svg>
        Add option
      </button>
    </div>
  );
}

// ─── validation editor ────────────────────────────────────────────────────────

function ValidationEditor({ type, validation, onChange }: {
  type: FieldType;
  validation?: FieldValidation;
  onChange: (v: FieldValidation) => void;
}) {
  const v = validation ?? {};
  const isText = type === "text" || type === "textarea" || type === "email" || type === "tel";
  const isNum = type === "number";

  return (
    <div className="space-y-3 rounded-xl border-2 border-black bg-[color:var(--color-cream)] p-4 shadow-[2px_2px_0_0_#000]">
      <p className="text-xs font-bold uppercase tracking-[0.13em] text-[color:var(--color-dark)]">Validation</p>
      <div className="grid grid-cols-2 gap-3">
        {isText && (
          <>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[color:var(--color-dark)]">Min length</label>
              <input type="number" min={0} value={v.minLength ?? ""} onChange={(e) => onChange({ ...v, minLength: e.target.value ? Number(e.target.value) : undefined })}
                className="vsm-input py-1.5 text-sm" placeholder="0" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[color:var(--color-dark)]">Max length</label>
              <input type="number" min={0} value={v.maxLength ?? ""} onChange={(e) => onChange({ ...v, maxLength: e.target.value ? Number(e.target.value) : undefined })}
                className="vsm-input py-1.5 text-sm" placeholder="∞" />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-bold text-[color:var(--color-dark)]">Regex pattern</label>
              <input type="text" value={v.pattern ?? ""} onChange={(e) => onChange({ ...v, pattern: e.target.value || undefined })}
                className="vsm-input py-1.5 text-sm font-mono" placeholder="e.g. ^[A-Za-z ]+$" />
            </div>
          </>
        )}
        {isNum && (
          <>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[color:var(--color-dark)]">Min value</label>
              <input type="number" value={v.min ?? ""} onChange={(e) => onChange({ ...v, min: e.target.value ? Number(e.target.value) : undefined })}
                className="vsm-input py-1.5 text-sm" placeholder="−∞" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[color:var(--color-dark)]">Max value</label>
              <input type="number" value={v.max ?? ""} onChange={(e) => onChange({ ...v, max: e.target.value ? Number(e.target.value) : undefined })}
                className="vsm-input py-1.5 text-sm" placeholder="∞" />
            </div>
          </>
        )}
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-[color:var(--color-dark)]">Custom error message</label>
        <input type="text" value={v.errorMessage ?? ""} onChange={(e) => onChange({ ...v, errorMessage: e.target.value || undefined })}
          className="vsm-input py-1.5 text-sm" placeholder="e.g. Please enter a valid name" />
      </div>
    </div>
  );
}

// ─── field card ───────────────────────────────────────────────────────────────

function FieldCard({
  field, index, total, isActive, isDragging, isOver,
  onActivate, onUpdate, onDelete,
  onDragStart, onDragOver, onDrop, onDragEnd,
}: {
  field: FormField;
  index: number;
  total: number;
  isActive: boolean;
  isDragging: boolean;
  isOver: boolean;
  onActivate: () => void;
  onUpdate: (patch: Partial<FormField>) => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  const [showValidation, setShowValidation] = useState(false);

  return (
    <div
      draggable onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} onDragEnd={onDragEnd}
      className={`relative rounded-xl border-2 border-black transition-all duration-150 ${
        isDragging ? "opacity-40"
        : isOver ? "bg-[color:rgba(232,100,10,0.05)] translate-x-[2px] translate-y-[2px]"
        : isActive ? "bg-[color:var(--color-card)] shadow-[4px_4px_0_0_#E8640A]"
        : "bg-[color:var(--color-card)] shadow-[3px_3px_0_0_#1A1208] hover:shadow-[4px_4px_0_0_#1A1208] hover:-translate-x-[1px] hover:-translate-y-[1px]"
      }`}
    >
      {isActive && <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full bg-[color:var(--color-saffron)]" />}

      <div
        className="flex cursor-pointer items-center gap-3 px-4 py-3.5"
        onClick={(e) => {
          e.stopPropagation();
          onActivate();
        }}
      >
        <button type="button" className="cursor-grab touch-none text-[color:rgba(107,91,69,0.35)] transition-colors hover:text-[color:var(--color-muted)] active:cursor-grabbing"
          aria-label="Drag to reorder" onClick={(e) => e.stopPropagation()}>
          <DragHandleIcon />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="shrink-0 text-[color:var(--color-muted)]">{fieldTypeIcon[field.type]}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[color:var(--color-dark)]">
              {field.label || <span className="italic text-[color:var(--color-muted)] font-medium">Untitled question</span>}
              {field.required && <span className="ml-1 text-[color:var(--color-saffron)]">*</span>}
            </p>
            <p className="text-xs font-semibold text-[color:var(--color-muted)]">{fieldTypeLabel[field.type]}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="rounded-lg border-2 border-black p-1.5 bg-[color:var(--color-cream)] text-[color:var(--color-dark)] shadow-[1px_1px_0_0_#000] hover:bg-red-50 hover:text-red-500 hover:shadow-[2px_2px_0_0_#000] hover:-translate-x-[0.5px] hover:-translate-y-[0.5px] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all"
            aria-label="Delete field"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
              <path d="M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4l.5 9h5l.5-9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {isActive && (
        <div className="border-t-2 border-black px-5 pb-5 pt-4 space-y-4" onClick={(e) => e.stopPropagation()}>
          {/* Question label */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-[0.13em] text-[color:var(--color-dark)]">Question</label>
            <input autoFocus value={field.label} onChange={(e) => onUpdate({ label: e.target.value })} className="vsm-input text-sm" placeholder="Enter your question…" />
          </div>

          {/* Help text */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-[0.13em] text-[color:var(--color-dark)]">
              Help text <span className="font-normal normal-case tracking-normal text-[color:var(--color-muted)]">(optional)</span>
            </label>
            <input value={field.helpText ?? ""} onChange={(e) => onUpdate({ helpText: e.target.value || undefined })}
              className="vsm-input text-sm" placeholder="Extra guidance shown below the question…" />
          </div>

          {/* Placeholder */}
          {HAS_PLACEHOLDER.includes(field.type) && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-[0.13em] text-[color:var(--color-dark)]">
                Placeholder <span className="font-normal normal-case tracking-normal text-[color:var(--color-muted)]">(optional)</span>
              </label>
              <input value={field.placeholder ?? ""} onChange={(e) => onUpdate({ placeholder: e.target.value })}
                className="vsm-input text-sm" placeholder="e.g. Your full name" />
            </div>
          )}

          {/* Options editor */}
          {HAS_OPTIONS.includes(field.type) && (
            <OptionsEditor options={field.options ?? ["Option 1"]} onChange={(options) => onUpdate({ options })} />
          )}

          {/* Linear scale config */}
          {field.type === "linear-scale" && (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-[color:var(--color-dark)]">Scale range</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[color:var(--color-dark)]">Min</label>
                  <select value={field.scaleMin ?? 1} onChange={(e) => onUpdate({ scaleMin: Number(e.target.value) })} className="vsm-input py-2 text-sm bg-[color:var(--color-cream)] border-2 border-black shadow-[2px_2px_0_0_#000] focus:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] transition-all cursor-pointer">
                    {[0, 1].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[color:var(--color-dark)]">Max</label>
                  <select value={field.scaleMax ?? 5} onChange={(e) => onUpdate({ scaleMax: Number(e.target.value) })} className="vsm-input py-2 text-sm bg-[color:var(--color-cream)] border-2 border-black shadow-[2px_2px_0_0_#000] focus:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] transition-all cursor-pointer">
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[color:var(--color-dark)]">Min label</label>
                  <input value={field.scaleMinLabel ?? ""} onChange={(e) => onUpdate({ scaleMinLabel: e.target.value })}
                    className="vsm-input py-1.5 text-sm" placeholder="e.g. Not likely" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[color:var(--color-dark)]">Max label</label>
                  <input value={field.scaleMaxLabel ?? ""} onChange={(e) => onUpdate({ scaleMaxLabel: e.target.value })}
                    className="vsm-input py-1.5 text-sm" placeholder="e.g. Very likely" />
                </div>
              </div>
            </div>
          )}

          {/* Validation */}
          {HAS_VALIDATION.includes(field.type) && (
            <div className="space-y-2">
              <button type="button" onClick={() => setShowValidation((p) => !p)}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-[color:var(--color-dark)] transition-colors hover:text-[color:var(--color-saffron)]">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" className={`h-3.5 w-3.5 transition-transform ${showValidation ? "rotate-90" : ""}`} aria-hidden>
                  <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Validation rules
              </button>
              {showValidation && (
                <ValidationEditor type={field.type} validation={field.validation}
                  onChange={(v) => onUpdate({ validation: v })} />
              )}
            </div>
          )}

          {/* Required toggle */}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-black bg-[color:var(--color-cream)] px-4 py-3 text-sm shadow-[2px_2px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_#000] transition-all">
            <div className="relative">
              <input type="checkbox" checked={field.required} onChange={(e) => onUpdate({ required: e.target.checked })} className="peer sr-only" />
              <div className="h-5 w-9 rounded-full border-2 border-black bg-[color:var(--color-card)] transition-colors peer-checked:bg-[color:var(--color-saffron)]" />
              <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full border border-black bg-[color:var(--color-cream)] transition-all peer-checked:translate-x-4" />
            </div>
            <span className="font-bold text-[color:var(--color-dark)]">Required</span>
            <span className="text-[color:var(--color-muted)] font-medium">— respondents must answer this</span>
          </label>
        </div>
      )}
    </div>
  );
}

// ─── banner uploader ──────────────────────────────────────────────────────────

function BannerUploader({
  formId,
  coverGradient,
  coverImageUrl,
  onImageUploaded,
  onRemoveImage,
}: {
  formId: string;
  coverGradient: string;
  coverImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onRemoveImage: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const url = await uploadBannerImage(formId, fd);
      onImageUploaded(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {/* Cover preview */}
      <div
        className="relative flex h-28 items-center justify-center overflow-hidden rounded-xl border-2 border-black"
        style={coverImageUrl ? {} : { background: coverGradient }}
      >
        {coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverImageUrl} alt="Form banner" className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
        <div className={`absolute inset-0 flex items-center justify-center gap-3 ${coverImageUrl ? "bg-black/40" : ""}`}>
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-[color:var(--color-card)] px-4 py-2 text-sm font-bold text-[color:var(--color-dark)] shadow-[2px_2px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all disabled:opacity-50">
            {uploading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
                <path d="M8 3v8M4 7l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 13h12" strokeLinecap="round" />
              </svg>
            )}
            {uploading ? "Uploading…" : coverImageUrl ? "Replace image" : "Upload image"}
          </button>
          {coverImageUrl && (
            <button type="button" onClick={onRemoveImage}
              className="inline-flex items-center gap-1.5 rounded-lg border-2 border-black bg-red-100 px-3 py-2 text-xs font-bold text-red-600 shadow-[2px_2px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5" aria-hidden>
                <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
              </svg>
              Remove
            </button>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
      </div>
      {error && <p className="text-xs font-bold text-red-600">{error}</p>}
      <p className="text-xs text-[color:var(--color-muted)] font-medium">JPG, PNG, WebP · max 5 MB · or use gradient colours below</p>
    </div>
  );
}

// ─── settings panel ───────────────────────────────────────────────────────────

function SettingsPanel({ settings, onChange }: { settings: FormSettings; onChange: (s: FormSettings) => void }) {
  return (
    <div className="space-y-4 rounded-xl border-2 border-black bg-[color:var(--color-card)] p-5 shadow-[4px_4px_0_0_#000]">
      <p className="text-sm font-bold text-[color:var(--color-dark)]">Response settings</p>

      <div className="space-y-3">
        {/* Confirmation message */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-[0.13em] text-[color:var(--color-dark)]">
            Confirmation message
          </label>
          <textarea
            value={settings.confirmationMessage ?? ""}
            onChange={(e) => onChange({ ...settings, confirmationMessage: e.target.value || undefined })}
            className="vsm-input min-h-[72px] resize-y text-sm"
            placeholder="e.g. Thank you! Our team will be in touch soon. 🙏"
          />
          <p className="text-xs text-[color:var(--color-muted)] font-medium">Shown on the success page after submission.</p>
        </div>

        {/* Toggles */}
        {[
          { key: "limitOneResponse" as const, label: "Limit to 1 response per person", hint: "Prevents duplicate submissions (uses local storage)" },
          { key: "showSummaryToRespondents" as const, label: "Show response summary to respondents", hint: "Respondents can see aggregate stats after submitting" },
          { key: "allowResponseEditing" as const, label: "Allow response editing", hint: "Respondents can edit their submission after submitting" },
        ].map(({ key, label, hint }) => (
          <label key={key} className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-black bg-[color:var(--color-cream)] px-4 py-3 shadow-[2px_2px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_#000] transition-all">
            <div className="relative mt-0.5 shrink-0">
              <input type="checkbox" checked={settings[key] ?? false} onChange={(e) => onChange({ ...settings, [key]: e.target.checked })} className="peer sr-only" />
              <div className="h-5 w-9 rounded-full border-2 border-black bg-[color:var(--color-card)] transition-colors peer-checked:bg-[color:var(--color-saffron)]" />
              <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full border border-black bg-[color:var(--color-cream)] transition-all peer-checked:translate-x-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-[color:var(--color-dark)]">{label}</p>
              <p className="text-xs text-[color:var(--color-muted)] font-medium">{hint}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

// ─── main form builder ────────────────────────────────────────────────────────

export function FormBuilder({ form }: { form: VSMForm }) {
  const [title, setTitle] = useState(form.title);
  const [description, setDescription] = useState(form.description);
  const [team, setTeam] = useState<Team>(form.team);
  const [status, setStatus] = useState<FormStatus>(form.status);
  const [closingDate, setClosingDate] = useState(form.closingDate ?? "");
  const [coverGradient, setCoverGradient] = useState(form.coverGradient);
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>(form.coverImageUrl);
  const [fields, setFields] = useState<FormField[]>(form.fields);
  const [settings, setSettings] = useState<FormSettings>(form.settings ?? {});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"fields" | "settings">("fields");
  const [isPending, startTransition] = useTransition();
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");

  const dragIndexRef = useRef<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function markDirty() { setSaveState("idle"); }

  function addField(type: FieldType) {
    const defaultLabels: Partial<Record<FieldType, string>> = {
      text: "Short answer", textarea: "Paragraph", email: "Email address",
      tel: "Phone number", number: "Number", select: "Dropdown question",
      radio: "Multiple choice", checkbox: "Agreement", date: "Date",
      file: "File upload", "linear-scale": "Rate your experience",
    };
    const newField: FormField = {
      id: `f-${Date.now()}`,
      type,
      label: defaultLabels[type] ?? "New question",
      required: false,
      ...(HAS_OPTIONS.includes(type) ? { options: ["Option 1", "Option 2", "Option 3"] } : {}),
      ...(HAS_PLACEHOLDER.includes(type) ? { placeholder: "" } : {}),
      ...(type === "linear-scale" ? { scaleMin: 1, scaleMax: 5, scaleMinLabel: "", scaleMaxLabel: "" } : {}),
    };
    setFields((prev) => [...prev, newField]);
    setActiveId(newField.id);
    setTimeout(() => document.getElementById("canvas-end")?.scrollIntoView({ behavior: "smooth", block: "end" }), 50);
    markDirty();
  }

  function updateField(id: string, patch: Partial<FormField>) {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
    markDirty();
  }

  function deleteField(id: string) {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (activeId === id) setActiveId(null);
    markDirty();
  }

  function handleDragStart(e: React.DragEvent, index: number) {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = "move";
  }
  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (overIndex !== index) setOverIndex(index);
  }
  function handleDrop(e: React.DragEvent, index: number) {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === index) { dragIndexRef.current = null; setOverIndex(null); return; }
    const next = [...fields];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    setFields(next);
    dragIndexRef.current = null;
    setOverIndex(null);
    markDirty();
  }
  function handleDragEnd() { dragIndexRef.current = null; setOverIndex(null); }

  function handleTeamChange(newTeam: Team) {
    setTeam(newTeam);
    setCoverGradient(TEAM_GRADIENTS[newTeam]);
    markDirty();
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await updateForm(form.id, { title, description, team, status, closingDate, coverGradient, coverImageUrl, fields, settings });
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 2500);
      } catch {
        setSaveState("error");
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* sticky top bar */}
      <header className="sticky top-0 z-30 border-b-2 border-black bg-[color:var(--color-cream)]/95 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
          <Link href="/admin/forms"
            className="shrink-0 rounded-lg border-2 border-black p-2 bg-[color:var(--color-card)] text-[color:var(--color-dark)] shadow-[2px_2px_0_0_#000] transition-all hover:bg-[color:var(--color-cream)] hover:shadow-[3px_3px_0_0_#000] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-0 active:translate-y-0 active:shadow-none"
            aria-label="Back to forms">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4" aria-hidden>
              <path d="M10 12L6 8l4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <input value={title} onChange={(e) => { setTitle(e.target.value); markDirty(); }}
            className="min-w-0 flex-1 rounded-lg border-2 border-transparent bg-transparent px-2 py-1.5 font-serif text-lg font-bold text-[color:var(--color-dark)] outline-none transition-all hover:border-black focus:border-[color:var(--color-saffron)] focus:bg-[color:var(--color-card)] focus:shadow-[2px_2px_0_0_#000]"
            placeholder="Form title…" />
          <select value={team} onChange={(e) => handleTeamChange(e.target.value as Team)} className="vsm-input w-auto min-w-[130px] py-2 text-sm bg-[color:var(--color-cream)] border-2 border-black shadow-[2px_2px_0_0_#000] focus:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] transition-all cursor-pointer">
            {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={status} onChange={(e) => { setStatus(e.target.value as FormStatus); markDirty(); }} className="vsm-input w-auto min-w-[110px] py-2 text-sm bg-[color:var(--color-cream)] border-2 border-black shadow-[2px_2px_0_0_#000] focus:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] transition-all cursor-pointer">
            <option value="draft">Draft</option>
            <option value="active">Published</option>
            <option value="closed">Closed</option>
          </select>
          {saveState === "saved" && (
            <span className="hidden shrink-0 items-center gap-1.5 text-sm font-bold text-[color:#15803D] sm:flex">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4" aria-hidden>
                <path d="M2 8l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Saved
            </span>
          )}
          {saveState === "error" && <span className="hidden shrink-0 text-sm font-bold text-red-600 sm:block">Error saving</span>}
          <button type="button" onClick={handleSave} disabled={isPending}
            className="shrink-0 inline-flex items-center gap-2 rounded-lg border-2 border-black bg-[color:var(--color-saffron)] px-4 py-2 text-sm font-bold text-white shadow-[3px_3px_0_0_#000] transition-all hover:bg-[color:var(--color-saffron-dark)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-none disabled:opacity-60 disabled:pointer-events-none">
            {isPending ? (
              <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3" />
                <path className="opacity-80" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>Saving…</>
            ) : (
              <><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4" aria-hidden>
                <path d="M13 5l-6 6-3-3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>Save</>
            )}
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* left panel: field palette + tab toggle */}
        <aside className="shrink-0 border-b-2 border-black bg-[color:var(--color-card)] lg:w-[260px] lg:border-b-0 lg:border-r-2 lg:border-black">
          <div className="lg:sticky lg:top-[61px] lg:max-h-[calc(100vh-61px)] lg:overflow-y-auto">
            {/* Tabs */}
            <div className="flex border-b-2 border-black">
              {(["fields", "settings"] as const).map((tab) => (
                <button key={tab} type="button" onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-[0.13em] transition-all ${
                    activeTab === tab
                      ? "bg-[color:var(--color-cream)] text-[color:var(--color-saffron)] border-b-2 border-transparent font-extrabold"
                      : "bg-[color:var(--color-card)] text-[color:var(--color-muted)] hover:text-[color:var(--color-dark)] border-b-2 border-black"
                  } ${tab === "fields" ? "border-r-2 border-black" : ""}`}>
                  {tab === "fields" ? "Fields" : "Settings"}
                </button>
              ))}
            </div>

            {activeTab === "fields" ? (
              <div className="p-4 pb-6 lg:p-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[color:var(--color-dark)]">Add a field</p>
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                  {FIELD_TYPES.map(({ type, label, hint, icon }) => (
                    <button key={type} type="button" onClick={() => addField(type)}
                      className="group flex items-center gap-3 rounded-xl border-2 border-black bg-[color:var(--color-card)] px-3 py-2.5 text-left shadow-[2px_2px_0_0_#000] transition-all duration-150 hover:border-[color:var(--color-saffron)] hover:shadow-[3px_3px_0_0_#E8640A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-0 active:translate-y-0 active:shadow-none">
                      <span className="shrink-0 text-[color:var(--color-muted)] transition-colors group-hover:text-[color:var(--color-saffron)]">{icon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold leading-tight text-[color:var(--color-dark)]">{label}</p>
                        <p className="text-[11px] text-[color:var(--color-muted)] font-medium">{hint}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 pb-6 lg:p-5">
                <SettingsPanel settings={settings} onChange={(s) => { setSettings(s); markDirty(); }} />
              </div>
            )}
          </div>
        </aside>

        {/* right panel: form canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[680px] space-y-5">
            {/* Form meta card */}
            <div className="overflow-hidden rounded-2xl border-2 border-black bg-[color:var(--color-card)] shadow-[4px_4px_0_0_#000]">
              <div className="p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
                {/* Banner uploader */}
                <BannerUploader
                  formId={form.id}
                  coverGradient={coverGradient}
                  coverImageUrl={coverImageUrl}
                  onImageUploaded={(url) => { setCoverImageUrl(url); markDirty(); }}
                  onRemoveImage={() => { setCoverImageUrl(undefined); markDirty(); }}
                />

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-[0.13em] text-[color:var(--color-dark)]">Description</label>
                  <textarea value={description} onChange={(e) => { setDescription(e.target.value); markDirty(); }}
                    className="vsm-input min-h-[80px] resize-y text-sm" placeholder="Describe this initiative for volunteers…" />
                </div>

                {/* Closing date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-[0.13em] text-[color:var(--color-dark)]">
                    Closing date <span className="font-normal normal-case tracking-normal text-[color:var(--color-muted)]">(optional)</span>
                  </label>
                  <input type="date" value={closingDate} onChange={(e) => { setClosingDate(e.target.value); markDirty(); }} className="vsm-input text-sm" />
                </div>

                {/* Gradient swatches */}
                <div className="space-y-1.5">
                  <p className="text-xs font-bold uppercase tracking-[0.13em] text-[color:var(--color-dark)]">Gradient fallback colour</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(TEAM_GRADIENTS).map(([t, g]) => (
                      <button key={t} type="button" title={t} onClick={() => { setCoverGradient(g); markDirty(); }}
                        className={`h-8 w-8 rounded-full border-2 border-black transition-all hover:scale-110 ${coverGradient === g ? "ring-2 ring-[color:var(--color-saffron)] ring-offset-2 scale-110" : ""}`}
                        style={{ background: g }} aria-label={`${t} colour`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Field cards */}
            {fields.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-black bg-[color:var(--color-card)] px-6 py-14 text-center shadow-[4px_4px_0_0_#000]">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[color:rgba(232,100,10,0.07)] border-2 border-black">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-7 w-7 text-[color:var(--color-saffron)]" aria-hidden>
                    <path d="M12 4v16m-8-8h16" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="font-serif text-lg font-bold text-[color:var(--color-dark)]">No fields yet</p>
                <p className="mt-1 text-sm text-[color:var(--color-muted)] font-medium">Click a field type on the left to add your first question.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.13em] text-[color:var(--color-dark)]">
                    Fields
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveId(null)}
                    className="text-xs font-bold uppercase tracking-[0.13em] text-[color:var(--color-muted)] transition-colors hover:text-[color:var(--color-saffron)]"
                  >
                    Collapse all
                  </button>
                </div>
                {fields.map((field, index) => (
                  <FieldCard
                    key={field.id} field={field} index={index} total={fields.length}
                    isActive={activeId === field.id}
                    isDragging={dragIndexRef.current === index}
                    isOver={overIndex === index && dragIndexRef.current !== null && dragIndexRef.current !== index}
                    onActivate={() => setActiveId(activeId === field.id ? null : field.id)}
                    onUpdate={(patch) => updateField(field.id, patch)}
                    onDelete={() => deleteField(field.id)}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </div>
            )}

            {fields.length > 0 && (
              <div className="rounded-xl border-2 border-dashed border-black bg-[color:var(--color-card)] px-4 py-3 text-center text-sm text-[color:var(--color-dark)] font-bold shadow-[2px_2px_0_0_#000]">
                Click a field type on the left to add more questions
              </div>
            )}
            <div id="canvas-end" />
          </div>
        </main>
      </div>
    </div>
  );
}
