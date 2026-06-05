import { randomUUID } from 'crypto';
import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

import { supabaseAdmin } from './supabase-server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Team = "Yuva Chetana" | "Gram Vikas" | "Nalanda" | "MUSE" | "SDA" | "ECC" | "Others";
export type FormStatus = "active" | "draft" | "closed";
export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "file"
  | "linear-scale";

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  errorMessage?: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  helpText?: string;
  validation?: FieldValidation;
  // For linear-scale type
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
}

export interface FormSettings {
  confirmationMessage?: string;
  confirmationLink?: { label: string; url: string };
  limitOneResponse?: boolean;
  showSummaryToRespondents?: boolean;
  allowResponseEditing?: boolean;
}

export interface VSMForm {
  id: string;
  title: string;
  description: string;
  team: Team;
  status: FormStatus;
  closingDate?: string;
  responseCount: number;
  coverGradient: string;
  coverImageUrl?: string;
  settings?: FormSettings;
  fields: FormField[];
  createdAt: string;
  createdBy: string;
}

export const TEAM_COLORS: Record<Team, { bg: string; text: string; border: string }> = {
  "Yuva Chetana": { bg: "#FEF3C7", text: "#92400E", border: "#FDE68A" },
  "Gram Vikas":   { bg: "#DCFCE7", text: "#14532D", border: "#BBF7D0" },
  "Nalanda":      { bg: "#DBEAFE", text: "#1E3A8A", border: "#BFDBFE" },
  "MUSE":         { bg: "#FCE7F3", text: "#831843", border: "#FBCFE8" },
  "SDA":          { bg: "#EDE9FE", text: "#4C1D95", border: "#DDD6FE" },
  "ECC":          { bg: "#CCFBF1", text: "#115E59", border: "#99F6E4" },
  "Others":       { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" },
};

export const TEAM_DOTS: Record<Team, string> = {
  "Yuva Chetana": "#D97706",
  "Gram Vikas":   "#2D6A3F",
  "Nalanda":      "#1E4FC2",
  "MUSE":         "#D43E8D",
  "SDA":          "#7C3AED",
  "ECC":          "#0F766E",
  "Others":       "#6B7280",
};

export interface FormResponse {
  id: string;
  formId: string;
  submittedAt: string;
  data: Record<string, unknown>;
}

export async function getAllForms(): Promise<VSMForm[]> {
  noStore();
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) throw error;

  const { data: responses, error: responsesError } = await supabaseAdmin
    .from('responses')
    .select('formId');

  if (responsesError) throw responsesError;

  const responseCounts = (responses || []).reduce<Record<string, number>>(
    (acc, response) => {
      acc[response.formId] = (acc[response.formId] || 0) + 1;
      return acc;
    },
    {}
  );

  return (data || []).map((form) => ({
    ...form,
    responseCount: responseCounts[form.id] ?? 0,
  }));
}

export async function getFormById(id: string): Promise<VSMForm | null> {
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function getFormResponses(formId: string): Promise<FormResponse[]> {
  noStore();
  const { data, error } = await supabaseAdmin
    .from('responses')
    .select('*')
    .eq('formId', formId)
    .order('submittedAt', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getResponseById(id: string): Promise<FormResponse | null> {
  const { data, error } = await supabaseAdmin
    .from('responses')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function submitFormResponse(
  formId: string,
  data: Record<string, unknown>
): Promise<FormResponse> {
  const { data: newResponse, error } = await supabase
    .from('responses')
    .insert({
      id: randomUUID(),
      formId,
      submittedAt: new Date().toISOString(),
      data,
    })
    .select()
    .single();

  if (error) throw error;
  return newResponse;
}

export async function getAnalytics() {
  noStore();
  const { data: forms, error: formsError } = await supabase
    .from('forms')
    .select('*');

  if (formsError) throw formsError;

  const { data: responses, error: responsesError } = await supabaseAdmin
    .from('responses')
    .select('*');

  if (responsesError) throw responsesError;

  const monthlyResponses = calculateMonthlyResponses(responses || []);
  const teamDistribution = calculateTeamDistribution(forms || [], responses || []);
  const teamTable = calculateTeamTable(forms || [], responses || []);

  return { monthlyResponses, teamDistribution, teamTable };
}

function calculateMonthlyResponses(responses: FormResponse[]) {
  const monthMap: Record<string, number> = {};
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  responses.forEach((response) => {
    const date = new Date(response.submittedAt);
    const monthKey = months[date.getMonth()];
    monthMap[monthKey] = (monthMap[monthKey] || 0) + 1;
  });

  return months.map((month) => ({ month, count: monthMap[month] || 0 }));
}

function calculateTeamDistribution(forms: VSMForm[], responses: FormResponse[]) {
  const teamMap: Record<string, number> = {};
  responses.forEach((response) => {
    const form = forms.find((f) => f.id === response.formId);
    if (form) {
      teamMap[form.team] = (teamMap[form.team] || 0) + 1;
    }
  });
  return Object.entries(teamMap).map(([team, count]) => ({ team: team as Team, count }));
}

function calculateTeamTable(forms: VSMForm[], responses: FormResponse[]) {
  const teams: Team[] = ['Yuva Chetana', 'Gram Vikas', 'Nalanda', 'MUSE', 'SDA', 'ECC', 'Others'];

  return teams.map((team) => {
    const teamForms = forms.filter((f) => f.team === team);
    const teamResponses = responses.filter((r) =>
      teamForms.some((f) => f.id === r.formId)
    );

    const lastActivity = teamForms.length > 0
      ? new Date(Math.max(...teamForms.map((f) => new Date(f.createdAt).getTime())))
          .toISOString()
          .split('T')[0]
      : new Date().toISOString().split('T')[0];

    return { team, forms: teamForms.length, responses: teamResponses.length, lastActivity };
  });
}

// Upload a file to a Supabase Storage bucket; returns the public URL
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    cacheControl: '3600',
  });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
