CREATE TABLE "article_author" (
	"article_id" text NOT NULL,
	"member_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "article_author_article_id_member_id_pk" PRIMARY KEY("article_id","member_id")
);
--> statement-breakpoint
CREATE TABLE "article_tag" (
	"article_id" text NOT NULL,
	"tag_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "article_tag_article_id_tag_id_pk" PRIMARY KEY("article_id","tag_id")
);
--> statement-breakpoint
ALTER TABLE "article_author" ADD CONSTRAINT "fk_article_author_article_org" FOREIGN KEY ("article_id","organization_id") REFERENCES "public"."articles"("id","organization_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_author" ADD CONSTRAINT "fk_article_author_member_org" FOREIGN KEY ("member_id","organization_id") REFERENCES "public"."member"("id","organization_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_tag" ADD CONSTRAINT "fk_article_tag_article_org" FOREIGN KEY ("article_id","organization_id") REFERENCES "public"."articles"("id","organization_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_tag" ADD CONSTRAINT "fk_article_tag_tag_org" FOREIGN KEY ("tag_id","organization_id") REFERENCES "public"."tag"("id","organization_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" DROP COLUMN "author";