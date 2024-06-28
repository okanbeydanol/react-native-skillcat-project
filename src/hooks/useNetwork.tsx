import NetInfo, {
  NetInfoState,
  NetInfoSubscription,
} from '@react-native-community/netinfo';
import {NETWORK_CHANGE} from '../store/slices/network';
import {useDispatch} from 'react-redux';

const useNetwork = (): {
  listenNetwork: () => Promise<NetInfoSubscription | null>;
} => {
  const dispatch = useDispatch();

  const listenNetwork = async (): Promise<NetInfoSubscription | null> => {
    return new Promise<NetInfoSubscription | null>((resolve): void => {
      let unsubscribeNetwork: NetInfoSubscription | null = null;
      let pendingResolve:
        | ((value: NetInfoSubscription | null) => void)
        | undefined;

      const handleNetworkChange = (state: NetInfoState): void => {
        dispatch(
          NETWORK_CHANGE({
            isConnected: state.isConnected,
            isWifiEnabled: state.isWifiEnabled,
          }),
        );

        if (unsubscribeNetwork) {
          resolve(unsubscribeNetwork);
        } else {
          pendingResolve = resolve;
        }
      };

      unsubscribeNetwork = NetInfo.addEventListener(handleNetworkChange);

      if (pendingResolve) {
        pendingResolve(unsubscribeNetwork);
        pendingResolve = undefined;
      }
    });
  };

  return {
    listenNetwork,
  };
};

export default useNetwork;
