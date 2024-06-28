import {
  ActionCreatorWithPayload,
  createSlice,
  PayloadAction,
  Slice,
  SliceSelectors,
} from '@reduxjs/toolkit';

export type NetworkStore = {
  isConnected: boolean | null;
  isWifiEnabled: boolean | undefined;
};
const initialState: NetworkStore = {
  isConnected: false,
  isWifiEnabled: undefined,
};

export const networkSlice: Slice<
  NetworkStore,
  {
    NETWORK_CHANGE: (
      state: NetworkStore,
      action: PayloadAction<NetworkStore>,
    ) => void;
  },
  'network',
  'network',
  SliceSelectors<NetworkStore>
> = createSlice({
  name: 'network',
  initialState,
  reducers: {
    NETWORK_CHANGE: (
      state: NetworkStore,
      action: PayloadAction<NetworkStore>,
    ): void => {
      if (
        state.isConnected !== action.payload.isConnected ||
        state.isWifiEnabled !== action.payload.isWifiEnabled
      ) {
        state.isConnected = action.payload.isConnected;
        state.isWifiEnabled = action.payload.isWifiEnabled;
      }
    },
  },
});

export const {
  NETWORK_CHANGE,
}: {
  NETWORK_CHANGE: ActionCreatorWithPayload<
    NetworkStore,
    'network/NETWORK_CHANGE'
  >;
} = networkSlice.actions;

export const getNetworkStore = (state: {network: NetworkStore}) =>
  state.network;

export default networkSlice.reducer;
