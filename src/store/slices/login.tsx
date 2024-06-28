import {
  ActionCreatorWithPayload,
  createSlice,
  PayloadAction,
  Slice,
  SliceSelectors,
} from '@reduxjs/toolkit';
import {saveUserTokenToStorage} from '../api/userApi.tsx';

export type LoginResult = {
  type: LoginType;
  userToken: string | null;
  loading: boolean;
};

export enum LoginType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  RESTORE_TOKEN = 'RESTORE_TOKEN',
}
const initialState: LoginResult = {
  type: LoginType.RESTORE_TOKEN,
  userToken: null,
  loading: true,
};

export const dbLoginSlice: Slice<
  LoginResult,
  {
    LOGIN_STATUS_CHANGED: (
      state: LoginResult,
      action: PayloadAction<LoginResult>,
    ) => LoginResult;
  },
  'login',
  'login',
  SliceSelectors<LoginResult>
> = createSlice({
  name: 'login',
  initialState,
  reducers: {
    LOGIN_STATUS_CHANGED: (
      state: LoginResult,
      action: PayloadAction<LoginResult>,
    ) => {
      saveUserTokenToStorage(action.payload.userToken);
      return action.payload;
    },
  },
});

export const {
  LOGIN_STATUS_CHANGED,
}: {
  LOGIN_STATUS_CHANGED: ActionCreatorWithPayload<
    LoginResult,
    'login/LOGIN_STATUS_CHANGED'
  >;
} = dbLoginSlice.actions;

export const getLoginStore = (state: {login: LoginResult}) => state.login;

export default dbLoginSlice.reducer;
