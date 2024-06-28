import {
  ActionCreatorWithPayload,
  createSlice,
  PayloadAction,
  Slice,
  SliceSelectors,
} from '@reduxjs/toolkit';

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

export const deviceInfoSlice: Slice<
  DeviceInfoResult,
  {
    DEVICEINFO_CHANGE: (
      state: DeviceInfoResult,
      action: PayloadAction<DeviceInfoResult>,
    ) => any;
  },
  'deviceInfo',
  'deviceInfo',
  SliceSelectors<DeviceInfoResult>
> = createSlice({
  name: 'deviceInfo',
  initialState,
  reducers: {
    DEVICEINFO_CHANGE: (
      state: DeviceInfoResult,
      action: PayloadAction<DeviceInfoResult>,
    ) => {
      return action.payload;
    },
  },
});

export const {
  DEVICEINFO_CHANGE,
}: {
  DEVICEINFO_CHANGE: ActionCreatorWithPayload<
    DeviceInfoResult,
    'deviceInfo/DEVICEINFO_CHANGE'
  >;
} = deviceInfoSlice.actions;

export const getDeviceInfoStore = (state: {
  deviceInfo: DeviceInfoResult;
}): DeviceInfoResult => state.deviceInfo;

export default deviceInfoSlice.reducer;
