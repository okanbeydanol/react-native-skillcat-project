import {useDispatch} from 'react-redux';
import {PERMISSIONS_CHANGE} from '../store/slices/permissions';
import {storeData} from '../utils/async-storage';
import {Dispatch, UnknownAction} from 'redux';
import {PayloadAction} from '@reduxjs/toolkit';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  checkNotifications,
  Permission,
} from 'react-native-permissions';
import {Platform} from 'react-native';

const usePermissions = (): {
  checkPermissions: () => Promise<
    PayloadAction<any, 'permissions/PERMISSIONS_CHANGE'>
  >;
  requestPermissions: (
    permission: Permission,
  ) => Promise<PayloadAction<any, 'permissions/PERMISSIONS_CHANGE'>>;
} => {
  const dispatch: Dispatch<UnknownAction> = useDispatch();

  const getPermissions = async (): Promise<{
    camera: boolean;
    audio: {RECORD_AUDIO: boolean; READ_MEDIA_AUDIO: boolean};
    storage: {
      WRITE_EXTERNAL_STORAGE: boolean;
      READ_EXTERNAL_STORAGE: boolean;
      READ_MEDIA_IMAGES: boolean;
      READ_MEDIA_VIDEO: boolean;
    };
    notification: boolean;
    permissionsIsChecked: boolean;
  }> => {
    const cameraPermission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;
    const recordAudioPermission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.RECORD_AUDIO
        : PERMISSIONS.IOS.MICROPHONE;
    const readMediaAudioPermission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.READ_MEDIA_AUDIO
        : PERMISSIONS.IOS.MEDIA_LIBRARY;
    const writeExternalStoragePermission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
        : PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY;
    const readExternalStoragePermission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
        : PERMISSIONS.IOS.PHOTO_LIBRARY;
    const readMediaImagesPermission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.IOS.MEDIA_LIBRARY;
    const readMediaVideoPermission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.READ_MEDIA_VIDEO
        : PERMISSIONS.IOS.MEDIA_LIBRARY;

    const camera = (await check(cameraPermission)) === RESULTS.GRANTED;
    const RECORD_AUDIO =
      (await check(recordAudioPermission)) === RESULTS.GRANTED;
    const READ_MEDIA_AUDIO =
      (await check(readMediaAudioPermission)) === RESULTS.GRANTED;
    const WRITE_EXTERNAL_STORAGE =
      (await check(writeExternalStoragePermission)) === RESULTS.GRANTED;
    const READ_EXTERNAL_STORAGE =
      (await check(readExternalStoragePermission)) === RESULTS.GRANTED;
    const READ_MEDIA_IMAGES =
      (await check(readMediaImagesPermission)) === RESULTS.GRANTED;
    const READ_MEDIA_VIDEO =
      (await check(readMediaVideoPermission)) === RESULTS.GRANTED;
    const notification = (await checkNotifications()).status === 'granted';

    return {
      camera,
      audio: {RECORD_AUDIO, READ_MEDIA_AUDIO},
      storage: {
        WRITE_EXTERNAL_STORAGE,
        READ_EXTERNAL_STORAGE,
        READ_MEDIA_IMAGES,
        READ_MEDIA_VIDEO,
      },
      notification,
      permissionsIsChecked: true,
    };
  };

  const checkPermissions = async (): Promise<
    PayloadAction<any, 'permissions/PERMISSIONS_CHANGE'>
  > => {
    return new Promise<PayloadAction<any, 'permissions/PERMISSIONS_CHANGE'>>(
      async (
        resolve: (
          value: PayloadAction<any, 'permissions/PERMISSIONS_CHANGE'>,
        ) => void,
      ): Promise<void> => {
        return resolve(await storeAndDispatchPermissions());
      },
    );
  };

  const requestPermissions = (
    permission: Permission,
  ): Promise<PayloadAction<any, 'permissions/PERMISSIONS_CHANGE'>> => {
    return new Promise<PayloadAction<any, 'permissions/PERMISSIONS_CHANGE'>>(
      async (
        resolve: (
          value: PayloadAction<any, 'permissions/PERMISSIONS_CHANGE'>,
        ) => void,
      ): Promise<void> => {
        await request(permission);
        return resolve(await storeAndDispatchPermissions());
      },
    );
  };

  const storeAndDispatchPermissions = async (): Promise<
    PayloadAction<any, 'permissions/PERMISSIONS_CHANGE'>
  > => {
    return new Promise<PayloadAction<any, 'permissions/PERMISSIONS_CHANGE'>>(
      async (
        resolve: (
          value: PayloadAction<any, 'permissions/PERMISSIONS_CHANGE'>,
        ) => void,
      ): Promise<void> => {
        const data = await getPermissions();
        await storeData('[permissionsInfo]', {...data});
        return resolve(dispatch(PERMISSIONS_CHANGE({...data})));
      },
    );
  };

  return {
    checkPermissions,
    requestPermissions,
  };
};

export default usePermissions;
