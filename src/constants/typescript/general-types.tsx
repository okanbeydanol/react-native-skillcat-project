export type USER = {
  id: number | null;
};

export enum AppStatus {
  UpdateAvailable = 1,
  Successful = 2,
  WrongVersion = 3,
}

export interface CoreWSError {
  message: string;
  exception?: string;
  errorcode?: string;
}

export type StoreInfoResponse = {
  androidVersion: string;
  iosVersion: string;
  forceUpdate: boolean;
} & CoreWSError;
