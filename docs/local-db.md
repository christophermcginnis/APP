# Local PostgreSQL with Docker

CircleCast ships with a `docker-compose.yml` that spins up a Postgres 15 instance for development.

## Start the database

```bash
docker compose up -d db
```

This creates:

- Database: `circlecast`
- User: `postgres`
- Password: `postgres`
- Port: `5432`

The data persists between restarts via the `circlecast_pgdata` Docker volume.

## Stop / restart

```bash
docker compose stop db        # stop
docker compose start db       # restart
docker compose down db        # stop and remove container (keeps volume)
```

To reset everything (including data), run:

```bash
docker compose down -v db
```

## Environment variable

Point the API at the container by setting in `apps/api/.env`:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/circlecast?schema=public
```

## Applying schema & seeds

After the container is running:

```bash
pnpm --filter @circlecast/api prisma:generate
pnpm --filter @circlecast/api prisma:migrate --name init
pnpm --filter @circlecast/api prisma:seed   # optional sample data
```

## Troubleshooting

- Already running something on port 5432? Change the port exposure in `docker-compose.yml`.
- Need to inspect the DB? Use `psql`:
  ```bash
  docker exec -it circlecast-postgres psql -U postgres -d circlecast
  ```
- Health check failures often mean Postgres is still booting; rerun your command after a few seconds.

