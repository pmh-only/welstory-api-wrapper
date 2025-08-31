/**
 * @fileoverview Main client class for interacting with the Welstory Plus API.
 */

import { randomUUID } from 'node:crypto'
import { WelstoryClientLoginOptions, WelstoryClientOptions, WelstoryUserInfo } from './WelstoryClientTypes'
import { Endpoints } from './Endpoints'
import { fetch, RequestInit, Response } from 'undici'
import { decode } from 'jsonwebtoken'
import { WelstoryRestaurant } from './WelstoryRestaurant'

/**
 * Main client class for interacting with the Welstory Plus API.
 * Provides authentication, session management, and restaurant search functionality.
 * @class WelstoryClient
 */
export class WelstoryClient {
  /**
   * Access token for authenticated API requests.
   * @private
   */
  private accessToken: string | undefined

  /**
   * Base URL for the Welstory API.
   * @private
   * @readonly
   */
  private readonly baseUrl: string

  /**
   * Unique device identifier for API requests.
   * @private
   * @readonly
   */
  private readonly deviceId: string

  /**
   * Creates a new WelstoryClient instance.
   * @param options - Configuration options for the client
   */
  constructor (options: WelstoryClientOptions | undefined = {}) {
    this.baseUrl = options.baseUrl ?? 'https://welplus.welstory.com/'
    this.deviceId = options.deviceId ?? randomUUID()
  }

  /**
   * Makes an authenticated HTTP request to the Welstory API.
   * @param endpoint - The API endpoint to call
   * @param options - Optional request configuration
   * @returns Promise resolving to the HTTP response
   */
  public async request (endpoint: string, options?: RequestInit): Promise<Response> {
    const url = new URL(endpoint, this.baseUrl)

    return await fetch(url.toString(), {
      ...options,
      headers: {
        'User-Agent': 'Welplus',
        'X-Device-Id': this.deviceId,
        ...(
          this.accessToken !== undefined
            ? { Authorization: this.accessToken }
            : {}),

        ...options?.headers
      }
    })
  }

  // ---

  /**
   * Authenticates with the Welstory API using username and password.
   * @param options - Login credentials
   * @returns Promise resolving to user information
   * @throws Error if login fails or no access token is received
   */
  public async login (options: WelstoryClientLoginOptions): Promise<WelstoryUserInfo> {
    const response = await this.request(Endpoints.LOGIN, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Autologin': 'N'
      },
      method: 'POST',
      body: new URLSearchParams({
        username: options.username,
        password: options.password,
        'remember-me': 'false'
      }).toString()
    })

    const accessToken = response.headers.get('Authorization')
    if (accessToken === null) {
      throw new Error('Login failed: No access token received')
    }

    this.accessToken = accessToken

    return await response.json() as WelstoryUserInfo
  }

  /**
   * Refreshes the current session and access token.
   * @returns Promise resolving to milliseconds until token expiration
   * @throws Error if session refresh fails
   */
  public async refreshSession (): Promise<number> {
    const response = await this.request(Endpoints.SESSION_REFRESH)
    const responseBody = await response.json()
      .catch(() => undefined) as { data?: string } | undefined

    if (!response.ok || responseBody === undefined) {
      throw new Error(`Failed to refresh session: ${response.statusText}, response: ${JSON.stringify(await response.text())}`)
    }

    if (typeof responseBody?.data !== 'string') {
      throw new Error('No access token received during session refresh: ' + JSON.stringify(responseBody))
    }

    this.accessToken = responseBody.data
    const tokenPayload = decode(this.accessToken) as any

    return tokenPayload.exp * 1000 - Date.now() - 30 * 1000
  }

  // ---

  /**
   * Searches for restaurants by name.
   * @param searchQuery - The restaurant name to search for
   * @returns Promise resolving to an array of matching restaurants
   * @throws Error if search fails or response format is invalid
   */
  public async searchRestaurant (searchQuery: string): Promise<WelstoryRestaurant[]> {
    const response = await this.request(Endpoints.SEARCH_RESTAURANT(searchQuery))
      .then(async (res) => await res.json() as any)
      .catch((err) => err)

    if (response instanceof Error) {
      throw new Error(`Failed to search restaurant: ${response.message}`)
    }

    if (!Array.isArray(response?.data)) {
      throw new Error('Invalid response format: ' + JSON.stringify(response))
    }

    return response.data.map((restaurant: any) => {
      if (typeof restaurant.restaurantCode !== 'string' ||
          typeof restaurant.restaurantName !== 'string' ||
          typeof restaurant.restaurantDesc !== 'string') {
        throw new Error('Invalid restaurant data format: ' + JSON.stringify(restaurant))
      }

      return new WelstoryRestaurant(
        this,
        restaurant.restaurantCode,
        restaurant.restaurantName,
        restaurant.restaurantDesc
      )
    })
  }
}
