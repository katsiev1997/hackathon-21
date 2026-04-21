#!/usr/bin/env bash
# Загрузка моков через HTTP API бэкенда (без прямого SQL).
#
# Использование:
#   ./scripts/seed-mock-data-api.sh
#   ./scripts/seed-mock-data-api.sh --docker
#
# Переменные окружения:
#   API_BASE_URL   Базовый URL API (по умолчанию: http://localhost:8080/api)
#   MOCK_PASSWORD  Пароль мок-пользователей (по умолчанию: password)
#   SKIP_DB_CLEANUP=1  Пропустить очистку БД перед сидингом
#
# Требования: curl, jq, psql (или docker compose для --docker)

set -euo pipefail

API_BASE_URL="${API_BASE_URL:-http://localhost:8080/api}"
AUTH_BASE_URL="${API_BASE_URL}/auth"
PROFILE_URL="${API_BASE_URL}/profile/me"
MOCK_PASSWORD="${MOCK_PASSWORD:-password}"
USE_DOCKER=0
SKIP_DB_CLEANUP="${SKIP_DB_CLEANUP:-0}"

if [[ "${1:-}" == "--docker" ]] || [[ "${USE_DOCKER:-}" == "1" ]]; then
  USE_DOCKER=1
fi

require_bin() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Требуется '$1', но команда не найдена." >&2
    exit 1
  fi
}

require_bin curl
require_bin jq

if [[ "$SKIP_DB_CLEANUP" != "1" ]] && [[ "$USE_DOCKER" != "1" ]] && ! command -v psql >/dev/null 2>&1; then
  if command -v docker >/dev/null 2>&1; then
    echo "psql не найден, переключаю очистку БД на docker compose."
    USE_DOCKER=1
  else
    echo "Требуется 'psql' или 'docker' для очистки БД, но ни одна команда не найдена." >&2
    exit 1
  fi
fi

if [[ "$SKIP_DB_CLEANUP" != "1" ]]; then
  if [[ "$USE_DOCKER" == "1" ]]; then
    require_bin docker
  else
    require_bin psql
  fi
fi

cleanup_database() {
  local sql="
TRUNCATE TABLE
  votes,
  tasks,
  invites,
  ideas,
  teams,
  users
RESTART IDENTITY CASCADE;
"

  if [[ "$USE_DOCKER" == "1" ]]; then
    echo "Очищаю БД через docker compose..."
    docker compose exec -T postgres \
      psql -U hackforge -d hackforge -v ON_ERROR_STOP=1 -c "$sql" >/dev/null
  else
    export PGHOST="${PGHOST:-localhost}"
    export PGPORT="${PGPORT:-5432}"
    export PGUSER="${PGUSER:-hackforge}"
    export PGPASSWORD="${PGPASSWORD:-hackforge}"
    export PGDATABASE="${PGDATABASE:-hackforge}"
    echo "Очищаю БД через psql: $PGUSER@$PGHOST:$PGPORT/$PGDATABASE"
    psql -v ON_ERROR_STOP=1 -c "$sql" >/dev/null
  fi
}

http_json() {
  local method="$1"
  local url="$2"
  local token="${3:-}"
  local user_id="${4:-}"
  local body="${5:-}"
  local headers=("-H" "Content-Type: application/json")

  if [[ -n "$token" ]]; then
    headers+=("-H" "Authorization: Bearer ${token}")
  fi
  if [[ -n "$user_id" ]]; then
    headers+=("-H" "X-User-ID: ${user_id}")
  fi

  if [[ -n "$body" ]]; then
    curl --silent --show-error --fail -X "$method" "${headers[@]}" -d "$body" "$url"
  else
    curl --silent --show-error --fail -X "$method" "${headers[@]}" "$url"
  fi
}

register_or_login() {
  local email="$1"
  local name="$2"
  local login_body register_body login_response register_response
  local login_status register_status login_tmp register_tmp

  login_body="$(jq -cn --arg email "$email" --arg password "$MOCK_PASSWORD" \
    '{email:$email,password:$password}')"
  register_body="$(jq -cn --arg email "$email" --arg password "$MOCK_PASSWORD" --arg name "$name" \
    '{email:$email,password:$password,name:$name}')"

  login_tmp="$(mktemp)"
  login_status="$(curl --silent --show-error -o "$login_tmp" -w "%{http_code}" \
    -X POST -H "Content-Type: application/json" -d "$login_body" "${AUTH_BASE_URL}/login")"
  login_response="$(cat "$login_tmp")"
  rm -f "$login_tmp"

  if [[ "$login_status" == "200" ]]; then
    echo "$login_response"
    return 0
  fi

  register_tmp="$(mktemp)"
  register_status="$(curl --silent --show-error -o "$register_tmp" -w "%{http_code}" \
    -X POST -H "Content-Type: application/json" -d "$register_body" "${AUTH_BASE_URL}/register")"
  register_response="$(cat "$register_tmp")"
  rm -f "$register_tmp"

  if [[ "$register_status" == "200" ]]; then
    login_tmp="$(mktemp)"
    login_status="$(curl --silent --show-error -o "$login_tmp" -w "%{http_code}" \
      -X POST -H "Content-Type: application/json" -d "$login_body" "${AUTH_BASE_URL}/login")"
    login_response="$(cat "$login_tmp")"
    rm -f "$login_tmp"
    if [[ "$login_status" == "200" ]]; then
      echo "$login_response"
      return 0
    fi
  fi

  echo "Не удалось авторизовать пользователя: ${email}" >&2
  echo "login status=${login_status}, register status=${register_status}" >&2
  echo "Причина: пользователь уже существует с другим паролем, либо API вернул ошибку валидации." >&2
  echo "Решение: очистите пользователя в БД по email или используйте правильный MOCK_PASSWORD." >&2
  echo "Ответ login: ${login_response}" >&2
  echo "Ответ register: ${register_response}" >&2
  exit 1
}

update_profile() {
  local token="$1"
  local name="$2"
  local role="$3"
  local looking_for_team="$4"
  shift 4
  local skills=("$@")

  local skills_json
  skills_json="$(printf '%s\n' "${skills[@]}" | jq -R . | jq -s .)"

  local body
  body="$(jq -cn \
    --arg name "$name" \
    --arg role "$role" \
    --argjson lookingForTeam "$looking_for_team" \
    --argjson skills "$skills_json" \
    '{name:$name,role:$role,skills:$skills,lookingForTeam:$lookingForTeam}')"

  http_json PUT "$PROFILE_URL" "$token" "" "$body" >/dev/null
}

extract_token() {
  jq -r '.token'
}

extract_id() {
  jq -r '.id'
}

echo "API: ${API_BASE_URL}"
if [[ "$SKIP_DB_CLEANUP" != "1" ]]; then
  cleanup_database
else
  echo "Очистка БД пропущена (SKIP_DB_CLEANUP=1)."
fi
echo "Создаю/логиню пользователей..."

alice_login="$(register_or_login "alice.captain@hackforge.local" "Алиса Капитан")"
bob_login="$(register_or_login "bob@hackforge.local" "Боб")"
carol_login="$(register_or_login "carol@hackforge.local" "Кэрол")"
dave_login="$(register_or_login "dave@hackforge.local" "Дэйв")"
eve_login="$(register_or_login "eve@hackforge.local" "Ив")"
organizer_login="$(register_or_login "organizer@hackforge.local" "Организатор")"
frank_login="$(register_or_login "frank@hackforge.local" "Фрэнк")"
grace_login="$(register_or_login "grace@hackforge.local" "Грейс")"
henry_login="$(register_or_login "henry@hackforge.local" "Генри")"
irina_login="$(register_or_login "irina@hackforge.local" "Ирина")"
julia_login="$(register_or_login "julia@hackforge.local" "Юлия")"
max_login="$(register_or_login "max@hackforge.local" "Макс")"

alice_token="$(echo "$alice_login" | extract_token)"
bob_token="$(echo "$bob_login" | extract_token)"
carol_token="$(echo "$carol_login" | extract_token)"
dave_token="$(echo "$dave_login" | extract_token)"
eve_token="$(echo "$eve_login" | extract_token)"
organizer_token="$(echo "$organizer_login" | extract_token)"
frank_token="$(echo "$frank_login" | extract_token)"
grace_token="$(echo "$grace_login" | extract_token)"
henry_token="$(echo "$henry_login" | extract_token)"
irina_token="$(echo "$irina_login" | extract_token)"
julia_token="$(echo "$julia_login" | extract_token)"
max_token="$(echo "$max_login" | extract_token)"

alice_id="$(echo "$alice_login" | extract_id)"
bob_id="$(echo "$bob_login" | extract_id)"
carol_id="$(echo "$carol_login" | extract_id)"
dave_id="$(echo "$dave_login" | extract_id)"
eve_id="$(echo "$eve_login" | extract_id)"
organizer_id="$(echo "$organizer_login" | extract_id)"
frank_id="$(echo "$frank_login" | extract_id)"
grace_id="$(echo "$grace_login" | extract_id)"
henry_id="$(echo "$henry_login" | extract_id)"
irina_id="$(echo "$irina_login" | extract_id)"
julia_id="$(echo "$julia_login" | extract_id)"
max_id="$(echo "$max_login" | extract_id)"

echo "Обновляю профили..."
update_profile "$alice_token" "Алиса Капитан" "fullstack" false "React" "TypeScript" "Node"
update_profile "$bob_token" "Боб" "backend" false "Java" "PostgreSQL"
update_profile "$carol_token" "Кэрол" "designer" false "Figma" "UI"
update_profile "$dave_token" "Дэйв" "frontend" false "Vue" "CSS"
update_profile "$eve_token" "Ив" "qa" false "Playwright" "Jest"
update_profile "$organizer_token" "Организатор" "pm" false "Scrum"
update_profile "$frank_token" "Фрэнк" "backend" false "Go" "gRPC"
update_profile "$grace_token" "Грейс" "designer" false "UX" "Figma"
update_profile "$henry_token" "Генри" "fullstack" true "Next.js" "Prisma"
update_profile "$irina_token" "Ирина" "pm" true "Roadmap" "Analytics"
update_profile "$julia_token" "Юлия" "frontend" true "React" "Tailwind"
update_profile "$max_token" "Макс" "backend" true "Python" "FastAPI"

echo "Создаю команду (или использую существующую)..."
team_id=""
if team_resp="$(http_json POST "${API_BASE_URL}/teams" "$alice_token" "$alice_id" \
  "$(jq -cn '{name:"Команда Альфа",description:"Моковая команда для демо: канбан, приглашения, рекомендации."}')" 2>/dev/null)"; then
  team_id="$(echo "$team_resp" | jq -r '.id')"
else
  team_id="$(http_json GET "${API_BASE_URL}/teams" "$alice_token" "" "" | jq -r '.[] | select(.captainId=="'"$alice_id"'") | .id' | head -n1)"
fi

if [[ -z "$team_id" ]]; then
  echo "Не удалось определить team_id." >&2
  exit 1
fi

echo "Добавляю Боба и Кэрол в команду..."
bob_invite_id="$(http_json POST "${API_BASE_URL}/teams/${team_id}/invite" "$alice_token" "$alice_id" \
  "$(jq -cn --arg uid "$bob_id" '{userId:$uid}')" | jq -r '.inviteId')"
carol_invite_id="$(http_json POST "${API_BASE_URL}/teams/${team_id}/invite" "$alice_token" "$alice_id" \
  "$(jq -cn --arg uid "$carol_id" '{userId:$uid}')" | jq -r '.inviteId')"

http_json POST "${API_BASE_URL}/invites/${bob_invite_id}/accept" "$bob_token" "$bob_id" "" >/dev/null
http_json POST "${API_BASE_URL}/invites/${carol_invite_id}/accept" "$carol_token" "$carol_id" "" >/dev/null

echo "Создаю/перевожу идеи..."
idea_draft_id="$(http_json POST "${API_BASE_URL}/ideas" "$alice_token" "" \
  "$(jq -cn '{title:"Экотренажеры (черновик)",description:"Мок: идея в статусе черновик — отправьте на голосование."}')" | jq -r '.id')"

idea_dave_id="$(http_json POST "${API_BASE_URL}/ideas" "$dave_token" "" \
  "$(jq -cn '{title:"Умный расписатель (голосование)",description:"Мок: идея на голосовании, можно голосовать 1–5."}')" | jq -r '.id')"
http_json POST "${API_BASE_URL}/ideas/${idea_dave_id}/submit-for-voting" "$dave_token" "" "" >/dev/null

idea_alice_voting_id="$(http_json POST "${API_BASE_URL}/ideas" "$alice_token" "" \
  "$(jq -cn '{title:"API для волонтёров (голосование)",description:"Мок: вторая идея на голосовании."}')" | jq -r '.id')"
http_json POST "${API_BASE_URL}/ideas/${idea_alice_voting_id}/submit-for-voting" "$alice_token" "" "" >/dev/null

echo "Добавляю голоса..."
http_json POST "${API_BASE_URL}/ideas/${idea_dave_id}/vote" "$bob_token" "" "$(jq -cn '{score:4}')" >/dev/null
http_json POST "${API_BASE_URL}/ideas/${idea_dave_id}/vote" "$carol_token" "" "$(jq -cn '{score:5}')" >/dev/null
http_json POST "${API_BASE_URL}/ideas/${idea_alice_voting_id}/vote" "$bob_token" "" "$(jq -cn '{score:4}')" >/dev/null
http_json POST "${API_BASE_URL}/ideas/${idea_alice_voting_id}/vote" "$carol_token" "" "$(jq -cn '{score:5}')" >/dev/null

echo "Создаю задачи канбана..."
task_1_id="$(http_json POST "${API_BASE_URL}/teams/${team_id}/tasks" "$alice_token" "$alice_id" \
  "$(jq -cn '{title:"Сверстать лендинг",description:"Мок: ожидает одобрения капитана",deadline:(now + 7*24*3600 | strftime("%Y-%m-%d"))}')" | jq -r '.id')"
http_json PATCH "${API_BASE_URL}/tasks/${task_1_id}" "$alice_token" "$alice_id" \
  "$(jq -cn --arg uid "$bob_id" '{assigneeId:$uid}')" >/dev/null

task_2_id="$(http_json POST "${API_BASE_URL}/teams/${team_id}/tasks" "$alice_token" "$alice_id" \
  "$(jq -cn '{title:"Настроить CI",description:"Мок: в работе",deadline:(now + 14*24*3600 | strftime("%Y-%m-%d"))}')" | jq -r '.id')"
http_json PATCH "${API_BASE_URL}/tasks/${task_2_id}" "$alice_token" "$alice_id" \
  "$(jq -cn '{status:"todo"}')" >/dev/null
http_json PATCH "${API_BASE_URL}/tasks/${task_2_id}" "$carol_token" "$carol_id" \
  "$(jq -cn --arg uid "$carol_id" '{assigneeId:$uid,status:"in_progress"}')" >/dev/null

echo "Создаю приглашение для Дэйва (status=approved)..."
http_json POST "${API_BASE_URL}/teams/${team_id}/invite" "$alice_token" "$alice_id" \
  "$(jq -cn --arg uid "$dave_id" '{userId:$uid}')" >/dev/null

echo "Создаю вторую команду..."
team_2_id=""
if team_2_resp="$(http_json POST "${API_BASE_URL}/teams" "$dave_token" "$dave_id" \
  "$(jq -cn '{name:"Команда Бета",description:"Вторая моковая команда: дополнительные задачи и идеи."}')" 2>/dev/null)"; then
  team_2_id="$(echo "$team_2_resp" | jq -r '.id')"
else
  team_2_id="$(http_json GET "${API_BASE_URL}/teams" "$dave_token" "" "" | jq -r '.[] | select(.captainId=="'"$dave_id"'") | .id' | head -n1)"
fi

if [[ -z "$team_2_id" ]]; then
  echo "Не удалось определить team_2_id." >&2
  exit 1
fi

echo "Добавляю Ив, Фрэнка и Грейс во вторую команду..."
eve_invite_id="$(http_json POST "${API_BASE_URL}/teams/${team_2_id}/invite" "$dave_token" "$dave_id" \
  "$(jq -cn --arg uid "$eve_id" '{userId:$uid}')" | jq -r '.inviteId')"
frank_invite_id="$(http_json POST "${API_BASE_URL}/teams/${team_2_id}/invite" "$dave_token" "$dave_id" \
  "$(jq -cn --arg uid "$frank_id" '{userId:$uid}')" | jq -r '.inviteId')"
grace_invite_id="$(http_json POST "${API_BASE_URL}/teams/${team_2_id}/invite" "$dave_token" "$dave_id" \
  "$(jq -cn --arg uid "$grace_id" '{userId:$uid}')" | jq -r '.inviteId')"

http_json POST "${API_BASE_URL}/invites/${eve_invite_id}/accept" "$eve_token" "$eve_id" "" >/dev/null
http_json POST "${API_BASE_URL}/invites/${frank_invite_id}/accept" "$frank_token" "$frank_id" "" >/dev/null
http_json POST "${API_BASE_URL}/invites/${grace_invite_id}/accept" "$grace_token" "$grace_id" "" >/dev/null

echo "Создаю дополнительные идеи и голоса..."
idea_dave_draft_id="$(http_json POST "${API_BASE_URL}/ideas" "$dave_token" "" \
  "$(jq -cn '{title:"Робо-навигатор (черновик)",description:"Мок: черновик второй команды."}')" | jq -r '.id')"

idea_eve_id="$(http_json POST "${API_BASE_URL}/ideas" "$eve_token" "" \
  "$(jq -cn '{title:"Тест-бот для релизов (голосование)",description:"Мок: идея QA команды на голосовании."}')" | jq -r '.id')"
http_json POST "${API_BASE_URL}/ideas/${idea_eve_id}/submit-for-voting" "$eve_token" "" "" >/dev/null

idea_frank_id="$(http_json POST "${API_BASE_URL}/ideas" "$frank_token" "" \
  "$(jq -cn '{title:"Микросервис метрик (голосование)",description:"Мок: вторая идея команды Бета на голосовании."}')" | jq -r '.id')"
http_json POST "${API_BASE_URL}/ideas/${idea_frank_id}/submit-for-voting" "$frank_token" "" "" >/dev/null

http_json POST "${API_BASE_URL}/ideas/${idea_eve_id}/vote" "$alice_token" "" "$(jq -cn '{score:4}')" >/dev/null
http_json POST "${API_BASE_URL}/ideas/${idea_eve_id}/vote" "$bob_token" "" "$(jq -cn '{score:5}')" >/dev/null
http_json POST "${API_BASE_URL}/ideas/${idea_frank_id}/vote" "$carol_token" "" "$(jq -cn '{score:4}')" >/dev/null
http_json POST "${API_BASE_URL}/ideas/${idea_frank_id}/vote" "$eve_token" "" "$(jq -cn '{score:5}')" >/dev/null

echo "Создаю дополнительные задачи для второй команды..."
task_3_id="$(http_json POST "${API_BASE_URL}/teams/${team_2_id}/tasks" "$dave_token" "$dave_id" \
  "$(jq -cn '{title:"Собрать CI/CD пайплайн",description:"Мок: задача команды Бета",deadline:(now + 10*24*3600 | strftime("%Y-%m-%d"))}')" | jq -r '.id')"
http_json PATCH "${API_BASE_URL}/tasks/${task_3_id}" "$dave_token" "$dave_id" \
  "$(jq -cn --arg uid "$frank_id" '{status:"todo",assigneeId:$uid}')" >/dev/null

task_4_id="$(http_json POST "${API_BASE_URL}/teams/${team_2_id}/tasks" "$dave_token" "$dave_id" \
  "$(jq -cn '{title:"Подготовить UI kit",description:"Мок: задача для дизайнера",deadline:(now + 12*24*3600 | strftime("%Y-%m-%d"))}')" | jq -r '.id')"
http_json PATCH "${API_BASE_URL}/tasks/${task_4_id}" "$dave_token" "$dave_id" \
  "$(jq -cn '{status:"todo"}')" >/dev/null
http_json PATCH "${API_BASE_URL}/tasks/${task_4_id}" "$grace_token" "$grace_id" \
  "$(jq -cn --arg uid "$grace_id" '{assigneeId:$uid,status:"in_progress"}')" >/dev/null

echo "Создаю второе одобренное приглашение (для Генри)..."
http_json POST "${API_BASE_URL}/teams/${team_2_id}/invite" "$dave_token" "$dave_id" \
  "$(jq -cn --arg uid "$henry_id" '{userId:$uid}')" >/dev/null

echo
echo "Готово."
echo "Пользователи: 12 (alice, bob, carol, dave, eve, organizer, frank, grace, henry, irina, julia, max)"
echo "Команды: 2 (Альфа и Бета)"
echo "Идеи: 6 (4 на голосовании, 2 черновика)"
echo "Задачи: 4"
echo "Пароль: ${MOCK_PASSWORD}"
echo "Черновики идей: ${idea_draft_id}, ${idea_dave_draft_id}"
