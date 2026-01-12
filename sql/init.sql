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
    name TEXT NOT NULL,
    pathway TEXT CHECK (pathway IN (NULL, 'junior', 'senior')),
    project_name TEXT NOT NULL DEFAULT '',
    project_description TEXT NOT NULL DEFAULT '',
    project_demo_url TEXT,
    project_repo_url TEXT,
    project_submitted INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS team_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id INTEGER NOT NULL,
    judge_user_id INTEGER NOT NULL,
    scores TEXT NOT NULL,  -- JSON object of type { [key]: number }
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (judge_user_id) REFERENCES users(id),
    UNIQUE (team_id, judge_user_id)
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('participant', 'judge', 'admin')) DEFAULT 'participant',
    name TEXT,
    team_id INTEGER,
    login_code TEXT,
    login_expiry INTEGER,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_team_id ON users (team_id);

CREATE TABLE IF NOT EXISTS ballots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    projects TEXT NOT NULL,  -- JSON array of integers
    scores TEXT,  -- JSON array of integers (0-5)
    FOREIGN KEY (user_id) REFERENCES users(id)
);
-- users can only have one ballot
CREATE UNIQUE INDEX IF NOT EXISTS idx_ballots_user_id ON ballots (user_id);
