import axios, { AxiosResponse, AxiosError } from "axios"

/** 
 * handle token failure
 * @see https://axios-http.com/docs/handling_errors
 * */
async function apiWrapper<T = any>(
  mainFn: (param?: unknown) => Promise<AxiosResponse<T>>,
  arg: any[] = []
) {
  try {
    const response = await mainFn(...arg)

    return response
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      await window.ipcRenderer.invoke('refreshTokens')

      return await mainFn(...arg)
    }
  }
}

/** number in string type ex: "22569633" */
type StringTypeNumber = string

export interface UserInfo {
  aud: string
  azp: string
  exp: number
  iat: number
  iss: "https://id.twitch.tv/oauth2"
  preferred_username: string
  sub: StringTypeNumber
}

export async function TwitchUserInfo(): Promise<AxiosResponse<UserInfo>> {
  const accessToken = await window.ipcRenderer.invoke('getAccessToken')

  return axios({
    method: 'GET',
    url: 'https://id.twitch.tv/oauth2/userinfo',
    headers: { Authorization: `Bearer ${accessToken}` }
  })
}

export async function getUserInfo() {
  return await apiWrapper(TwitchUserInfo)
}