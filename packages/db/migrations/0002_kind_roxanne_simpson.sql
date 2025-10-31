ALTER TABLE "github_app_integration" DROP CONSTRAINT "github_app_integration_installed_by_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "github_app_integration" DROP COLUMN "github_account_name";--> statement-breakpoint
ALTER TABLE "github_app_integration" DROP COLUMN "github_account_id";--> statement-breakpoint
ALTER TABLE "github_app_integration" DROP COLUMN "github_account_type";--> statement-breakpoint
ALTER TABLE "github_app_integration" DROP COLUMN "access_tokens_url";--> statement-breakpoint
ALTER TABLE "github_app_integration" DROP COLUMN "repositories_url";--> statement-breakpoint
ALTER TABLE "github_app_integration" DROP COLUMN "installed_by_user_id";--> statement-breakpoint
ALTER TABLE "github_app_integration" DROP COLUMN "metadata";