import {createSlice} from '@reduxjs/toolkit';

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

export const dbLoginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    LOGIN_SUCCESS: (state, action) => {
      return action.payload;
    },
    LOGIN_FAILED: (state, action) => {
      return action.payload;
    },
    LOGOUT: (state, action) => {
      action.payload.type = LoginType.LOGIN_FAILED;
      return action.payload;
    },
  },
});

export const {LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT} = dbLoginSlice.actions;

export const getLoginStore = (state: {login: LoginResult}) => state.login;

export default dbLoginSlice.reducer;
