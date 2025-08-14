export interface WelstoryClientOptions {
  baseUrl?: string
  deviceId?: string
  automaticTokenRefresh?: boolean
}

export interface WelstoryClientLoginOptions {
  username: string
  password: string
  automaticTokenRefresh?: boolean
}

export interface WelstoryUserInfo {
  gender: 'M' | 'F'
  bizName: string
  id: string
}
