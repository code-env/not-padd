DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'articles_slug_unique'
  ) THEN
    ALTER TABLE "articles" DROP CONSTRAINT "articles_slug_unique";
  END IF;
END $$;
