ALTER TABLE "articles" ADD COLUMN "markdown" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "json" jsonb DEFAULT '{}'::jsonb NOT NULL;