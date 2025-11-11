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

CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_name TEXT NOT NULL DEFAULT '',
    project_description TEXT NOT NULL DEFAULT '',
    project_demo_url TEXT,
    project_repo_url TEXT
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    team_id INTEGER NOT NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_team_id ON users (team_id);
