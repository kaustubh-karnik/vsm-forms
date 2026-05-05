export type Team = "Yuva Chetana" | "Gram Vikas" | "Nalanda" | "MUSE" | "SDA";
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
  | "file";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface VSMForm {
  id: string;
  title: string;
  description: string;
  team: Team;
  status: FormStatus;
  closingDate?: string; // ISO date string
  responseCount: number;
  coverGradient: string; // CSS gradient for placeholder
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
};

export const TEAM_DOTS: Record<Team, string> = {
  "Yuva Chetana": "#D97706",
  "Gram Vikas":   "#2D6A3F",
  "Nalanda":      "#1E4FC2",
  "MUSE":         "#D43E8D",
  "SDA":          "#7C3AED",
};

export const mockForms: VSMForm[] = [
  {
    id: "runmochan-2026",
    title: "Runmochan 2026",
    description:
      "Volunteers will visit tribal communities near Kasara for a two-day outreach trek. Activities include health camps, storytelling for children, and nature walks. Open to all VSM members aged 16 and above.",
    team: "Yuva Chetana",
    status: "active",
    closingDate: "2026-08-20",
    responseCount: 89,
    coverGradient: "linear-gradient(135deg, #E8640A 0%, #C2500A 50%, #7C2D0A 100%)",
    createdAt: "2026-04-01",
    createdBy: "Rahul Sharma",
    fields: [
      { id: "f1", type: "text", label: "Full Name", placeholder: "Your full name", required: true },
      { id: "f2", type: "email", label: "Email Address", placeholder: "you@example.com", required: true },
      { id: "f3", type: "tel", label: "Phone Number", placeholder: "+91 98765 43210", required: true },
      {
        id: "f4",
        type: "select",
        label: "City",
        required: true,
        options: ["Dombivli", "Kalyan", "Thane", "Mumbai", "Navi Mumbai", "Other"],
      },
      {
        id: "f5",
        type: "radio",
        label: "T-Shirt Size",
        required: true,
        options: ["S", "M", "L", "XL", "XXL"],
      },
      {
        id: "f6",
        type: "select",
        label: "Dietary Preference",
        required: false,
        options: ["Vegetarian", "Non-Vegetarian", "Vegan"],
      },
      {
        id: "f7",
        type: "checkbox",
        label: "I have participated in a VSM trek before",
        required: false,
      },
      {
        id: "f8",
        type: "textarea",
        label: "Any medical conditions we should know about?",
        placeholder: "Leave blank if none",
        required: false,
      },
      {
        id: "f9",
        type: "checkbox",
        label: "I agree to the volunteer terms and conditions",
        required: true,
      },
    ],
  },
  {
    id: "sneh-bhojan-2026",
    title: "Sneh Bhojan Volunteer Form",
    description:
      "Help us serve the Diwali feast to 500+ residents of Dombivli's shelter homes and tribal villages. Volunteers needed for cooking, serving, and coordination.",
    team: "Gram Vikas",
    status: "active",
    closingDate: "2026-05-07",
    responseCount: 12,
    coverGradient: "linear-gradient(135deg, #2D6A3F 0%, #1A4A2A 50%, #0F2E18 100%)",
    createdAt: "2026-04-15",
    createdBy: "Priya Kulkarni",
    fields: [
      { id: "f1", type: "text", label: "Full Name", required: true },
      { id: "f2", type: "email", label: "Email Address", required: true },
      { id: "f3", type: "tel", label: "WhatsApp Number", required: true },
      {
        id: "f4",
        type: "radio",
        label: "Preferred Role",
        required: true,
        options: ["Cooking", "Serving food", "Logistics & coordination", "Photography"],
      },
      {
        id: "f5",
        type: "select",
        label: "Available Date",
        required: true,
        options: ["October 20, 2026", "October 21, 2026", "Both days"],
      },
      { id: "f6", type: "checkbox", label: "I can arrange my own transport", required: false },
      {
        id: "f7",
        type: "checkbox",
        label: "I confirm I will show up on the selected date",
        required: true,
      },
    ],
  },
  {
    id: "nalanda-summer-2026",
    title: "Nalanda Summer Camp 2026",
    description:
      "10-day residential summer camp for students of classes 6–10 focusing on academics, arts, and personality development. Held at VSM campus, Dombivli.",
    team: "Nalanda",
    status: "active",
    closingDate: "2026-05-05",
    responseCount: 45,
    coverGradient: "linear-gradient(135deg, #1E4FC2 0%, #1E3A8A 50%, #172554 100%)",
    createdAt: "2026-03-20",
    createdBy: "Anand Joshi",
    fields: [
      { id: "f1", type: "text", label: "Student Name", required: true },
      { id: "f2", type: "text", label: "Parent / Guardian Name", required: true },
      { id: "f3", type: "tel", label: "Contact Number", required: true },
      { id: "f4", type: "email", label: "Email Address", required: false },
      {
        id: "f5",
        type: "select",
        label: "Current Class (Standard)",
        required: true,
        options: ["6th", "7th", "8th", "9th", "10th"],
      },
      { id: "f6", type: "text", label: "School Name", required: true },
      {
        id: "f7",
        type: "radio",
        label: "Medium of Instruction",
        required: true,
        options: ["Marathi", "English", "Semi-English"],
      },
      {
        id: "f8",
        type: "checkbox",
        label: "I confirm the student will attend all 10 days",
        required: true,
      },
    ],
  },
  {
    id: "muse-workshop-2026",
    title: "MUSE Art & Culture Workshop",
    description:
      "A two-day workshop on folk arts, classical music, and cultural heritage for VSM youth members. All skill levels welcome.",
    team: "MUSE",
    status: "draft",
    responseCount: 0,
    coverGradient: "linear-gradient(135deg, #D43E8D 0%, #A8266A 50%, #7C1A4E 100%)",
    createdAt: "2026-04-28",
    createdBy: "Sneha Patil",
    fields: [
      { id: "f1", type: "text", label: "Full Name", required: true },
      { id: "f2", type: "email", label: "Email Address", required: true },
      { id: "f3", type: "tel", label: "Phone Number", required: true },
      {
        id: "f4",
        type: "select",
        label: "Interested In",
        required: true,
        options: ["Folk Arts (Warli, Kolam)", "Classical Music", "Theatre", "All of the above"],
      },
      {
        id: "f5",
        type: "radio",
        label: "Experience Level",
        required: true,
        options: ["Beginner", "Intermediate", "Advanced"],
      },
    ],
  },
  {
    id: "sda-survey-2025",
    title: "SDA Annual Impact Survey 2025",
    description:
      "Feedback survey for all tribal development program participants from 2025. Your inputs shape our next year planning.",
    team: "SDA",
    status: "closed",
    closingDate: "2026-01-31",
    responseCount: 156,
    coverGradient: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 50%, #3B0764 100%)",
    createdAt: "2025-12-01",
    createdBy: "Vikram Desai",
    fields: [
      { id: "f1", type: "text", label: "Your Name", required: false },
      { id: "f2", type: "select", label: "Village / Area", required: true, options: ["Shahapur", "Murbad", "Kasara", "Khopoli", "Other"] },
      {
        id: "f3",
        type: "radio",
        label: "Overall satisfaction with VSM programs",
        required: true,
        options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"],
      },
      { id: "f4", type: "textarea", label: "What did we do well?", required: false },
      { id: "f5", type: "textarea", label: "What can we improve?", required: false },
    ],
  },
];

export const mockResponses = [
  { id: "r1", formId: "runmochan-2026", submittedAt: "2026-04-15T10:23:00Z", data: { "Full Name": "Arjun Mehta", "Email Address": "arjun@gmail.com", "Phone Number": "9876543210", "City": "Dombivli", "T-Shirt Size": "L", "Dietary Preference": "Vegetarian", "I have participated in a VSM trek before": true, "Any medical conditions we should know about?": "", "I agree to the volunteer terms and conditions": true } },
  { id: "r2", formId: "runmochan-2026", submittedAt: "2026-04-16T14:05:00Z", data: { "Full Name": "Sunita Rao", "Email Address": "sunita.rao@yahoo.com", "Phone Number": "9823456780", "City": "Kalyan", "T-Shirt Size": "M", "Dietary Preference": "Non-Vegetarian", "I have participated in a VSM trek before": false, "Any medical conditions we should know about?": "Mild asthma", "I agree to the volunteer terms and conditions": true } },
  { id: "r3", formId: "runmochan-2026", submittedAt: "2026-04-17T09:12:00Z", data: { "Full Name": "Rohan Patil", "Email Address": "rohan.patil@gmail.com", "Phone Number": "9765432109", "City": "Thane", "T-Shirt Size": "XL", "Dietary Preference": "Vegetarian", "I have participated in a VSM trek before": true, "Any medical conditions we should know about?": "", "I agree to the volunteer terms and conditions": true } },
  { id: "r4", formId: "runmochan-2026", submittedAt: "2026-04-18T16:44:00Z", data: { "Full Name": "Priya Sharma", "Email Address": "priya.sharma@outlook.com", "Phone Number": "9654321098", "City": "Mumbai", "T-Shirt Size": "S", "Dietary Preference": "Vegan", "I have participated in a VSM trek before": false, "Any medical conditions we should know about?": "", "I agree to the volunteer terms and conditions": true } },
  { id: "r5", formId: "runmochan-2026", submittedAt: "2026-04-19T11:30:00Z", data: { "Full Name": "Kavya Iyer", "Email Address": "kavya.iyer@gmail.com", "Phone Number": "9543210987", "City": "Navi Mumbai", "T-Shirt Size": "M", "Dietary Preference": "Vegetarian", "I have participated in a VSM trek before": true, "Any medical conditions we should know about?": "Knee injury (recovering)", "I agree to the volunteer terms and conditions": true } },
];

export const mockAdmin = {
  name: "Rahul Sharma",
  team: "Gram Vikas" as Team,
  role: "Team Lead",
  totalForms: 5,
  totalResponses: 302,
  activeForms: 3,
  closedForms: 2,
};

export const mockAnalytics = {
  monthlyResponses: [
    { month: "Nov", count: 28 },
    { month: "Dec", count: 156 },
    { month: "Jan", count: 34 },
    { month: "Feb", count: 18 },
    { month: "Mar", count: 45 },
    { month: "Apr", count: 21 },
  ],
  teamDistribution: [
    { team: "Yuva Chetana" as Team, count: 89 },
    { team: "Gram Vikas" as Team, count: 12 },
    { team: "Nalanda" as Team, count: 45 },
    { team: "MUSE" as Team, count: 0 },
    { team: "SDA" as Team, count: 156 },
  ],
  teamTable: [
    { team: "Yuva Chetana" as Team, forms: 1, responses: 89, lastActivity: "2026-04-19" },
    { team: "Gram Vikas" as Team, forms: 1, responses: 12, lastActivity: "2026-04-22" },
    { team: "Nalanda" as Team, forms: 1, responses: 45, lastActivity: "2026-04-18" },
    { team: "MUSE" as Team, forms: 1, responses: 0, lastActivity: "2026-04-28" },
    { team: "SDA" as Team, forms: 1, responses: 156, lastActivity: "2026-01-31" },
  ],
};
