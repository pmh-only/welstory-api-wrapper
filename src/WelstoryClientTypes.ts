/**
 * @fileoverview Type definitions for Welstory client configuration and user data.
 */

/**
 * Configuration options for creating a new WelstoryClient instance.
 * @interface WelstoryClientOptions
 */
export interface WelstoryClientOptions {
  /**
   * Base URL for the Welstory API.
   * @default "https://welplus.welstory.com/"
   */
  baseUrl?: string

  /**
   * Unique device identifier for API requests.
   * @default Generated UUID
   */
  deviceId?: string

  /**
   * Whether to automatically refresh tokens when they expire.
   * @default false
   */
  automaticTokenRefresh?: boolean
}

/**
 * Login credentials and options for authenticating with the Welstory API.
 * @interface WelstoryClientLoginOptions
 */
export interface WelstoryClientLoginOptions {
  /**
   * Username for authentication.
   */
  username: string

  /**
   * Password for authentication.
   */
  password: string

  /**
   * Whether to automatically refresh tokens when they expire.
   * @default false
   */
  automaticTokenRefresh?: boolean
}

/**
 * User information returned after successful authentication.
 * @interface WelstoryUserInfo
 */
export interface WelstoryUserInfo {
  /**
   * User's gender.
   */
  gender: 'M' | 'F'

  /**
   * Business name associated with the user account.
   */
  bizName: string

  /**
   * Unique user identifier.
   */
  id: string
}
