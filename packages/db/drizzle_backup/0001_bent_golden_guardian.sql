-- Add last_used column to notpadd_workspace if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'notpadd_workspace' 
        AND column_name = 'last_used'
    ) THEN
        ALTER TABLE "notpadd_workspace" ADD COLUMN "last_used" boolean DEFAULT false NOT NULL;
    END IF;
END $$;
