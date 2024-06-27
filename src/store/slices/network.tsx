import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type NetworkStore = {
  isConnected: boolean | null;
  isWifiEnabled: boolean | undefined;
};
const initialState: NetworkStore = {
  isConnected: false,
  isWifiEnabled: undefined,
};

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    NETWORK_CHANGE: (
      state: NetworkStore,
      action: PayloadAction<NetworkStore>,
    ) => {
      state.isConnected = action.payload.isConnected;
      state.isWifiEnabled = action.payload.isWifiEnabled;
    },
  },
});

export const {NETWORK_CHANGE} = networkSlice.actions;

export const getNetworkStore = (state: {
  network: {isConnected: boolean | null; isWifiEnabled: boolean | undefined};
}) => state.network;

export default networkSlice.reducer;
