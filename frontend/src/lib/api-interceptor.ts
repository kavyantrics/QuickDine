import { refreshToken } from './api'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: Response) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(new Response())
    }
  })
  failedQueue = []
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const accessToken = localStorage.getItem('accessToken')
  
  if (!accessToken) {
    throw new Error('No access token found')
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  }

  try {
    const response = await fetch(url, { ...options, headers })
    
    if (response.status === 401 && !isRefreshing) {
      isRefreshing = true
      
      try {
        const refreshTokenValue = localStorage.getItem('refreshToken')
        if (!refreshTokenValue) throw new Error('No refresh token found')
        
        const refreshResponse = await refreshToken(refreshTokenValue)
        if (refreshResponse.success) {
          localStorage.setItem('accessToken', refreshResponse.data.accessToken)
          
          // Retry the original request with new token
          const newHeaders = {
            ...options.headers,
            Authorization: `Bearer ${refreshResponse.data.accessToken}`,
          }
          
          const retryResponse = await fetch(url, { ...options, headers: newHeaders })
          processQueue()
          return retryResponse
        } else {
          processQueue(new Error('Failed to refresh token'))
          throw new Error('Failed to refresh token')
        }
      } catch (error) {
        processQueue(error instanceof Error ? error : new Error('Unknown error'))
        throw error
      } finally {
        isRefreshing = false
      }
    }
    
    return response
  } catch (error) {
    if (!isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
    }
    throw error
  }
} 