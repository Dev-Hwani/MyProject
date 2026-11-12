# Fullstack Integration Test App

Spring Boot, React, and PostgreSQL CRUD application. Docker Compose runs the production-style stack: Caddy terminates HTTP/HTTPS, Nginx serves the built frontend, Spring Boot provides the API, and PostgreSQL is kept on the private Compose network.

## Requirements

- Ubuntu Server with Docker Engine and the Docker Compose plugin
- For HTTPS: a domain whose DNS A/AAAA record points to the VM

## Deploy on an Ubuntu VM

1. Clone the repository and enter its root directory.
2. Create the private environment file and set a strong database password:

   ```bash
   cp .env.example .env
   nano .env
   chmod 600 .env
   ```

   Set both `POSTGRES_ADMIN_PASSWORD` and `APP_DB_PASSWORD` to different, unique secrets (for example, generate each with `openssl rand -hex 32`). For HTTPS, set `SITE_ADDRESS` to the domain name (for example, `app.example.com`). Keep `SITE_ADDRESS=:80` only for HTTP testing; do not use plain HTTP for a public production service.

3. Allow inbound TCP ports 80 and 443 in the VM firewall and cloud security group. Caddy obtains and renews TLS certificates automatically when `SITE_ADDRESS` is a valid domain and DNS points to this VM.
4. Build and start the services:

   ```bash
   docker compose up -d --build
   docker compose ps
   ```

   Visit `https://<your-domain>` (or `http://<vm-ip>` for HTTP-only testing). Only the Caddy proxy publishes ports; the API and database are not exposed directly to the internet.

## Operations

```bash
# Follow service logs
docker compose logs -f

# Restart after pulling code changes
git pull
docker compose up -d --build

# Stop services without deleting database or TLS data
docker compose down
```

PostgreSQL and Caddy state use named Docker volumes. The backend runs as a non-root user and connects with a separate database role; the admin credentials are not used by the application. JPA validates the schema at startup instead of changing it automatically. Back up the database regularly before upgrades or maintenance:

```bash
docker compose exec -T postgres_db sh -c 'PGPASSWORD="$POSTGRES_PASSWORD" pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' > backup.sql
```

`docker compose down -v` permanently deletes database and Caddy data; use it only when you intend to reset them. If migrating an existing PostgreSQL volume from the earlier Compose setup, set `POSTGRES_DB`, `POSTGRES_ADMIN_USER`, and `POSTGRES_ADMIN_PASSWORD` in `.env` to the values that initialized that volume before running Compose. The earlier repository defaults were `mydatabase`, `myuser`, and `mypassword`; use these only if they were not changed in your existing deployment. PostgreSQL does not update an existing volume's credentials from changed environment variables. Back up the database before changing deployment settings. Future database schema changes should be applied as reviewed SQL migrations before updating the application.

## Local frontend development

Create `.env` as described above, then start the database and backend with `docker compose up -d postgres_db backend`. From `frontend/`, run `npm ci && npm run dev`. Vite proxies `/api` requests to `http://localhost:8080`; deployed traffic uses the same `/api` path through Caddy.
