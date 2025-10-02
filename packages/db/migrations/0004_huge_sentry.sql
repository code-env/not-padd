ALTER TABLE "articles" ADD CONSTRAINT "articles_id_organization_id_unique" UNIQUE("id","organization_id");--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_id_organization_id_unique" UNIQUE("id","organization_id");--> statement-breakpoint
ALTER TABLE "tag" ADD CONSTRAINT "tag_id_organization_id_unique" UNIQUE("id","organization_id");