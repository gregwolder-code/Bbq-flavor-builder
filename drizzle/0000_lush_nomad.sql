CREATE TABLE `account` (
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`provider_account_id` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `provider_account_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `cooking_methods` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`icon` text,
	`description` text,
	`default_temp_f` integer,
	`is_available` integer DEFAULT true,
	`sort_order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cooking_methods_name_unique` ON `cooking_methods` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `cooking_methods_slug_unique` ON `cooking_methods` (`slug`);--> statement-breakpoint
CREATE TABLE `flavor_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`icon` text,
	`description` text,
	`is_available` integer DEFAULT true,
	`sort_order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `flavor_profiles_name_unique` ON `flavor_profiles` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `flavor_profiles_slug_unique` ON `flavor_profiles` (`slug`);--> statement-breakpoint
CREATE TABLE `page_views` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`page` text NOT NULL,
	`referrer` text,
	`user_agent` text,
	`timestamp` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE TABLE `proteins` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`icon` text,
	`description` text,
	`is_available` integer DEFAULT true,
	`created_at` text DEFAULT (datetime('now')),
	`sort_order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `proteins_name_unique` ON `proteins` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `proteins_slug_unique` ON `proteins` (`slug`);--> statement-breakpoint
CREATE TABLE `recipe_ratings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`saved_recipe_id` text NOT NULL,
	`rating` integer NOT NULL,
	`review` text,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`saved_recipe_id`) REFERENCES `saved_recipes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_recipe_unique` ON `recipe_ratings` (`user_id`,`saved_recipe_id`);--> statement-breakpoint
CREATE TABLE `recipe_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`protein_id` text NOT NULL,
	`cooking_method_id` text NOT NULL,
	`flavor_profile_id` text NOT NULL,
	`recipe_type` text NOT NULL,
	`title` text NOT NULL,
	`ingredients` text NOT NULL,
	`instructions` text NOT NULL,
	`prep_time` text,
	`cook_time` text,
	`resting_time` text,
	`apply_timing` text,
	`target_temp_f` integer,
	`wood_pairings` text,
	`sauce_recommendations` text,
	`side_recommendations` text,
	`cooking_tips` text,
	`is_available` integer DEFAULT true,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`protein_id`) REFERENCES `proteins`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`cooking_method_id`) REFERENCES `cooking_methods`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`flavor_profile_id`) REFERENCES `flavor_profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `saved_recipes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`recipe_template_id` text,
	`protein` text NOT NULL,
	`cooking_method` text NOT NULL,
	`flavor_profile` text NOT NULL,
	`recipe_type` text NOT NULL,
	`title` text NOT NULL,
	`ingredients` text NOT NULL,
	`instructions` text NOT NULL,
	`cook_time` text,
	`target_temp_f` integer,
	`wood_pairings` text,
	`sauce_recommendations` text,
	`side_recommendations` text,
	`cooking_tips` text,
	`notes` text,
	`rating` integer,
	`is_favorite` integer DEFAULT false,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recipe_template_id`) REFERENCES `recipe_templates`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`session_token` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`proteins_selected` text,
	`methods_selected` text,
	`flavors_selected` text,
	`recipes_generated` integer DEFAULT 0,
	`recipes_saved` integer DEFAULT 0,
	`started_at` text DEFAULT (datetime('now')),
	`ended_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`email_verified` integer,
	`image` text,
	`password_hash` text,
	`provider` text DEFAULT 'credentials',
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	`is_admin` integer DEFAULT false,
	`premium_tier` text DEFAULT 'free',
	`premium_expires` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification_token` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
