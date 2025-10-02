CREATE TABLE "tag" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"organization_id" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "tag_slug_unique" UNIQUE("slug"),
	CONSTRAINT "tag_organization_id_slug_unique" UNIQUE("organization_id","slug")
);
--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "image_blurhash" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "author" text;--> statement-breakpoint
ALTER TABLE "tag" ADD CONSTRAINT "tag_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;