import { Pool } from "pg";

// Reaproveita o pool entre hot-reloads (dev) e invocações (serverless)
const globalForPg = globalThis as unknown as { pgPool?: Pool; schemaReady?: Promise<void> };

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL não definida (veja .env.example)");
  const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);
  return new Pool({
    connectionString,
    max: 5,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  });
}

export const pool = globalForPg.pgPool ?? createPool();
if (process.env.NODE_ENV !== "production") globalForPg.pgPool = pool;

export const COUNTER_ID = "agendar_demonstracao";

/** Cria as tabelas na primeira chamada (idempotente). */
export function ensureSchema(): Promise<void> {
  if (!globalForPg.schemaReady) {
    globalForPg.schemaReady = pool
      .query(
        `CREATE TABLE IF NOT EXISTS cta_counter (
           id    TEXT PRIMARY KEY,
           total BIGINT NOT NULL DEFAULT 0
         );
         CREATE TABLE IF NOT EXISTS cta_clicks (
           id         UUID PRIMARY KEY,           -- idempotency key gerada no navegador
           counter_id TEXT NOT NULL REFERENCES cta_counter(id),
           created_at TIMESTAMPTZ NOT NULL DEFAULT now()
         );
         INSERT INTO cta_counter (id, total) VALUES ('${COUNTER_ID}', 0)
         ON CONFLICT (id) DO NOTHING;`
      )
      .then(() => undefined)
      .catch((err) => {
        globalForPg.schemaReady = undefined; // permite nova tentativa
        throw err;
      });
  }
  return globalForPg.schemaReady;
}

export async function getTotal(): Promise<number> {
  await ensureSchema();
  const { rows } = await pool.query<{ total: string }>(
    "SELECT total FROM cta_counter WHERE id = $1",
    [COUNTER_ID]
  );
  return Number(rows[0]?.total ?? 0);
}

/**
 * Registra um clique de forma atômica e idempotente:
 * o mesmo clickId (reenvio por falha de rede) nunca é contado duas vezes.
 */
export async function registerClick(clickId: string): Promise<{ total: number; duplicate: boolean }> {
  await ensureSchema();
  const { rows } = await pool.query<{ total: string; inserted: string }>(
    `WITH ins AS (
       INSERT INTO cta_clicks (id, counter_id) VALUES ($1, $2)
       ON CONFLICT (id) DO NOTHING
       RETURNING 1
     ),
     upd AS (
       UPDATE cta_counter
          SET total = total + (SELECT count(*) FROM ins)
        WHERE id = $2
       RETURNING total
     )
     SELECT upd.total, (SELECT count(*) FROM ins) AS inserted FROM upd`,
    [clickId, COUNTER_ID]
  );
  return { total: Number(rows[0].total), duplicate: rows[0].inserted === "0" };
}
