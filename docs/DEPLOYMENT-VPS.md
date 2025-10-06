# Deployment Guide (VPS with Docker Compose)

This guide helps you deploy Eltex-Gpon-Designer on a VPS in a fast, standard, and repeatable way.

## Prerequisites

- A VPS with SSH access (Ubuntu/Debian recommended)
- Docker and Docker Compose installed
- Git installed

## 1) Prepare the Server

```bash
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg

# Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Compose plugin (if not present)
docker compose version || echo "Docker Compose plugin will be available after relogin"
```

Log out and back in (or reboot) so your user can run Docker.

## 2) Get the Repo and Configure

```bash
git clone https://github.com/farzadfekrazad/Eltex-Gpon-Designer.git
cd Eltex-Gpon-Designer
```

Create `.env` next to `docker-compose.yml`:

```bash
cp .env.example .env
sed -i 's/change-this-to-a-strong-unique-value/<YOUR_STRONG_SECRET>/' .env
```

Alternatively, set `JWT_SECRET` as an environment variable in your shell.

## 3) Build and Start

```bash
docker compose up -d --build
```

The backend exposes `3001`; the frontend exposes `5173`.

## 4) Verify

- Check backend health:
  ```bash
  curl http://<server-ip>:3001/health
  ```
  Expected: `{ "status": "ok" }`

- Open frontend in browser:
  `http://<server-ip>:5173`

- Login (default admin): `admin@noorao.designer` / `admin123`

## 5) Operations

- View logs: `docker compose logs -f`
- Restart after changes: `docker compose up -d --build`
- Stop: `docker compose down`

## 6) Database and Backups

The SQLite DB is persisted in a named volume: `db_data`.

Backup:
```bash
docker run --rm -v eltex-gpon-designer_db_data:/data alpine tar -czf - -C / data > db_backup.tar.gz
```

Restore:
```bash
cat db_backup.tar.gz | docker run --rm -i -v eltex-gpon-designer_db_data:/data alpine sh -c "tar -xzf - -C /"
```

## 7) Security Notes

- Change `JWT_SECRET` to a strong, unique value.
- Ensure HTTPS in production (via Nginx or a reverse proxy like Caddy/Traefik).
- Keep at least one admin account.

## 8) Troubleshooting

- If frontend shows a blank page, ensure backend health: `curl http://<ip>:3001/health`.
- If login fails, verify credentials and that the user is verified.
- Check container logs: `docker compose logs -f backend frontend`.