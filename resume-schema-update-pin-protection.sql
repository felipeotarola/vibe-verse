-- Add protection_mode and pin_code columns to resume_settings table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'resume_settings' AND column_name = 'protection_mode') THEN
        ALTER TABLE resume_settings 
        ADD COLUMN protection_mode VARCHAR(20) NOT NULL DEFAULT 'public';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'resume_settings' AND column_name = 'pin_code') THEN
        ALTER TABLE resume_settings 
        ADD COLUMN pin_code VARCHAR(6) NULL;
    END IF;
END
$$;

-- Update existing records to have the default protection mode
UPDATE resume_settings
SET protection_mode = 'public'
WHERE protection_mode IS NULL;

-- Add comment to explain the columns
COMMENT ON COLUMN resume_settings.protection_mode IS 'Protection mode for the resume: public or pin_protected';
COMMENT ON COLUMN resume_settings.pin_code IS 'PIN code for accessing the resume when protection_mode is pin_protected';
