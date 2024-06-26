import {useEffect} from 'react';
import {Permission, PermissionsAndroid} from 'react-native';
import {checkNotifications} from 'react-native-permissions';
import {useDispatch, useSelector} from 'react-redux';
import {
  getPermissionsStore,
  PERMISSIONS_CHANGE,
} from '../store/slices/permissions';
import {storeData} from '../utils/async-storage';

const usePermissions = () => {
  const dispatch = useDispatch();
  const permissions = useSelector(getPermissionsStore);
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
  }> => {
    const WRITE_EXTERNAL_STORAGE = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    const READ_EXTERNAL_STORAGE = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    const READ_MEDIA_IMAGES = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    );
    const READ_MEDIA_VIDEO = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    );
    const READ_MEDIA_AUDIO = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    );
    const RECORD_AUDIO = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    );
    const camera = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    const notification = await (await checkNotifications()).status;

    return {
      camera: camera,
      audio: {RECORD_AUDIO, READ_MEDIA_AUDIO},
      storage: {
        WRITE_EXTERNAL_STORAGE,
        READ_EXTERNAL_STORAGE,
        READ_MEDIA_IMAGES,
        READ_MEDIA_VIDEO,
      },
      notification: notification === 'granted' ? true : false,
    };
  };

  const checkPermissions = () => {
    const PermissionsArray: Permission[] = [];
    if (!permissions.camera) {
      PermissionsArray.push(PermissionsAndroid.PERMISSIONS.CAMERA);
    }
    if (!permissions.storage) {
      PermissionsArray.push(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
    }

    setTimeout(async () => {
      PermissionsAndroid.requestMultiple(PermissionsArray).then(async () => {
        //const status = await getPermissions();
        storeAndDispatchPermissions();
      });
    }, 10);
  };

  const storeAndDispatchPermissions = async () => {
    const data = await getPermissions();
    storeData('[permissionsInfo]', {...data});
    dispatch(PERMISSIONS_CHANGE({...data}));
  };

  //
  useEffect(() => {}, []);

  return {
    checkPermissions,
  };
};

export default usePermissions;
