import axios, { type AxiosInstance, type AxiosError } from 'axios'

/**
 * Central axios instance. Every module service imports this so auth headers,
 * base URL and error handling live in one place.
 */
export const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// --- Request: attach auth token -------------------------------------------
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('ums.token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// --- Response: unwrap + normalize errors ----------------------------------
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      'Unexpected network error'

    if (error.response?.status === 401) {
      localStorage.removeItem('ums.token')
      // In a real app: redirect to login here.
    }

    return Promise.reject(new Error(message))
  },
)

/** True when the app should serve built-in mock data instead of hitting the API. */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/** Small helper to simulate network latency for mock services. */
export function mockDelay<T>(data: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}
