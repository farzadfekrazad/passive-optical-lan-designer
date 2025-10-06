# Maintenance Guide

This document covers routine maintenance tasks, admin management, and database operations.

## Health and Monitoring

- Backend health endpoint: `GET /health` returns `{ "status": "ok" }`.
- Container logs: `docker compose logs -f backend frontend`.

## Admin and Users

- Always keep at least one admin user.
- Creating users: use the Admin Panel or `POST /api/users` (admin-only).
- Changing roles: `PUT /api/users/:id/role` (admin-only).
- Deleting users: `DELETE /api/users/:id` (non-admin only; admins cannot be deleted via API).

## Default Admin Cleanup (One-time)

If you need to remove the default admin, first create another admin. Then perform a one-time cleanup inside the backend container:

```bash
# Example: remove admin@noorao.designer directly in SQLite via Node
CONTAINER=noorao_gpon_designer_backend
cat <<'EOF' | docker exec -i "$CONTAINER" node
const knex = require('knex')({ client: 'sqlite3', connection: { filename: '/usr/src/app/database/noorao_gpon_designer.db' }, useNullAsDefault: true });
(async () => {
  const user = await knex('users').where({ email: 'admin@noorao.designer' }).first();
  if (user) {
    await knex('users').where({ email: 'admin@noorao.designer' }).del();
    console.log('Default admin removed.');
  } else {
    console.log('Default admin not found.');
  }
  process.exit(0);
})();
EOF
```

## Password Resets

Change any user password (admin-only route recommended via UI). If needed, you can update directly in DB:

```bash
CONTAINER=noorao_gpon_designer_backend
cat <<'EOF' | docker exec -i "$CONTAINER" node
const bcrypt = require('bcryptjs');
const knex = require('knex')({ client: 'sqlite3', connection: { filename: '/usr/src/app/database/noorao_gpon_designer.db' }, useNullAsDefault: true });
(async () => {
  const email = 'someone@example.com';
  const hash = await bcrypt.hash('NewStrongPassword123!', 10);
  await knex('users').where({ email }).update({ passwordHash: hash });
  console.log('Password updated for', email);
  process.exit(0);
})();
EOF
```

## Backups

The SQLite DB resides in the named volume `db_data`.

- Backup:
  ```bash
  docker run --rm -v eltex-gpon-designer_db_data:/data alpine tar -czf - -C / data > db_backup.tar.gz
  ```
- Restore:
  ```bash
  cat db_backup.tar.gz | docker run --rm -i -v eltex-gpon-designer_db_data:/data alpine sh -c "tar -xzf - -C /"
  ```

## Updating

- Pull latest code: `git pull`.
- Rebuild and restart: `docker compose up -d --build`.
- Verify health: `curl http://<server-ip>:3001/health`.