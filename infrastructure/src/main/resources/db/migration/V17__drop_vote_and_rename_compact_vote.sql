ALTER TABLE vote RENAME TO vote_old;
# DROP TABLE IF EXISTS vote;

ALTER TABLE compact_vote RENAME TO vote;
ALTER TABLE vote CHANGE COLUMN compact_date_time_slot date_time_slot MEDIUMINT UNSIGNED NOT NULL;
