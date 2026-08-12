ALTER TABLE `pokemon` ADD `sort_order` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
UPDATE `pokemon` SET `sort_order` = `id`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_spaces` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trainer_id` integer NOT NULL,
	`parent_space_id` integer,
	`name` text DEFAULT '' NOT NULL,
	`met_location` text DEFAULT '' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`trainer_id`) REFERENCES `trainers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parent_space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_spaces`("id", "trainer_id", "parent_space_id", "name", "met_location", "sort_order", "created_at", "updated_at")
	SELECT "id", "trainer_id", NULL, "name", "met_location", "sort_order", "created_at", "updated_at" FROM `spaces`;--> statement-breakpoint
DROP TABLE `spaces`;--> statement-breakpoint
ALTER TABLE `__new_spaces` RENAME TO `spaces`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_spaces_trainer_id` ON `spaces` (`trainer_id`);--> statement-breakpoint
CREATE INDEX `idx_spaces_parent_space_id` ON `spaces` (`parent_space_id`);
