export type IRecordType = "vod" | "stream";

export type IRecordMode =
  | "queue"
  | "manual"
  | "offLine"
  | "timeZone"
  | "countDown";

export interface IUserStatus {
  isOnline: boolean;
  isRecording: boolean;
  streamStartedAt?: string;
}

export interface IRecordSetting {
  /** enable record stream or vod */
  enableRecord: boolean;
  /** enable online notify */
  enableNotify: boolean;
  /** disable record stream while vod is available */
  vodIsStopRecordStream: boolean;
  /** enable record stream while vod is not available */
  vodGetStreamIfNoVod: boolean;
  /** queue、manual、offLine、timeZone、countDown */
  vodMode: IRecordMode;
  /** setting for record mode - countDown */
  vodCountDownInMinutes: number;
  /** [hour, minute, second] */
  vodTimeZone: [number, number, number];
  /** e.g. {channel}-TwitchVOD-{date}-{duration} */
  vodFileNameTemplate: string;
  /** vod | stream */
  recordType: IRecordType[];
  /** offline check */
  offlineTimesToCheck?: number;
  /** record stream for explicit game names only */
  checkStreamContentTypeEnable: boolean;
  /** e.g. Art;Just Chatting; */
  checkStreamContentTypeTargetGameNames: string;
  /** e.g. {channel}-TwitchLive-{date} */
  fileNameTemplate: string;
}

export interface IGetUsersResponse {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
  offline_image_url: string;
}
