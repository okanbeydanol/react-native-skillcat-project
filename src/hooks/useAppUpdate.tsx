import {getVersion} from 'react-native-device-info';
import {useLazyGetAppVersionQuery} from '../store/api/userApi';
import {Platform} from 'react-native';
import {AppStatus} from '../constants/typescript/general-types';
const useAppUpdate = (): {CheckAppUpdate: () => Promise<AppStatus | null>} => {
  const [app_version_trigger] = useLazyGetAppVersionQuery();
  const CheckAppUpdate = async (): Promise<AppStatus | null> => {
    return new Promise<AppStatus | null>(
      async (resolve: (value: AppStatus | null) => void): Promise<void> => {
        try {
          app_version_trigger({})
            .then(d => {
              const version: string = getVersion();
              let platformVersion: string = '';
              if (Platform.OS === 'ios') {
                platformVersion = d?.data?.iosVersion || '0.0.0';
              } else if (Platform.OS === 'android') {
                platformVersion = d?.data?.androidVersion || '0.0.0';
              }
              const result: number = compareVersion(version, platformVersion);
              let appStatus: AppStatus = AppStatus.Successful;
              if (result === 1) {
                appStatus = AppStatus.UpdateAvailable;
              } else if (result === 0) {
                appStatus = AppStatus.Successful;
              } else {
                appStatus = AppStatus.WrongVersion;
              }

              return resolve(appStatus);
            })
            .catch(() => {
              return resolve(null);
            });
        } catch (error) {
          return resolve(null);
        }
      },
    );
  };
  const compareVersion = (a: string, b: string): number => {
    const aComponents = a.split('.');
    const bComponents = b.split('.');

    const len = Math.min(aComponents.length, bComponents.length);

    for (let i = 0; i < len; i++) {
      // A bigger than B
      if (parseInt(aComponents[i], 10) > parseInt(bComponents[i], 10)) {
        return 1;
      }

      // B bigger than A
      if (parseInt(aComponents[i], 10) < parseInt(bComponents[i], 10)) {
        return -1;
      }
    }

    if (aComponents.length > bComponents.length) {
      return 1;
    }

    if (aComponents.length < bComponents.length) {
      return -1;
    }

    return 0;
  };

  return {
    CheckAppUpdate,
  };
};

export default useAppUpdate;
