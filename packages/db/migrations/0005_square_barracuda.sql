ALTER TABLE "article_author" DROP CONSTRAINT "fk_article_author_article_org";
--> statement-breakpoint
ALTER TABLE "article_author" DROP CONSTRAINT "fk_article_author_member_org";
--> statement-breakpoint
ALTER TABLE "article_tag" DROP CONSTRAINT "fk_article_tag_article_org";
--> statement-breakpoint
ALTER TABLE "article_tag" DROP CONSTRAINT "fk_article_tag_tag_org";
--> statement-breakpoint
ALTER TABLE "article_author" ADD CONSTRAINT "fk_article_author_article" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_author" ADD CONSTRAINT "fk_article_author_member" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_author" ADD CONSTRAINT "fk_article_author_org" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_tag" ADD CONSTRAINT "fk_article_tag_article" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_tag" ADD CONSTRAINT "fk_article_tag_tag" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_tag" ADD CONSTRAINT "fk_article_tag_org" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;