CREATE TABLE `pokemon` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trainer_id` integer NOT NULL,
	`species_id` integer NOT NULL,
	`species_name` text NOT NULL,
	`level` integer DEFAULT 50 NOT NULL,
	`nature` text DEFAULT 'hardy' NOT NULL,
	`ability` text DEFAULT '' NOT NULL,
	`is_shiny` integer DEFAULT false NOT NULL,
	`met_location` text DEFAULT '' NOT NULL,
	`move_1` text,
	`move_2` text,
	`move_3` text,
	`move_4` text,
	`iv_hp` integer DEFAULT 31 NOT NULL,
	`iv_attack` integer DEFAULT 31 NOT NULL,
	`iv_defense` integer DEFAULT 31 NOT NULL,
	`iv_special_attack` integer DEFAULT 31 NOT NULL,
	`iv_special_defense` integer DEFAULT 31 NOT NULL,
	`iv_speed` integer DEFAULT 31 NOT NULL,
	`ev_hp` integer DEFAULT 0 NOT NULL,
	`ev_attack` integer DEFAULT 0 NOT NULL,
	`ev_defense` integer DEFAULT 0 NOT NULL,
	`ev_special_attack` integer DEFAULT 0 NOT NULL,
	`ev_special_defense` integer DEFAULT 0 NOT NULL,
	`ev_speed` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`trainer_id`) REFERENCES `trainers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_pokemon_trainer_id` ON `pokemon` (`trainer_id`);--> statement-breakpoint
CREATE TABLE `trainers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`image` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
