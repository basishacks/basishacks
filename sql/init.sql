CREATE TABLE IF NOT EXISTS hackathon (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'voting', 'finished', 'paused')),
    start_timestamp INTEGER NOT NULL,
    end_timestamp INTEGER NOT NULL,
    voting_start_timestamp INTEGER NOT NULL,
    voting_end_timestamp INTEGER NOT NULL,
    results_open_timestamp INTEGER NOT NULL,
    theme_name TEXT,
    theme_description TEXT
);
z
-- CREATE TABLE IF NOT EXISTS teams (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     name TEXT NOT NULL,
--     project_name TEXT NOT NULL DEFAULT '',
--     project_description TEXT NOT NULL DEFAULT '',
--     project_demo_url TEXT,
--     project_repo_url TEXT,
--     project_submitted INTEGER NOT NULL DEFAULT 0
    
-- );
CREATE TABLE "teams" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"project_name"	TEXT NOT NULL DEFAULT '',
	"project_description"	TEXT NOT NULL DEFAULT '',
	"project_demo_url"	TEXT,
	"project_repo_url"	TEXT,
	"project_submitted"	INTEGER NOT NULL DEFAULT 0,
	"flags"	TEXT NOT NULL DEFAULT 'participant', -- New field: flags seperated in newlines
	PRIMARY KEY("id" AUTOINCREMENT)
);

least significant bit
0 

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    team_id INTEGER,
    login_code TEXT,
    login_expiry INTEGER,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_team_id ON users (team_id);
