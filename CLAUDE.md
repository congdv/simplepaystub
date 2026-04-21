# Project Notes for Claude

## Database Migrations

Migrations use **dbmate** (`npm run db:up`). Every migration file must have both markers or dbmate will error:

```sql
-- migrate:up

-- ... CREATE statements here ...

-- migrate:down

-- ... DROP statements here ...
```

- Never run migrations by piping the file directly to `psql` — it executes everything including the `-- migrate:down` block and drops the tables.
- Always use `npm run db:up` to apply migrations.
- Never manually run SQL against the DB before `npm run db:up` — it leaves partial state (e.g. triggers already exist) that causes dbmate to fail. If partial state exists, use `DROP TRIGGER IF EXISTS` / `CREATE OR REPLACE` guards in the up block.
