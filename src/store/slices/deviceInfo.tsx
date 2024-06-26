import {createSlice} from '@reduxjs/toolkit';

export type DeviceInfoResult = {
  uniqueId: string | null;
  bundleId: string | null;
  deviceId: string | null;
  manufacturer: string | null;
  model: string | null;
  brand: string | null;
  fingerprint: string | null;
  version: string | null;
  buildNumber: string | null;
};

const initialState: DeviceInfoResult = {
  uniqueId: null,
  bundleId: null,
  deviceId: null,
  manufacturer: null,
  model: null,
  brand: null,
  fingerprint: null,
  version: null,
  buildNumber: null,
};

export const deviceInfoSlice = createSlice({
  name: 'deviceInfo',
  initialState,
  reducers: {
    DEVICEINFO_CHANGE: (state, action) => {
      return action.payload;
    },
  },
});

export const {DEVICEINFO_CHANGE} = deviceInfoSlice.actions;

export const getDeviceInfoStore = (state: {deviceInfo: DeviceInfoResult}) =>
  state.deviceInfo;

export default deviceInfoSlice.reducer;
