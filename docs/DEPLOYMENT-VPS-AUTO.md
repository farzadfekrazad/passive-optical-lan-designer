# Auto Deploy and Manual Quick Deploy

## Manual One-Liner

Run this on the server to fetch latest and rebuild:

```
cd /opt/passive-optical-lan-designer && git fetch && git reset --hard origin/main && docker compose up -d --build
```

### Quick Checks

- Backend direct: `curl http://localhost:4001/health`
- Through Nginx: `curl http://localhost/api/health`
- Login: `curl -X POST http://localhost/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\"}"`

## GitHub Actions Auto-Deploy

Workflow file: `.github/workflows/deploy.yml`

Set repository secrets:

- `SSH_HOST` (e.g., `143.198.58.251`)
- `SSH_USER` (e.g., `root`)
- `SSH_KEY` (OpenSSH private key)
- `SSH_PORT` (`22` or custom)
- `DEPLOY_DIR` (`/opt/passive-optical-lan-designer`)

### How It Works

- On push to `main`, the workflow SSHes into the server, runs:
  - `git fetch && git reset --hard origin/main`
  - `docker compose up -d --build`
  - Prints service status and backend health.

### Customize Later

- Edit `.github/workflows/deploy.yml` to change branches, commands, or directory.
- Add steps for migrations, cache busting, or notifications as needed.