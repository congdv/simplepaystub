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

## Styling & Theme

The app uses a CSS-variable theme defined in `src/app/globals.css` (`--primary`, `--primary-foreground`, etc.). Use the theme tokens, not hardcoded Tailwind colors.

- Brand / CTA surfaces: `bg-primary`, `text-primary`, `text-primary-foreground`, `border-primary`, `shadow-primary/*`.
- Do NOT hardcode `blue-500`, `blue-600`, `blue-50`, etc. for anything that represents the brand. If you see them in existing code, prefer replacing with `primary` tokens when touching that code.
- Neutral UI (borders, muted text, page backgrounds) can keep `slate-*` classes — they're the neutral palette, not the brand.
- For softer variants of primary (tinted backgrounds, subtle shadows), use opacity: `bg-primary/10`, `shadow-primary/20`, `text-primary-foreground/70`.
