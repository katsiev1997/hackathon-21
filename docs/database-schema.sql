-- ============================================================
-- HackForge — Схема базы данных (PostgreSQL)
-- Покрывает все три уровня ТЗ
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- ENUM-типы
-- ────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM (
    'frontend',
    'backend',
    'fullstack',
    'designer',
    'qa',
    'pm'
);

CREATE TYPE idea_status AS ENUM (
    'draft',        -- черновик
    'voting',       -- голосование
    'approved',     -- одобрено
    'in_progress'   -- в работе
);

CREATE TYPE invite_status AS ENUM (
    'pending_captain',   -- ожидает одобрения капитана
    'approved',          -- капитан одобрил, ждёт ответа приглашённого
    'rejected',          -- капитан отклонил
    'accepted',          -- приглашённый принял
    'declined'           -- приглашённый отклонил
);

CREATE TYPE task_status AS ENUM (
    'pending_approval',  -- ожидает одобрения капитана
    'todo',              -- надо сделать
    'in_progress',       -- в работе
    'review',            -- на проверке
    'done'               -- готово
);

CREATE TYPE team_milestone AS ENUM (
    'team_formed',       -- команда собрана (+10)
    'mvp_ready',         -- MVP готов (+20)
    'demo_submitted'     -- демо сдано (+30)
);

-- ────────────────────────────────────────────────────────────
-- Уровень 1: Основные таблицы
-- ────────────────────────────────────────────────────────────

CREATE TABLE teams (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    captain_id      UUID NOT NULL,       -- FK добавляется после создания users
    created_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE users (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email            VARCHAR(255) NOT NULL UNIQUE,
    password_hash    VARCHAR(255) NOT NULL,
    name             VARCHAR(100) NOT NULL,
    role             user_role,
    skills           TEXT[] NOT NULL DEFAULT '{}',
    looking_for_team BOOLEAN NOT NULL DEFAULT true,
    team_id          UUID REFERENCES teams(id) ON DELETE SET NULL,
    joined_team_at   TIMESTAMP,          -- для определения порядка вступления (БП-04)
    is_organizer     BOOLEAN NOT NULL DEFAULT false,
    created_at       TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT chk_skills_limit CHECK (array_length(skills, 1) IS NULL OR array_length(skills, 1) <= 10)
);

ALTER TABLE teams
    ADD CONSTRAINT fk_teams_captain FOREIGN KEY (captain_id) REFERENCES users(id);

CREATE TABLE ideas (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    author_id   UUID NOT NULL REFERENCES users(id),
    status      idea_status NOT NULL DEFAULT 'draft',
    created_at  TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE votes (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id    UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score      INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT uq_vote_per_user_idea UNIQUE (idea_id, user_id),
    CONSTRAINT chk_score_range CHECK (score BETWEEN 1 AND 5)
);

CREATE TABLE invites (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id     UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    inviter_id  UUID NOT NULL REFERENCES users(id),
    invitee_id  UUID NOT NULL REFERENCES users(id),
    status      invite_status NOT NULL DEFAULT 'pending_captain',
    created_at  TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT chk_no_self_invite CHECK (inviter_id != invitee_id)
);

-- ────────────────────────────────────────────────────────────
-- Уровень 2: Канбан-доска
-- ────────────────────────────────────────────────────────────

CREATE TABLE tasks (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id       UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    title         VARCHAR(200) NOT NULL,
    description   TEXT,
    assignee_id   UUID REFERENCES users(id) ON DELETE SET NULL,
    status        task_status NOT NULL DEFAULT 'pending_approval',
    deadline      DATE,
    created_by    UUID NOT NULL REFERENCES users(id),
    position      INT NOT NULL DEFAULT 0,   -- порядок внутри колонки
    created_at    TIMESTAMP NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- Уровень 3: Рейтинг и настройки хакатона
-- ────────────────────────────────────────────────────────────

CREATE TABLE team_scores (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id    UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    milestone  team_milestone NOT NULL,
    points     INT NOT NULL,
    awarded_at TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT uq_team_milestone UNIQUE (team_id, milestone)
);

CREATE TABLE hackathon_settings (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    max_team_size    INT NOT NULL DEFAULT 5,
    available_roles  JSONB NOT NULL DEFAULT '["frontend","backend","fullstack","designer","qa","pm"]',
    available_skills JSONB NOT NULL DEFAULT '[]',
    updated_at       TIMESTAMP NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- Индексы
-- ────────────────────────────────────────────────────────────

-- Быстрый поиск участников «ищу команду» с фильтрацией
CREATE INDEX idx_users_looking ON users (looking_for_team) WHERE looking_for_team = true;
CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_team ON users (team_id);
CREATE INDEX idx_users_skills ON users USING GIN (skills);

-- Идеи по статусу (для фильтрации на голосовании)
CREATE INDEX idx_ideas_status ON ideas (status);
CREATE INDEX idx_ideas_author ON ideas (author_id);

-- Голоса по идее (для подсчёта среднего)
CREATE INDEX idx_votes_idea ON votes (idea_id);

-- Приглашения: быстрый поиск по получателю и по команде
CREATE INDEX idx_invites_invitee ON invites (invitee_id, status);
CREATE INDEX idx_invites_team ON invites (team_id, status);

-- Задачи: по команде и статусу (канбан-колонки)
CREATE INDEX idx_tasks_team_status ON tasks (team_id, status);
CREATE INDEX idx_tasks_assignee ON tasks (assignee_id);

-- Рейтинг: быстрая сортировка по очкам
CREATE INDEX idx_team_scores_team ON team_scores (team_id);
