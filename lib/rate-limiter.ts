/**
 * In-Memory Sliding Window Rate Limiter (US-502)
 * Digunakan untuk membatasi frekuensi percobaan approval / revisi pada public portal SOW.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Bersihkan record lama setiap 10 menit untuk mencegah memory leak
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      const validTimestamps = record.timestamps.filter((ts) => now - ts < 60000);
      if (validTimestamps.length === 0) {
        rateLimitStore.delete(key);
      } else {
        rateLimitStore.set(key, { timestamps: validTimestamps });
      }
    }
  }, 10 * 60 * 1000);
}

export interface RateLimitResult {
  limited: boolean;
  remaining: number;
  resetSeconds: number;
}

/**
 * Memeriksa apakah suatu identitas (IP / Token) telah melampaui batas request.
 * @param key Identifier unik (misal: client IP address atau token)
 * @param maxRequests Batas maksimal permintaan (default: 5)
 * @param windowMs Durasi jendela waktu dalam milidetik (default: 60,000 ms / 1 menit)
 */
export function checkRateLimit(
  key: string,
  maxRequests = 5,
  windowMs = 60000,
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(key) || { timestamps: [] };

  // Filter hanya timestamp dalam jendela waktu aktif
  const validTimestamps = record.timestamps.filter(
    (timestamp) => now - timestamp < windowMs,
  );

  if (validTimestamps.length >= maxRequests) {
    const oldestTimestamp = validTimestamps[0];
    const resetSeconds = Math.ceil((oldestTimestamp + windowMs - now) / 1000);

    return {
      limited: true,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  // Tambahkan timestamp saat ini
  validTimestamps.push(now);
  rateLimitStore.set(key, { timestamps: validTimestamps });

  return {
    limited: false,
    remaining: maxRequests - validTimestamps.length,
    resetSeconds: Math.ceil(windowMs / 1000),
  };
}
