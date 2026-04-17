# HackForge — Менеджер команд хакатона

Веб-платформа для организации хакатонов: формирование команд, распределение ролей, голосование за идеи и отслеживание прогресса проектов.

## Проблема

Хакатоны сегодня организуются хаотично: команды собираются в чатах, идеи теряются в Google Docs, прогресс не виден никому. В результате — потерянные участники, несбалансированные команды, невозможность оценить реальное состояние дел.

**HackForge** решает эти проблемы, предоставляя единую платформу для всего жизненного цикла хакатона.

## Функциональность

Ниже — целевой scope по уровням. Детальная разбивка «что уже в коде» см. в разделе [Сводка по реализации (бэкенд и фронтенд)](#сводка-по-реализации-бэкенд-и-фронтенд).

### Уровень 1 — MVP (обязательно)

| Модуль | Статус | Описание |
|---|---|---|
| Регистрация и вход | ✅ Реализовано | Email + пароль, bcrypt, JWT; фронт: форма на главной |
| Профиль участника | ✅ Реализовано | Имя, роль, навыки, «ищу команду»; страница `/dashboard/profile` |
| Доска «Ищу тиму» | ✅ Реализовано | Список участников без команды; фильтры по роли и навыку (на бэке — только свободные участники) |
| Управление командами | ✅ Реализовано | Список и карточка команды `/dashboard/teams`, `/dashboard/teams/:id`; «мои приглашения», панель капитана по pending; выход из команды; предупреждение при &lt;2 участников (UX). Минимум 2 человека в команде на бэке не блокируется |
| Голосование за идеи | ✅ Реализовано | Черновик → голосование (автор), топ по `sort=avgScore`, голосование 1–5; организатор (`isOrganizer`): голосование → одобрено → в работе |

### Уровень 2 — Расширенный продукт (желательно)

| Модуль | Статус | Описание |
|---|---|---|
| Подбор по навыкам | ✅ Реализовано | `GET /api/teams/:teamId/recommended-participants` (только член команды); ранжирование по навыкам, которых ещё нет в составе; блок на доске `/dashboard` при команде &lt; 5 человек |
| Канбан-доска | ✅ Реализовано | JPA-сущность `tasks`, `GET/POST /api/teams/:teamId/tasks`, `PATCH/DELETE /api/tasks/:id`; `/dashboard/kanban` — пять колонок, создание задачи, одобрение капитаном (`pending_approval` → `todo`), смена статуса/исполнителя |

### Уровень 3 — Бонус (по возможности)

| Модуль | Статус | Описание |
|---|---|---|
| Рейтинг команд | ⏳ Не сделано | Маршрут `/dashboard/leaderboard` — заглушка; бэкенда нет |
| Админ-панель | 🔧 Частично | Полноценной панели нет; флаг `isOrganizer` в профиле и смена статусов идей через API/UI (см. L1) |

## Сводка по реализации (бэкенд и фронтенд)

Актуально на момент анализа репозитория: основной UI — `react-router-ssr/`, API — Spring Boot в `backend/`.

### Бэкенд (Spring Boot, PostgreSQL, JWT)

| Область | Сделано | Осталось / ограничения |
|---|---|---|
| Аутентификация | `POST /api/auth/register`, `POST /api/auth/login`, выдача JWT | Восстановление пароля нет |
| Профиль | `GET/PUT /api/profile/me` (JWT), поле `isOrganizer` в ответе | Назначение организатора — вручную в БД (`users.is_organizer`) |
| Участники | `GET /api/participants?role=&skill=` — только без команды и с флагом «ищу команду»; фильтры role/skill | Параметр `looking` из контракта не нужен отдельно (отбор зашит в запрос) |
| Команды | `POST/GET /api/teams`, `GET /api/teams/:id`, приглашение, выход; `GET /api/teams/:teamId/recommended-participants`; лимит 5 человек; передача капитана по ранней дате вступления | Минимальный размер команды 2 человека в коде не проверяется; для операций с командами клиент передаёт `X-User-ID` вместе с JWT |
| Задачи (канбан) | `GET/POST /api/teams/:teamId/tasks`, `PATCH/DELETE /api/tasks/:id`; статусы `TaskStatus`; одобрение `pending_approval` → `todo` только капитаном | Нет drag-and-drop на фронте (смена колонки через select); возврат в `pending_approval` запрещён |
| Приглашения | approve/reject (капитан), accept/decline (приглашённый); `GET /api/invites/team/:teamId/pending`; `GET /api/invites/my` | — |
| Идеи и голоса | Создание и список (`GET /api/ideas` с `status`, `sort`: `createdAt` или `avgScore`), голосование, submit-for-voting; организатор: `POST /api/ideas/:id/approve`, `POST /api/ideas/:id/start` | Редактирование/удаление черновиков — нет |

### Фронтенд (React 19, React Router 7, TanStack Query, Tailwind v4, ky)

| Область | Сделано | Осталось / ограничения |
|---|---|---|
| Вход и регистрация | Главная `/` с `AuthForm`, редирект в `/dashboard` при наличии сессии | — |
| Восстановление пароля | Маршруты `auth/forgot-password`, `auth/recovery-password` с формами | Нет интеграции с бэкендом (письма/сброс пароля) |
| Профиль | `/dashboard/profile`: загрузка профиля, форма редактирования, подтягивание команды | — |
| Доска участников | `/dashboard` (index): список, фильтры, приглашения, создание команды, блок «Рекомендации для команды» при наличии команды и &lt; 5 участников | — |
| Идеи | `/dashboard/ideas`: сортировка по дате / топ по среднему, голосование, действия организатора | — |
| Команды | `/dashboard/teams` — список, «мои приглашения», бейдж в сайдбаре; `/dashboard/teams/:id` — состав, капитан (pending), выход | — |
| Канбан | `/dashboard/kanban`: колонки по статусам задач, создание, одобрение капитаном, исполнитель, удаление | — |
| Лидерборд | — | `/dashboard/leaderboard` — заглушка (уровень 3) |

### Инфраструктура

| Что | Статус |
|---|---|
| Docker Compose (`postgres`, `backend`, `react-router-ssr`) | ✅ Есть |
| Прокси Vite `/api` → `localhost:8080` | ✅ В `react-router-ssr/vite.config.ts` |
| Документированная структура `frontend/` в корне | ⚠️ Устарела — актуальный фронт: `react-router-ssr/` (см. ниже) |

## Роли пользователей

| Роль | Описание |
|---|---|
| **Участник** | Базовая роль. Регистрация, профиль, поиск людей, создание команды, идеи, голосование |
| **Капитан** | Создатель команды. Одобряет приглашения, управляет составом, одобряет задачи на канбане |
| **Организатор** | Администратор хакатона. Аналитика, управление статусами идей, настройки платформы |

## Ключевые бизнес-правила

- Участник состоит **максимум в одной команде** одновременно
- Размер команды: **от 2 до 5 человек**
- При уходе капитана роль передаётся участнику с наиболее ранней датой вступления
- Голосование: **1 голос на 1 идею** от участника (повторный — обновление), **нельзя голосовать за свою идею**
- Статусы идей: `черновик` → `голосование` → `одобрено` → `в работе` (переходы однонаправленные, кроме возврата в черновик)
- Канбан: задача создаётся в статусе «на согласовании»; перевод в колонку «к выполнению» — **только капитан**; дальнейшие статусы меняют участники команды; исполнитель — только из состава команды

## Стек технологий

### Фронтенд

- **React 19** — UI
- **React Router 7** (SSR-режим сборки) — маршрутизация
- **Vite** — сборщик
- **TanStack Query** — запросы к API
- **ky** — HTTP-клиент
- **Tailwind CSS v4** — стили
- **Radix UI / shadcn-паттерн** — компоненты
- **Lucide** — иконки
- **TypeScript** — типизация

### Бэкенд

- **Java** + **Spring Boot** (Web, Security, Data JPA, Validation)
- **JWT** — stateless-аутентификация для защищённых эндпоинтов
- **PostgreSQL** — основная БД (см. `docker-compose.yml`)

### База данных

- **PostgreSQL 16** (локально и в Compose)

## Структура проекта

```
hackathon-21/
├── react-router-ssr/    # Фронтенд: React Router 7 + Vite
│   ├── app/             # Маршруты, фичи, сущности, виджеты
│   ├── package.json
│   └── vite.config.ts
├── backend/             # REST API (Spring Boot)
│   └── src/main/java/...
├── docker-compose.yml
└── docs/
```

## Запуск проекта

### Предварительные требования

- Node.js ≥ 18
- npm ≥ 9
- Для бэкенда: JDK и Gradle (или сборка через Docker)

### Фронтенд (разработка)

```bash
cd react-router-ssr
npm install
npm run dev
```

Приложение будет доступно на `http://localhost:5173` (прокси `/api` на `http://localhost:8080`).

### Полный запуск (Docker Compose)

```bash
docker compose up
```

Сервисы: PostgreSQL, бэкенд на порту `8080`, фронт на `3000` (см. `docker-compose.yml`).

## API-контракт (Уровень 1)

Формат: JSON. Аутентификация: **JWT** в заголовке `Authorization: Bearer …` для защищённых маршрутов; для части операций с командами дополнительно используется заголовок **`X-User-ID`** (идентификатор пользователя, дублируется с субъектом токена на стороне клиента).

| Группа | Метод | Endpoint | Описание |
|---|---|---|---|
| Auth | `POST` | `/api/auth/register` | Регистрация |
| Auth | `POST` | `/api/auth/login` | Вход |
| Профиль | `GET` | `/api/profile/me` | Получить профиль |
| Профиль | `PUT` | `/api/profile/me` | Обновить профиль |
| Участники | `GET` | `/api/participants` | Доска «Ищу тиму» (фильтры: `role`, `skill`; только без команды и «ищу команду») |
| Команды | `POST` | `/api/teams` | Создать команду |
| Команды | `GET` | `/api/teams` | Список команд |
| Команды | `GET` | `/api/teams/:id` | Детали команды |
| Команды | `POST` | `/api/teams/:id/invite` | Предложить приглашение |
| Команды | `POST` | `/api/teams/:id/leave` | Покинуть команду |
| Приглашения | `POST` | `/api/invites/:id/approve` | Одобрить (капитан) |
| Приглашения | `POST` | `/api/invites/:id/reject` | Отклонить (капитан) |
| Приглашения | `POST` | `/api/invites/:id/accept` | Принять приглашение |
| Приглашения | `POST` | `/api/invites/:id/decline` | Отклонить приглашение |
| Приглашения | `GET` | `/api/invites/team/:teamId/pending` | Ожидающие решения капитана |
| Приглашения | `GET` | `/api/invites/my` | Мои приглашения (`pending_captain`, `approved`) |
| Идеи | `POST` | `/api/ideas` | Создать идею |
| Идеи | `GET` | `/api/ideas` | Список идей (`status`, `sort`: `createdAt` \| `avgScore`) |
| Идеи | `POST` | `/api/ideas/:id/submit-for-voting` | Отправить черновик на голосование (автор) |
| Идеи | `POST` | `/api/ideas/:id/approve` | Одобрить после голосования (организатор) |
| Идеи | `POST` | `/api/ideas/:id/start` | В работу из «одобрено» (организатор) |
| Голосование | `POST` | `/api/ideas/:id/vote` | Проголосовать (1–5) |

## API — Уровень 2

| Группа | Метод | Endpoint | Описание |
|---|---|---|---|
| Команды | `GET` | `/api/teams/:teamId/recommended-participants` | Рекомендованные кандидаты (член команды `teamId`; при полном составе — пустой список) |
| Задачи | `GET` | `/api/teams/:teamId/tasks` | Список задач команды |
| Задачи | `POST` | `/api/teams/:teamId/tasks` | Создать задачу (тело: `title`, опционально `description`, `deadline`) |
| Задачи | `PATCH` | `/api/tasks/:id` | Частичное обновление: `title`, `description`, `status`, `assigneeId`, `clearAssignee`, `deadline`, `clearDeadline`, `position` |
| Задачи | `DELETE` | `/api/tasks/:id` | Удалить задачу |

## Модель данных

Полная SQL-схема: [`docs/database-schema.sql`](docs/database-schema.sql)

### ER-диаграмма (связи между сущностями)

```
┌─────────────────────────┐         ┌──────────────────────────┐
│         users           │         │          teams           │
├─────────────────────────┤         ├──────────────────────────┤
│ id           UUID PK    │◄──┐     │ id            UUID PK    │
│ email        VARCHAR UQ │   │  ┌─►│ name          VARCHAR    │
│ password_hash VARCHAR   │   │  │  │ description   TEXT       │
│ name         VARCHAR    │   ├──┼──│ captain_id    UUID FK    │
│ role         ENUM       │   │  │  │ created_at    TIMESTAMP  │
│ skills       TEXT[]     │   │  │  └──────────────────────────┘
│ looking_for_team BOOL   │   │  │          ▲           ▲
│ team_id      UUID FK ───┼───┘  │          │           │
│ joined_team_at TIMESTAMP│      │          │           │
│ is_organizer BOOL       │      │          │           │
│ created_at   TIMESTAMP  │      │          │           │
└──────┬──────────────────┘      │          │           │
       │  ▲  ▲  ▲                │          │           │
       │  │  │  │                │          │           │
       │  │  │  │  ┌─────────────────────────────────┐  │
       │  │  │  │  │          invites                 │  │
       │  │  │  │  ├─────────────────────────────────┤  │
       │  │  │  │  │ id          UUID PK              │  │
       │  │  │  ├──│ inviter_id  UUID FK → users      │  │
       │  │  ├─────│ invitee_id  UUID FK → users      │  │
       │  │  │  │  │ team_id     UUID FK → teams ─────┼──┘
       │  │  │     │ status      ENUM                 │
       │  │  │     │ created_at  TIMESTAMP            │
       │  │  │     └─────────────────────────────────┘
       │  │  │
       │  │  │     ┌─────────────────────────────────┐
       │  │  │     │           ideas                  │
       │  │  │     ├─────────────────────────────────┤
       │  │  │     │ id          UUID PK              │
       │  │  │     │ title       VARCHAR              │
       │  │  │     │ description TEXT                  │
       │  │  └─────│ author_id   UUID FK → users      │
       │  │        │ status      ENUM                 │
       │  │        │ created_at  TIMESTAMP            │
       │  │        └──────────────┬──────────────────┘
       │  │                       │
       │  │                       ▼
       │  │        ┌─────────────────────────────────┐
       │  │        │           votes                  │
       │  │        ├─────────────────────────────────┤
       │  │        │ id          UUID PK              │
       │  │        │ idea_id     UUID FK → ideas      │
       │  └────────│ user_id     UUID FK → users      │
       │           │ score       INT (1–5)            │
       │           │ created_at  TIMESTAMP            │
       │           │                                  │
       │           │ UNIQUE(idea_id, user_id)         │
       │           └─────────────────────────────────┘
       │
       │           ┌─────────────────────────────────┐
       │           │        tasks (Уровень 2)        │
       │           ├─────────────────────────────────┤
       │           │ id          UUID PK              │
       │           │ team_id     UUID FK → teams      │
       │           │ title       VARCHAR              │
       │           │ description TEXT                  │
       ├───────────│ assignee_id UUID FK → users      │
       │           │ status      ENUM (5 колонок)     │
       └───────────│ created_by  UUID FK → users      │
                   │ deadline    DATE                  │
                   │ position    INT                   │
                   │ created_at  TIMESTAMP            │
                   └─────────────────────────────────┘

       ┌─────────────────────────────────┐    ┌──────────────────────────────┐
       │    team_scores (Уровень 3)      │    │ hackathon_settings (Ур. 3)   │
       ├─────────────────────────────────┤    ├──────────────────────────────┤
       │ id          UUID PK             │    │ id               UUID PK    │
       │ team_id     UUID FK → teams     │    │ max_team_size    INT        │
       │ milestone   ENUM                │    │ available_roles  JSONB      │
       │ points      INT                 │    │ available_skills JSONB      │
       │ awarded_at  TIMESTAMP           │    │ updated_at       TIMESTAMP  │
       │                                 │    └──────────────────────────────┘
       │ UNIQUE(team_id, milestone)      │
       └─────────────────────────────────┘
```

### Сводка связей

| Связь | Тип | FK-поле | Описание |
|---|---|---|---|
| `users.team_id` → `teams.id` | N:1 | `users.team_id` | Участник состоит в одной команде |
| `teams.captain_id` → `users.id` | 1:1 | `teams.captain_id` | У команды один капитан |
| `ideas.author_id` → `users.id` | N:1 | `ideas.author_id` | Автор идеи |
| `votes.user_id` → `users.id` | N:1 | `votes.user_id` | Кто голосовал |
| `votes.idea_id` → `ideas.id` | N:1 | `votes.idea_id` | За какую идею голос |
| `invites.team_id` → `teams.id` | N:1 | `invites.team_id` | В какую команду приглашение |
| `invites.inviter_id` → `users.id` | N:1 | `invites.inviter_id` | Кто пригласил |
| `invites.invitee_id` → `users.id` | N:1 | `invites.invitee_id` | Кого пригласили |
| `tasks.team_id` → `teams.id` | N:1 | `tasks.team_id` | Задача принадлежит команде |
| `tasks.assignee_id` → `users.id` | N:1 | `tasks.assignee_id` | Исполнитель задачи |
| `tasks.created_by` → `users.id` | N:1 | `tasks.created_by` | Кто создал задачу |
| `team_scores.team_id` → `teams.id` | N:1 | `team_scores.team_id` | Очки команды за этап |

## Команда

| Участник | Роль |
|---|---|
| *Имя* | *Роль в команде* |

## Лицензия

Проект создан в рамках хакатона. Все права принадлежат команде.
