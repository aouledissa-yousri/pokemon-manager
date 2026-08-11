ALTER TABLE `spaces` ADD `sort_order` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `trainers` ADD `sort_order` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
UPDATE `spaces` SET `sort_order` = `id`;--> statement-breakpoint
UPDATE `trainers` SET `sort_order` = `id`;
