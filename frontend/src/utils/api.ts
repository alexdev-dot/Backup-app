export const API_BASE = import.meta.env.VITE_API_BASE || '';

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function getUser(): any {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message || json?.error || 'Request failed');
  }

  return json?.data !== undefined ? json.data : json;
}

export async function apiList<T = any>(path: string, key?: string): Promise<T[]> {
  const data = await apiFetch(path);
  const value = key ? data?.[key] : data;
  return Array.isArray(value) ? value : [];
}

export const formatCurrency = (amount: number | string | null | undefined) =>
  `KSh ${Number(amount || 0).toLocaleString()}`;

export const formatDate = (value: string | null | undefined) => {
  if (!value) return 'Not set';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};
