-- Update team check constraint to include ECC and Others
ALTER TABLE forms
  DROP CONSTRAINT IF EXISTS forms_team_check;

ALTER TABLE forms
  ADD CONSTRAINT forms_team_check
  CHECK (team IN ('Yuva Chetana', 'Gram Vikas', 'Nalanda', 'MUSE', 'SDA', 'ECC', 'Others'));
