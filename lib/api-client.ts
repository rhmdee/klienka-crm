import { useAppStore } from "@/stores/useAppStore";

/**
 * Mengambil header kustom simulasi peran untuk dikirim bersama request fetch.
 */
export function getRoleHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const role = useAppStore.getState().getActiveRole();
    return {
      "x-user-role": role,
    };
  } catch {
    return {};
  }
}

/**
 * Wrapper fetch otomatis menyertakan header x-user-role.
 */
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers || {});
  const roleHeaders = getRoleHeaders();

  for (const [key, value] of Object.entries(roleHeaders)) {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  }

  return fetch(input, {
    ...init,
    headers,
  });
}
