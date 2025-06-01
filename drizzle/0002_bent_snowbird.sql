ALTER TABLE `image_generations_table` ADD `userId` text NOT NULL REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `image_generations_table` ADD `created_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `image_generations_table` ADD `updated_at` integer NOT NULL;