/**
 * @fileoverview Utility functions for cross-platform compatibility.
 */

// Interface for XMLHttpRequest to avoid TypeScript errors in environments without it
interface XMLHttpRequestLike {
  readyState: number
  status: number
  statusText: string
  responseText: string
  open: (method: string, url: string, async: boolean) => void
  setRequestHeader: (name: string, value: string) => void
  send: (body?: string | null) => void
  getAllResponseHeaders: () => string
  onreadystatechange: (() => void) | null
  onerror: (() => void) | null
  ontimeout: (() => void) | null
}

// Type declaration for XMLHttpRequest constructor if it exists
declare const XMLHttpRequest: (new () => XMLHttpRequestLike) | undefined

/**
 * Cross-platform UUID generation function.
 * Uses the most appropriate UUID generation method available in the current environment.
 * @returns A RFC 4122 compliant UUID v4 string
 */
export function generateUUID (): string {
  // Use crypto.randomUUID if available (modern browsers and Node 14.17+)
  if (typeof globalThis !== 'undefined' && globalThis.crypto != null && 'randomUUID' in globalThis.crypto) {
    return globalThis.crypto.randomUUID()
  }

  // Use Node.js crypto module if available
  if (typeof require !== 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const crypto = require('crypto')
      if (typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID()
      }
    } catch {
      // Fall through to manual generation
    }
  }

  // Fallback UUID v4 generation (RFC 4122)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * Response interface for cross-platform HTTP requests.
 * @template T - The expected JSON response type
 */
export interface HttpResponse<T = unknown> {
  ok: boolean
  status: number
  statusText: string
  headers: {
    get: (name: string) => string | null
  }
  json: () => Promise<T>
  text: () => Promise<string>
}

/**
 * Request options interface for cross-platform HTTP requests.
 */
export interface HttpRequestOptions {
  method?: string
  headers?: Record<string, string>
  body?: string
}

/**
 * Creates a Headers object compatible with fetch API.
 * @param headers - Raw headers object
 * @returns Headers-like object with get method
 */
function createHeaders (headers: Record<string, string>): { get: (name: string) => string | null } {
  const lowerCaseHeaders: Record<string, string> = {}

  // Convert to lowercase for case-insensitive lookup
  for (const [key, value] of Object.entries(headers)) {
    lowerCaseHeaders[key.toLowerCase()] = value
  }

  return {
    get (name: string): string | null {
      const value = lowerCaseHeaders[name.toLowerCase()]
      return value != null ? value : null
    }
  }
}

/**
 * XMLHttpRequest-based fetch implementation for maximum compatibility.
 * @param url - The URL to request
 * @param options - Request options
 * @returns Promise resolving to HttpResponse
 */
async function xhrFetch<T = unknown> (url: string, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
  // Check if XMLHttpRequest is available
  if (typeof XMLHttpRequest === 'undefined' || XMLHttpRequest == null) {
    throw new Error('XMLHttpRequest is not available in this environment')
  }

  return await new Promise<HttpResponse<T>>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const method = options.method ?? 'GET'

    xhr.open(method, url, true)

    // Set headers
    if (options.headers != null) {
      for (const [key, value] of Object.entries(options.headers)) {
        xhr.setRequestHeader(key, value)
      }
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        // Parse response headers
        const headerLines = xhr.getAllResponseHeaders().split('\r\n')
        const headers: Record<string, string> = {}

        for (const line of headerLines) {
          if (line.trim() !== '') {
            const [key, ...valueParts] = line.split(':')
            if (key != null && valueParts.length > 0) {
              headers[key.trim()] = valueParts.join(':').trim()
            }
          }
        }

        const response: HttpResponse<T> = {
          ok: xhr.status >= 200 && xhr.status < 300,
          status: xhr.status,
          statusText: xhr.statusText,
          headers: createHeaders(headers),
          json: async (): Promise<T> => {
            try {
              return JSON.parse(xhr.responseText) as T
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : String(error)
              throw new Error(`Failed to parse JSON response: ${errorMessage}`)
            }
          },
          text: async () => xhr.responseText
        }

        resolve(response)
      }
    }

    xhr.onerror = () => {
      reject(new Error(`Network request failed: ${String(xhr.statusText)}`))
    }

    xhr.ontimeout = () => {
      reject(new Error('Network request timed out'))
    }

    // Send request
    xhr.send(options.body ?? null)
  })
}

/**
 * Cross-platform fetch function with multiple fallback strategies.
 * Tries to use the best available HTTP request method in the current environment.
 * @template T - The expected JSON response type
 * @param url - The URL to request
 * @param options - Request options
 * @returns Promise resolving to HttpResponse
 */
export async function universalFetch<T = unknown> (url: string, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
  // Strategy 1: Use global fetch if available (modern browsers and Node 18+)
  if (typeof globalThis !== 'undefined' && globalThis.fetch != null) {
    const fetchOptions: RequestInit = {}

    // Only add method if it exists
    if (options.method != null) {
      fetchOptions.method = options.method
    }

    // Only add headers if they exist
    if (options.headers != null) {
      fetchOptions.headers = options.headers
    }

    // Only add body if it's not undefined
    if (options.body != null) {
      fetchOptions.body = options.body
    }

    const response = await globalThis.fetch(url, fetchOptions)

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: {
        get: (name: string) => response.headers.get(name)
      },
      json: async (): Promise<T> => await response.json() as T,
      text: async () => await response.text()
    }
  }

  // Strategy 2: Try to use undici in Node.js environments
  if (typeof require !== 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { fetch } = require('undici')
      const fetchOptions: Record<string, unknown> = {}

      // Only add method if it exists
      if (options.method != null) {
        fetchOptions.method = options.method
      }

      // Only add headers if they exist
      if (options.headers != null) {
        fetchOptions.headers = options.headers
      }

      // Only add body if it's not undefined
      if (options.body != null) {
        fetchOptions.body = options.body
      }

      const response = await fetch(url, fetchOptions)

      return {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: {
          get: (name: string) => response.headers.get(name)
        },
        json: async (): Promise<T> => await response.json() as T,
        text: async () => response.text()
      }
    } catch {
      // Fall through to XMLHttpRequest
    }
  }

  // Strategy 3: Use XMLHttpRequest for maximum compatibility (browsers, some Node.js environments)
  if (typeof XMLHttpRequest !== 'undefined' && XMLHttpRequest != null) {
    return await xhrFetch<T>(url, options)
  }

  // Strategy 4: Last resort - try Node.js http/https modules
  if (typeof require !== 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const https = require('https')
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const http = require('http')
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { URL } = require('url')

      const parsedUrl = new URL(url)
      const client = parsedUrl.protocol === 'https:' ? https : http

      return await new Promise<HttpResponse<T>>((resolve, reject) => {
        const requestOptions = {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port,
          path: String(parsedUrl.pathname ?? '') + String(parsedUrl.search ?? ''),
          method: options.method ?? 'GET',
          headers: options.headers
        }

        const req = client.request(requestOptions, (res: any) => {
          let data = ''
          res.on('data', (chunk: Buffer | string) => {
            data += String(chunk)
          })

          res.on('end', () => {
            const response: HttpResponse<T> = {
              ok: res.statusCode >= 200 && res.statusCode < 300,
              status: res.statusCode,
              statusText: res.statusMessage ?? '',
              headers: createHeaders(res.headers),
              json: async (): Promise<T> => JSON.parse(data) as T,
              text: async () => data
            }
            resolve(response)
          })
        })

        req.on('error', (error: Error) => {
          reject(error)
        })

        if (options.body != null) {
          req.write(options.body)
        }
        req.end()
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`No HTTP client available. Please use a modern browser or Node.js 14+. Error: ${errorMessage}`)
    }
  }

  throw new Error('No HTTP client available. Please use a modern browser or Node.js 14+.')
}
