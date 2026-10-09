export interface Config {
  supabaseUrl: string;
  anonKey: string;
  origenes: string[];
  limitePorMinuto: number;
}

export function cargarConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const url = (env.SUPABASE_URL ?? "").trim().replace(/\/+$/, "");
  const anonKey = (env.SUPABASE_ANON_KEY ?? "").trim();
  if (!/^https:\/\/[^/\s]+$/.test(url)) throw new Error("SUPABASE_URL falta o no empieza con https://");
  if (!anonKey) throw new Error("SUPABASE_ANON_KEY falta");
  const origenes = (env.ALLOWED_ORIGINS ?? "").split(",").map((o) => o.trim()).filter(Boolean);
  const limite = Number(env.RATE_LIMIT_PER_MINUTE ?? 600);
  return { supabaseUrl: url, anonKey, origenes, limitePorMinuto: Number.isFinite(limite) && limite > 0 ? limite : 600 };
}
