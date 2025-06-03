PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_image_generations_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` text NOT NULL,
	`prompt` text NOT NULL,
	`generationText` text DEFAULT '',
	`credits` integer DEFAULT 0,
	`status` text DEFAULT 'pending' NOT NULL,
	`originalImageUrl` text DEFAULT '' NOT NULL,
	`generatedImageUrl` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_image_generations_table`("id", "userId", "prompt", "generationText", "credits", "status", "originalImageUrl", "generatedImageUrl", "created_at", "updated_at") SELECT "id", "userId", "prompt", "generationText", "credits", "status", "originalImageUrl", "generatedImageUrl", "created_at", "updated_at" FROM `image_generations_table`;--> statement-breakpoint
DROP TABLE `image_generations_table`;--> statement-breakpoint
ALTER TABLE `__new_image_generations_table` RENAME TO `image_generations_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;