import {createSlice} from '@reduxjs/toolkit';

export type PermissionsResult = {
  camera: boolean | null;
  audio: {RECORD_AUDIO: boolean | null; READ_MEDIA_AUDIO: boolean | null};
  storage: {
    WRITE_EXTERNAL_STORAGE: boolean | null;
    READ_EXTERNAL_STORAGE: boolean | null;
    READ_MEDIA_IMAGES: boolean | null;
    READ_MEDIA_VIDEO: boolean | null;
  };
  notification: boolean | null;
  permissionsIsChecked: boolean | null;
};

const initialState: PermissionsResult = {
  storage: {
    WRITE_EXTERNAL_STORAGE: null,
    READ_EXTERNAL_STORAGE: null,
    READ_MEDIA_IMAGES: null,
    READ_MEDIA_VIDEO: null,
  },
  camera: null,
  audio: {RECORD_AUDIO: null, READ_MEDIA_AUDIO: null},
  notification: null,
  permissionsIsChecked: false,
};

export const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    PERMISSIONS_CHANGE: (state, action) => {
      return action.payload;
    },
  },
});

export const {PERMISSIONS_CHANGE} = permissionsSlice.actions;

export const getPermissionsStore = (state: {permissions: PermissionsResult}) =>
  state.permissions;

export default permissionsSlice.reducer;
