const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: 'include', // Send HttpOnly cookies automatically
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'API error');
  return data;
}

export const api = {
  auth: {
    signup: (body: { name: string; email: string; password: string }) =>
      apiFetch('/api/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: { email: string; password: string }) =>
      apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    logout: () =>
      apiFetch('/api/auth/logout', { method: 'POST' }),
    getMe: () =>
      apiFetch('/api/auth/me'),
  },
  movies: {
    trending: () => apiFetch('/api/movies/trending'),
    topRated: () => apiFetch('/api/movies/top-rated'),
    byGenre: (genreId: number) => apiFetch(`/api/movies/genre/${genreId}`),
    details: (id: number | string) => apiFetch(`/api/movies/${id}`),
    search: (q: string) => apiFetch(`/api/movies/search?q=${encodeURIComponent(q)}`),
    videos: (id: number | string) => apiFetch(`/api/movies/${id}/videos`),
  },
  watchlist: {
    get: () => apiFetch('/api/watchlist'),
    add: (item: { id: number; title: string; posterPath: string | null }) =>
      apiFetch('/api/watchlist', { method: 'POST', body: JSON.stringify(item) }),
    remove: (movieId: number) =>
      apiFetch(`/api/watchlist/${movieId}`, { method: 'DELETE' }),
  },
};
