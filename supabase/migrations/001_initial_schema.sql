-- Create forms table
CREATE TABLE forms (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  team TEXT NOT NULL CHECK (team IN ('Yuva Chetana', 'Gram Vikas', 'Nalanda', 'MUSE', 'SDA')),
  status TEXT NOT NULL CHECK (status IN ('active', 'draft', 'closed')),
  "closingDate" TEXT,
  "responseCount" INTEGER NOT NULL DEFAULT 0,
  "coverGradient" TEXT NOT NULL,
  fields JSONB NOT NULL,
  "createdAt" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create responses table
CREATE TABLE responses (
  id TEXT PRIMARY KEY,
  "formId" TEXT NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  "submittedAt" TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_responses_formId ON responses("formId");
CREATE INDEX idx_forms_status ON forms(status);
CREATE INDEX idx_forms_team ON forms(team);
CREATE INDEX idx_responses_submittedAt ON responses("submittedAt");

-- Enable RLS (Row Level Security)
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to forms
CREATE POLICY "Forms are publicly readable" ON forms
  FOR SELECT USING (true);

-- Create policy to allow public insert to responses
CREATE POLICY "Responses are publicly insertable" ON responses
  FOR INSERT WITH CHECK (true);

-- Create policy to allow public read access to responses
CREATE POLICY "Responses are publicly readable" ON responses
  FOR SELECT USING (true);
