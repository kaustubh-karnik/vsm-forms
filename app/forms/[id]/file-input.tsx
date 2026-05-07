"use client";

import { useEffect, useRef, useState } from "react";

export function FileInputField({
  id,
  name,
  required,
}: {
  id: string;
  name: string;
  required: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return (
    <div className="space-y-3">
      <label
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-[12px] border border-dashed px-4 py-6 text-center text-sm text-[color:var(--color-muted)] transition-colors ${
          isDragging
            ? "border-[color:rgba(232,100,10,0.5)] bg-[color:rgba(232,100,10,0.08)]"
            : "border-[color:var(--color-border)] bg-white hover:border-[color:rgba(232,100,10,0.3)] hover:bg-[color:rgba(232,100,10,0.03)]"
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);

          const dropped = event.dataTransfer.files?.[0] ?? null;
          if (!dropped) return;

          setFile(dropped);
          if (inputRef.current) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(dropped);
            inputRef.current.files = dataTransfer.files;
          }
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-[color:var(--color-border)]" aria-hidden>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
        </svg>
        <span>
          <span className="font-medium text-[color:var(--color-saffron)]">Click to upload</span> or drag and drop
        </span>
        <input
          key={inputKey}
          ref={inputRef}
          id={id}
          name={name}
          type="file"
          className="sr-only"
          required={required}
          onChange={(event) => {
            const selected = event.target.files?.[0] ?? null;
            setFile(selected);
            setIsDragging(false);
          }}
        />
      </label>

      <div className="rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-4 py-3 text-sm text-[color:var(--color-muted)]">
        {file ? (
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-medium text-[color:var(--color-dark)]">{file.name}</p>
              <p className="text-xs text-[color:var(--color-muted)]">
                {(file.size / 1024).toFixed(1)} KB · Selected
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setInputKey((prev) => prev + 1);
                  if (inputRef.current) {
                    inputRef.current.value = "";
                  }
                }}
                className="rounded-[10px] border border-[color:var(--color-border)] px-3 py-1.5 text-xs font-semibold text-[color:var(--color-muted)] transition-colors hover:border-[color:rgba(232,100,10,0.22)] hover:text-[color:var(--color-saffron)]"
              >
                Remove
              </button>
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Selected upload preview"
                  className="h-14 w-14 shrink-0 rounded-[10px] border border-[color:var(--color-border)] object-cover"
                />
              )}
            </div>
          </div>
        ) : (
          <p>No file selected yet.</p>
        )}
      </div>
    </div>
  );
}
