# Backend API (готовые ручки)

Базовый URL:

- `http://localhost:8080`
- Все ручки имеют префикс ` /api`

## Аутентификация и заголовки

- Публичные ручки (без JWT):
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Для остальных ручек требуется:
  - `Authorization: Bearer <JWT>`
- Для части ручек дополнительно нужен:
  - `X-User-ID: <uuid>`

Пример защищенного запроса:

```bash
curl -X GET "http://localhost:8080/api/profile/me" \
  -H "Authorization: Bearer <JWT>" \
  -H "X-User-ID: <USER_ID>"
```

## 1) Auth

### `POST /api/auth/register`

Создать пользователя.

Body:

```json
{
  "email": "user@example.com",
  "password": "12345678",
  "name": "Mikail"
}
```

Ответ: `AuthResponse` (`id`, `email`, `name`, `role`).

### `POST /api/auth/login`

Логин пользователя.

Body:

```json
{
  "email": "user@example.com",
  "password": "12345678"
}
```

Ответ: `LoginResponse` (`id`, `email`, `name`, `role`, `token`).

## 2) Profile

### `GET /api/profile/me`

Получить профиль текущего пользователя.

Headers:

- `Authorization: Bearer <JWT>`
- `X-User-ID: <uuid>`

Ответ: `ProfileResponse`.

### `PUT /api/profile/me`

Обновить профиль.

Headers:

- `Authorization: Bearer <JWT>`
- `X-User-ID: <uuid>`

Body:

```json
{
  "name": "Mikail",
  "role": "backend",
  "skills": ["Java", "Spring", "PostgreSQL"],
  "lookingForTeam": true
}
```

`role` (опционально): `frontend | backend | fullstack | designer | qa | pm`

## 3) Teams

### `POST /api/teams`

Создать команду.

Headers:

- `Authorization: Bearer <JWT>`
- `X-User-ID: <uuid>`

Body:

```json
{
  "name": "HackForge",
  "description": "Команда для хакатона"
}
```

Ответ: `TeamResponse`.

### `GET /api/teams`

Получить список команд.

Headers:

- `Authorization: Bearer <JWT>`

Ответ: `List<TeamResponse>`.

### `GET /api/teams/{id}`

Получить команду по ID.

Headers:

- `Authorization: Bearer <JWT>`

Ответ: `TeamResponse`.

### `POST /api/teams/{id}/invite`

Пригласить пользователя в команду.

Headers:

- `Authorization: Bearer <JWT>`
- `X-User-ID: <uuid>` (кто приглашает)

Body:

```json
{
  "userId": "00000000-0000-0000-0000-000000000000"
}
```

Ответ: `InviteResponse`.

### `POST /api/teams/{id}/leave`

Выйти из команды.

Headers:

- `Authorization: Bearer <JWT>`
- `X-User-ID: <uuid>`

Ответ: `200 OK` (пустое тело).

## 4) Invites

### `POST /api/invites/{id}/approve`

Капитан подтверждает инвайт.

Headers:

- `Authorization: Bearer <JWT>`
- `X-User-ID: <uuid>` (капитан)

Ответ: `200 OK` (пустое тело).

### `POST /api/invites/{id}/reject`

Капитан отклоняет инвайт.

Headers:

- `Authorization: Bearer <JWT>`
- `X-User-ID: <uuid>` (капитан)

Ответ: `200 OK` (пустое тело).

### `POST /api/invites/{id}/accept`

Пользователь принимает инвайт.

Headers:

- `Authorization: Bearer <JWT>`
- `X-User-ID: <uuid>` (пользователь)

Ответ: `200 OK` (пустое тело).

### `POST /api/invites/{id}/decline`

Пользователь отклоняет инвайт.

Headers:

- `Authorization: Bearer <JWT>`
- `X-User-ID: <uuid>` (пользователь)

Ответ: `200 OK` (пустое тело).

## 5) Ideas

### `POST /api/ideas`

Создать идею.

Headers:

- `Authorization: Bearer <JWT>`
- `X-User-ID: <uuid>`

Body:

```json
{
  "title": "AI Team Assistant",
  "description": "Ассистент для формирования команд"
}
```

Ответ: `IdeaResponse`.

### `GET /api/ideas`

Получить идеи (опционально с фильтром по статусу).

Headers:

- `Authorization: Bearer <JWT>`

Query params:

- `status` (опционально): `draft | voting | approved | in_progress`

Ответ: `List<IdeaResponse>`.

### `POST /api/ideas/{id}/vote`

Проголосовать за идею.

Headers:

- `Authorization: Bearer <JWT>`
- `X-User-ID: <uuid>`

Body:

```json
{
  "score": 5
}
```

`score`: от `1` до `5`.

Ответ: `VoteResponse`.

## 6) Participants

### `GET /api/participants`

Получить участников (с фильтрами).

Headers:

- `Authorization: Bearer <JWT>`

Query params:

- `role` (опционально): `frontend | backend | fullstack | designer | qa | pm`
- `skill` (опционально): строка, например `Java`

Ответ: `List<ParticipantResponse>`.

## Быстрые примеры cURL

Регистрация:

```bash
curl -X POST "http://localhost:8080/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "12345678",
    "name": "Mikail"
  }'
```

Логин:

```bash
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "12345678"
  }'
```

