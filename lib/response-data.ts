import type { FormField, FormResponse, VSMForm } from "./supabase";

export function normalizeFieldKey(key: string): string {
  return key
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ");
}

function commonPrefixLength(a: string, b: string): number {
  const limit = Math.min(a.length, b.length);
  let index = 0;
  while (index < limit && a[index] === b[index]) {
    index += 1;
  }
  return index;
}

export function keysAreSimilar(a: string, b: string): boolean {
  const left = normalizeFieldKey(a);
  const right = normalizeFieldKey(b);

  if (left === right) return true;

  const prefixLength = commonPrefixLength(left, right);
  const shorterLength = Math.min(left.length, right.length);

  return prefixLength >= 15 && prefixLength >= shorterLength * 0.8;
}

function fieldMatchesKey(field: FormField, key: string): boolean {
  return (
    key === field.label ||
    key === field.id ||
    normalizeFieldKey(key) === normalizeFieldKey(field.label) ||
    keysAreSimilar(key, field.label)
  );
}

function dedupeFormFields(fields: FormField[]): FormField[] {
  const seen = new Set<string>();

  return fields.filter((field) => {
    const normalizedLabel = normalizeFieldKey(field.label);
    if (seen.has(normalizedLabel)) return false;
    seen.add(normalizedLabel);
    return true;
  });
}

function collectDataKeys(responses: FormResponse[]): string[] {
  const keys = new Set<string>();
  for (const response of responses) {
    Object.keys(response.data).forEach((key) => keys.add(key));
  }
  return [...keys];
}

function scoreKeyMatch(field: FormField, key: string): number {
  if (key === field.label) return 100;
  if (key === field.id) return 90;
  if (normalizeFieldKey(key) === normalizeFieldKey(field.label)) return 80;
  if (keysAreSimilar(key, field.label)) return 60;
  return 0;
}

function assignDataKeysToFields(
  fields: FormField[],
  dataKeys: string[]
): Map<string, string[]> {
  const assignedKeys = new Set<string>();
  const fieldToKeys = new Map<string, string[]>();

  for (const field of fields) {
    let bestKey: string | undefined;
    let bestScore = 0;

    for (const key of dataKeys) {
      if (assignedKeys.has(key)) continue;
      const score = scoreKeyMatch(field, key);
      if (score > bestScore) {
        bestScore = score;
        bestKey = key;
      }
    }

    if (bestKey) {
      assignedKeys.add(bestKey);
      fieldToKeys.set(field.id, [bestKey]);
    } else {
      fieldToKeys.set(field.id, []);
    }
  }

  return fieldToKeys;
}

export function formatCellValue(value: unknown): string {
  if (value == null || value === "") return "";
  if (value === "true" || value === true) return "Yes";
  if (value === "false" || value === false) return "No";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    return value.filter(Boolean).map(String).join(", ");
  }
  return String(value);
}

export function getFieldValue(
  data: Record<string, unknown>,
  field: FormField
): unknown {
  if (field.label in data) return data[field.label];
  if (field.id in data) return data[field.id];

  const normalizedLabel = normalizeFieldKey(field.label);
  for (const [key, value] of Object.entries(data)) {
    if (normalizeFieldKey(key) === normalizedLabel) {
      return value;
    }
  }

  for (const [key, value] of Object.entries(data)) {
    if (keysAreSimilar(key, field.label)) {
      return value;
    }
  }

  return undefined;
}

function getValueForField(
  data: Record<string, unknown>,
  field: FormField,
  assignedKeys: string[]
): unknown {
  for (const key of assignedKeys) {
    if (key in data) return data[key];
  }

  return getFieldValue(data, field);
}

function getOrphanDataKeys(
  fields: FormField[],
  dataKeys: string[],
  fieldToKeys: Map<string, string[]>
): string[] {
  const assignedKeys = new Set<string>();
  fieldToKeys.forEach((keys) => keys.forEach((key) => assignedKeys.add(key)));

  return dataKeys
    .filter((key) => {
      if (assignedKeys.has(key)) return false;
      return !fields.some((field) => fieldMatchesKey(field, key));
    })
    .sort((a, b) => a.localeCompare(b));
}

export function buildExportData(form: VSMForm, responses: FormResponse[]) {
  const fields = dedupeFormFields(form.fields);
  const dataKeys = collectDataKeys(responses);
  const fieldToKeys = assignDataKeysToFields(fields, dataKeys);
  const orphanKeys = getOrphanDataKeys(fields, dataKeys, fieldToKeys);

  const headers = [
    "Submitted At",
    ...fields.map((field) => field.label),
    ...orphanKeys,
  ];

  const rows = responses.map((response) => [
    new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(response.submittedAt)),
    ...fields.map((field) =>
      formatCellValue(
        getValueForField(
          response.data,
          field,
          fieldToKeys.get(field.id) ?? []
        )
      )
    ),
    ...orphanKeys.map((key) => formatCellValue(response.data[key])),
  ]);

  return { headers, rows };
}
