import axios, { AxiosResponse, AxiosError, AxiosRequestConfig, AxiosPromise } from "axios"

/** 
 * handle token failure
 * @see https://axios-http.com/docs/handling_errors
 * */
async function apiWrapper<T = any>(
  mainFn: (param?: any) => Promise<AxiosResponse<T>>,
  arg?: any
) {
  try {
    const response = await mainFn(arg)

    return response
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      await window.ipcRenderer.invoke('refreshTokens')

      return await mainFn(arg)
    }
  }
}

async function getAccessToken() {
  return await window.ipcRenderer.invoke('getAccessToken')
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

/** @see https://dev.twitch.tv/docs/authentication/getting-tokens-oidc#userinfo-endpoint */
async function TwitchUserInfo(): Promise<AxiosResponse<UserInfo>> {
  return axios({
    method: 'GET',
    url: 'https://id.twitch.tv/oauth2/userinfo',
    headers: { Authorization: `Bearer ${await getAccessToken()}` }
  })
}

export async function getUserInfo() {
  return await apiWrapper(TwitchUserInfo)
}

export interface TwitchGetUsersParams {
  id?: string | string[]
  login?: string | string[]
}

export interface GetUsersResponse {
  id: string
  login: string
  display_name: string
  profile_image_url: string
  offline_image_url: string
}

/** @see https://dev.twitch.tv/docs/api/reference#get-users */
async function TwitchGetUsers(
  params: TwitchGetUsersParams
): Promise<AxiosResponse<GetUsersResponse[]>> {
  return axios({
    params,
    method: 'GET',
    url: 'https://api.twitch.tv/helix/users',
    headers: {
      'Client-Id': import.meta.env.VITE_CLIENT_ID,
      Authorization: `Bearer ${await getAccessToken()}`
    }
  })
}

export async function getUsers(params: TwitchGetUsersParams) {
  return await apiWrapper(TwitchGetUsers, params)
}