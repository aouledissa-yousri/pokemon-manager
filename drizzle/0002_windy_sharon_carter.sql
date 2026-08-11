PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_pokemon` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`space_id` integer NOT NULL,
	`species_id` integer NOT NULL,
	`species_name` text NOT NULL,
	`level` integer DEFAULT 50 NOT NULL,
	`nature` text DEFAULT 'hardy' NOT NULL,
	`ability` text DEFAULT '' NOT NULL,
	`held_item` text DEFAULT '' NOT NULL,
	`is_shiny` integer DEFAULT false NOT NULL,
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
	FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_pokemon`("id", "space_id", "species_id", "species_name", "level", "nature", "ability", "held_item", "is_shiny", "move_1", "move_2", "move_3", "move_4", "iv_hp", "iv_attack", "iv_defense", "iv_special_attack", "iv_special_defense", "iv_speed", "ev_hp", "ev_attack", "ev_defense", "ev_special_attack", "ev_special_defense", "ev_speed", "created_at", "updated_at") SELECT "id", "space_id", "species_id", "species_name", "level", "nature", "ability", "held_item", "is_shiny", "move_1", "move_2", "move_3", "move_4", "iv_hp", "iv_attack", "iv_defense", "iv_special_attack", "iv_special_defense", "iv_speed", "ev_hp", "ev_attack", "ev_defense", "ev_special_attack", "ev_special_defense", "ev_speed", "created_at", "updated_at" FROM `pokemon`;--> statement-breakpoint
DROP TABLE `pokemon`;--> statement-breakpoint
ALTER TABLE `__new_pokemon` RENAME TO `pokemon`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_pokemon_space_id` ON `pokemon` (`space_id`);