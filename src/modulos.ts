import type { Config } from "./config";

interface Cache { apagados: Set<string>; hasta: number }
let cache: Cache | null = null;
const TTL_MS = 30_000;

export function limpiarCacheModulos(): void { cache = null; }

/**
 * Módulos apagados en app_modulos. Se lee con el JWT del propio usuario (la
 * política RLS deja leerlo a cualquier usuario activo), así que el API no
 * necesita una llave privada. Si no se puede saber, devuelve null y el
 * llamador deja pasar (mismo criterio que el front: ante la duda, encendido).
 */
export async function modulosApagados(cfg: Config, authorization: string): Promise<Set<string> | null> {
  if (cache && cache.hasta > Date.now()) return cache.apagados;
  try {
    const r = await fetch(`${cfg.supabaseUrl}/rest/v1/app_modulos?select=clave&activo=eq.false`, {
      headers: { apikey: cfg.anonKey, Authorization: authorization },
      signal: AbortSignal.timeout(4000),
    });
    if (!r.ok) return null;
    const filas = (await r.json()) as Array<{ clave: string }>;
    cache = { apagados: new Set(filas.map((f) => f.clave)), hasta: Date.now() + TTL_MS };
    return cache.apagados;
  } catch {
    return null;
  }
}
