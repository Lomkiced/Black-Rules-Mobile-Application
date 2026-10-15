/**
 * Upstash Serverless Redis HTTP Client
 * Zero-dependency REST pipeline — 100% Expo Go & Web Safe
 */

import { addBreadcrumb, captureError } from './sentry';

const UPSTASH_URL = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;

// Local in-memory fallback cache when Upstash credentials are not set
const localCache = new Map<string, { value: unknown; expiresAt?: number }>();

export const upstashGet = async <T = unknown>(key: string): Promise<T | null> => {
  if (UPSTASH_URL && UPSTASH_TOKEN && UPSTASH_URL.startsWith('http')) {
    try {
      const res = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
        headers: {
          Authorization: `Bearer ${UPSTASH_TOKEN}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result !== null && data.result !== undefined) {
          try {
            return JSON.parse(data.result) as T;
          } catch {
            return data.result as T;
          }
        }
      }
    } catch (err) {
      captureError(err, 'Upstash.get');
    }
  }

  // Local fallback
  const entry = localCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt && Date.now() > entry.expiresAt) {
    localCache.delete(key);
    return null;
  }
  return entry.value as T;
};

export const upstashSet = async (
  key: string,
  value: unknown,
  exSeconds?: number
): Promise<boolean> => {
  const serialized = typeof value === 'string' ? value : JSON.stringify(value);

  if (UPSTASH_URL && UPSTASH_TOKEN && UPSTASH_URL.startsWith('http')) {
    try {
      const endpoint = exSeconds
        ? `${UPSTASH_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(serialized)}/ex/${exSeconds}`
        : `${UPSTASH_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(serialized)}`;

      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${UPSTASH_TOKEN}`,
        },
      });
      if (res.ok) {
        addBreadcrumb('redis', `Set key ${key}`);
        return true;
      }
    } catch (err) {
      captureError(err, 'Upstash.set');
    }
  }

  // Local fallback
  localCache.set(key, {
    value,
    expiresAt: exSeconds ? Date.now() + exSeconds * 1000 : undefined,
  });
  return true;
};

/**
 * Serverless AI Rate Limit Gatekeeper
 * Limits free users to 10 queries per hour
 */
export const checkAiRateLimit = async (
  userId: string
): Promise<{ allowed: boolean; remaining: number }> => {
  const limitKey = `ratelimit:ai:${userId || 'anonymous'}`;
  const maxQueriesPerHour = 10;
  const hourWindowSeconds = 3600;

  try {
    const current = (await upstashGet<number>(limitKey)) || 0;
    if (current >= maxQueriesPerHour) {
      return { allowed: false, remaining: 0 };
    }

    const nextCount = current + 1;
    await upstashSet(limitKey, nextCount, hourWindowSeconds);
    return {
      allowed: true,
      remaining: Math.max(0, maxQueriesPerHour - nextCount),
    };
  } catch (err) {
    captureError(err, 'Upstash.checkAiRateLimit');
    return { allowed: true, remaining: 5 };
  }
};
