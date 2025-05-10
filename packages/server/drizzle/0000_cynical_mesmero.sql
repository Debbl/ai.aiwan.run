CREATE TABLE `image_generations_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`prompt` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`originalImageUrl` text NOT NULL,
	`generatedImageUrl` text
);
