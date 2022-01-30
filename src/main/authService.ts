import os from 'os'
import keytar from 'keytar'
import { session } from 'electron'
import axios, { AxiosRequestConfig } from 'axios'

export default class AuthService {
  public accessToken = ''

  public refreshToken = ''

  private state = ''

  private readonly keytarAccount = os.userInfo().username

  private readonly accessService = 'accessToken'

  private readonly refreshService = 'refreshToken'

  private getState() {
    this.state = Math.random().toString(36).substring(2, 15)

    return this.state
  }

  public authenticationURL() {
    return `${import.meta.env.VITE_BASE_URL}/authorize?` +
      `redirect_uri=${import.meta.env.VITE_REDIRECT_URL}` +
      '&' +
      `client_id=${import.meta.env.VITE_CLIENT_ID}` +
      '&' +
      "scope=user:read:follows" +
      '&' +
      "response_type=code" +
      '&' +
      'force_verify=true' +
      '&' +
      `state=${this.getState()}`
  }

  public async refreshTokens() {
    const refreshToken = await keytar.getPassword(this.refreshService, this.keytarAccount);

    // TODO: ERROR LOG
    if (!refreshToken) throw new Error('No available refresh token.')

    try {
      const refreshOptions: AxiosRequestConfig = {
        method: 'POST',
        url: `${import.meta.env.VITE_BASE_URL}/token`,
        headers: { "content-type": "application/json" },
        data: {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: import.meta.env.VITE_CLIENT_ID,
          client_secret: import.meta.env.VITE_CLIENT_SECRET
        }
      }

      const response = await axios(refreshOptions);

      const { access_token, refresh_token } = response.data

      await Promise.allSettled([
        this.setToken(access_token, 'accessToken'),
        this.setToken(refresh_token, 'refreshToken')
      ])
    } catch (error) {
      await this.logout()

      // TODO: ERROR LOG
      throw error
    }
  }

  public async loadTokens(callbackURL: string) {
    const params = new URL(callbackURL)

    if (this.state !== params.searchParams.get('state')) {
      // TODO: ERROR LOG
      throw new Error(`Invalid state in callbackURL`)
    }

    const exchangeOptions = {
      grant_type: "authorization_code",
      code: params.searchParams.get('code'),
      client_id: import.meta.env.VITE_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_REDIRECT_URL,
      client_secret: import.meta.env.VITE_CLIENT_SECRET
    }

    const options: AxiosRequestConfig = {
      method: "POST",
      data: JSON.stringify(exchangeOptions),
      url: `${import.meta.env.VITE_BASE_URL}/token`,
      headers: { "content-type": "application/json" }
    }

    try {
      const response = await axios(options);

      const { access_token, refresh_token } = response.data

      await Promise.allSettled([
        this.setToken(access_token, 'accessToken'),
        this.setToken(refresh_token, 'refreshToken')
      ])
    } catch (error) {
      await this.logout()

      // TODO: ERROR LOG
      throw error
    }
  }

  private async setToken(token: string, type: 'refreshToken' | 'accessToken') {
    if (!token) return

    await keytar.setPassword(type, this.keytarAccount, token);

    switch (type) {
      case 'refreshToken':
        this.refreshToken = token
        break;

      case 'accessToken':
        this.accessToken = token
        break;
    }
  }

  public async logout() {
    // await this.clearCookie()

    await Promise.allSettled([
      keytar.deletePassword(this.accessService, this.keytarAccount),
      keytar.deletePassword(this.refreshService, this.keytarAccount),
    ])

    this.accessToken = ''

    this.refreshToken = ''
  }

  public static async clearCookie() {
    try {
      const cookies = await session.defaultSession.cookies.get({})

      for (let cookie of cookies) {
        let url = ''

        url += cookie.secure ? 'https://' : 'http://'

        url += cookie.domain?.charAt(0) === '.' ? 'www' : ''

        url += cookie.domain || ''

        url += cookie.path || ''

        await session.defaultSession.cookies.remove(url, cookie.name)
      }
    } catch (error) {
      // TODO: ERROR LOG
      console.error(`Clear cookie error: ${error}`)
    }
  }
}