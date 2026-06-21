const API_URL = 'https://delcarpio-backend.onrender.com'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
}

export interface AuthResponse {
  access_token?: string
  token_type?: string
  expires_in?: number
  refresh_token?: string
  user?: { id: string; email: string; user_metadata?: Record<string, any> }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('sb_token')
}

function setToken(token: string) {
  localStorage.setItem('sb_token', token)
}

function clearToken() {
  localStorage.removeItem('sb_token')
}

function decodeJWT(token: string): Record<string, any> | null {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

function parseUser(token: string): AuthUser | null {
  const claims = decodeJWT(token)
  if (!claims?.sub) return null
  return {
    id: claims.sub,
    email: claims.email || '',
    name: claims.user_metadata?.name || claims.email?.split('@')[0] || '',
    role: claims.user_metadata?.role || 'customer',
  }
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error al iniciar sesión' }))
    throw new Error(err.error || 'Error al iniciar sesión')
  }
  const data: AuthResponse = await res.json()
  if (data.access_token) {
    setToken(data.access_token)
  }
  const user = data.access_token ? parseUser(data.access_token) : null
  if (!user) throw new Error('Error al iniciar sesión')
  return user
}

export async function register(email: string, password: string, name?: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name: name || email.split('@')[0] }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error al crear cuenta' }))
    throw new Error(err.error || 'Error al crear cuenta')
  }
  const data: AuthResponse = await res.json()
  if (data.access_token) {
    setToken(data.access_token)
  }
}

export function logout() {
  clearToken()
  if (typeof window !== 'undefined') {
    window.location.href = '/'
  }
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

export function currentUser(): AuthUser | null {
  const token = getToken()
  return token ? parseUser(token) : null
}

export function userRole(): string {
  return currentUser()?.role || 'customer'
}

export function isAdmin(): boolean {
  return userRole() === 'admin'
}

export async function fetchWithAuth(path: string, options?: RequestInit): Promise<any> {
  const token = getToken()
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}
