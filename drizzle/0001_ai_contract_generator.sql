-- Drizzle ORM migration for AI Contract Generator: contracts, contract_signers, templates, contract_audit_log

CREATE TABLE IF NOT EXISTS templates (
  id text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  team_id text NULL REFERENCES teams(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS contracts (
  id text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  team_id text NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_by text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  template_id text NULL REFERENCES templates(id) ON DELETE SET NULL,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS contract_signers (
  id text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  contract_id text NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  signer_role text NOT NULL,
  signed_at timestamptz NULL,
  invited_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS contract_audit_log (
  id text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  contract_id text NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  user_id text NULL REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  details json NOT NULL DEFAULT '{}',
  timestamp timestamptz DEFAULT now() NOT NULL
);

-- Indexes for common access patterns
CREATE INDEX IF NOT EXISTS contracts_team_id_idx ON contracts(team_id);
CREATE INDEX IF NOT EXISTS contract_signers_contract_id_idx ON contract_signers(contract_id);
CREATE INDEX IF NOT EXISTS contract_audit_log_contract_id_idx ON contract_audit_log(contract_id);