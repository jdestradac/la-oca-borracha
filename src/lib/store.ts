import { Redis } from "@upstash/redis";

const ROOM_TTL_SECONDS = 60 * 60 * 6; // 6 hours

const redisUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

/**
 * Shared key-value store for room state. Uses Upstash Redis (via Vercel's
 * Redis marketplace integration) when configured — required for real
 * multiplayer once deployed, since serverless functions don't share memory
 * across invocations/regions. Falls back to an in-process Map so the online
 * mode is still testable with a plain `npm run dev`, with no external setup.
 * That fallback only works within a single Node process, so it is NOT
 * sufficient once deployed to Vercel with more than one function instance —
 * add a Redis integration in the Vercel dashboard before relying on this in
 * production.
 */
const memoryStore = new Map<string, { value: unknown; expiresAt: number }>();

export const isPersistentStoreConfigured = redis !== null;

export async function storeGet<T>(key: string): Promise<T | null> {
  if (redis) {
    const value = await redis.get<T>(key);
    return value ?? null;
  }
  const entry = memoryStore.get(key);
  if (!entry || entry.expiresAt < Date.now()) {
    memoryStore.delete(key);
    return null;
  }
  return entry.value as T;
}

export async function storeSet<T>(key: string, value: T): Promise<void> {
  if (redis) {
    await redis.set(key, value, { ex: ROOM_TTL_SECONDS });
    return;
  }
  memoryStore.set(key, { value, expiresAt: Date.now() + ROOM_TTL_SECONDS * 1000 });
}

export async function storeDelete(key: string): Promise<void> {
  if (redis) {
    await redis.del(key);
    return;
  }
  memoryStore.delete(key);
}
