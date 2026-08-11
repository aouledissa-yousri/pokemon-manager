CREATE TABLE `spaces` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trainer_id` integer NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`met_location` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`trainer_id`) REFERENCES `trainers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_spaces_trainer_id` ON `spaces` (`trainer_id`);--> statement-breakpoint
ALTER TABLE `pokemon` ADD `space_id` integer REFERENCES spaces(id);--> statement-breakpoint
ALTER TABLE `pokemon` ADD `held_item` text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_pokemon_space_id` ON `pokemon` (`space_id`);--> statement-breakpoint
INSERT INTO `spaces` (`id`, `trainer_id`, `name`, `met_location`, `created_at`, `updated_at`)
	SELECT `id`, `trainer_id`, `species_name`, `met_location`, `created_at`, `updated_at` FROM `pokemon`;--> statement-breakpoint
UPDATE `pokemon` SET `space_id` = `id`;
