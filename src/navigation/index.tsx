/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useDispatch, useSelector} from 'react-redux';

// Screens
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ExploreScreen from '../screens/ExploreScreen';
import LearnScreen from '../screens/LearnScreen';

import {
  LoginType,
  getLoginStore,
  LOGIN_FAILED,
  LOGIN_SUCCESS,
} from '../store/slices/login';
import {getData, storeData} from '../utils/async-storage';
import LearnIndexOutline from '../assets/images/tabs/learnindex-outline.svg';
import LearnIndex from '../assets/images/tabs/learnindex.svg';
import ExploreOutline from '../assets/images/tabs/explore-outline.svg';
import Explore from '../assets/images/tabs/explore.svg';
import CommunityOutline from '../assets/images/tabs/community-outline.svg';
import Community from '../assets/images/tabs/community.svg';
import {
  EmitterSubscription,
  Keyboard,
  Platform,
  KeyboardEvent,
  View,
} from 'react-native';
import {
  getBrand,
  getBuildNumber,
  getBundleId,
  getDeviceId,
  getFingerprint,
  getManufacturer,
  getModel,
  getUniqueId,
  getVersion,
} from 'react-native-device-info';
import {DEVICEINFO_CHANGE} from '../store/slices/deviceInfo';
import {PERMISSIONS_CHANGE} from '../store/slices/permissions';
import {checkNotifications} from 'react-native-permissions';
import useAppUpdate from '../hooks/useAppUpdate';
import {KEYBOARD_EVENT_CHANGE} from '../store/slices/keyboard';
import {
  CommunityTabParamList,
  ExploreTabParamList,
  LearnTabParamList,
  RootStackParamList,
} from './types';
import {getUserTokenFromStorage} from '../store/api/userApi';

//Initialize Navigation
export default function Navigation() {
  const loginStore = useSelector(getLoginStore);
  const dispatch = useDispatch();
  const appUpdate = useAppUpdate();
  //Get Theme
  const navTheme = DefaultTheme;
  navTheme.colors.background = '#fff';
  //Initialize Beginning Controller
  useEffect(() => {
    if (loginStore.type === LoginType.LOGIN_SUCCESS) {
      setTimeout(async () => {
        storeData('s[userToken]', loginStore.userToken);
      }, 10);
    } else if (loginStore.type === LoginType.RESTORE_TOKEN) {
      const getUserToken = async () => {
        let userToken;
        try {
          userToken = await getUserTokenFromStorage();
        } catch (e) {
          // Restoring token failed
        }
        return userToken;
      };
      setTimeout(async () => {
        await appUpdate.CheckAppUpdate();
        const deviceInfo = await getData('[deviceInfo]');
        if (deviceInfo === null) {
          const fingerprint = await getFingerprint();
          const uniqueId = await getUniqueId();
          const version = await getVersion();
          const buildNumber = await getBuildNumber();
          const bundleId = await getBundleId();
          const deviceId = await getDeviceId();
          const manufacturer = await getManufacturer();
          const model = await getModel();
          const brand = await getBrand();
          storeData('[deviceInfo]', {
            uniqueId,
            bundleId,
            deviceId,
            manufacturer,
            model,
            brand,
            fingerprint,
            version,
            buildNumber,
          });
          dispatch(
            DEVICEINFO_CHANGE({
              uniqueId,
              bundleId,
              deviceId,
              manufacturer,
              model,
              brand,
              fingerprint,
              version,
              buildNumber,
            }),
          );
        }
        const permissionsInfo = await getData('[permissionsInfo]');
        if (permissionsInfo === null) {
          const notification = await (await checkNotifications()).status;
          console.log('notification', notification);
          storeData('[permissionsInfo]', {
            storage: {
              WRITE_EXTERNAL_STORAGE: null,
              READ_EXTERNAL_STORAGE: null,
              READ_MEDIA_IMAGES: null,
              READ_MEDIA_VIDEO: null,
            },
            camera: null,
            audio: {RECORD_AUDIO: null, READ_MEDIA_AUDIO: null},
            notification: notification === 'granted' ? true : false,
          });
          dispatch(
            PERMISSIONS_CHANGE({
              storage: {
                WRITE_EXTERNAL_STORAGE: null,
                READ_EXTERNAL_STORAGE: null,
                READ_MEDIA_IMAGES: null,
                READ_MEDIA_VIDEO: null,
              },
              camera: null,
              audio: {RECORD_AUDIO: null, READ_MEDIA_AUDIO: null},
              notification: notification === 'granted' ? true : false,
            }),
          );
        }
        const userToken = await getUserToken();
        if (userToken === null) {
          dispatch(
            LOGIN_FAILED({
              type: LoginType.LOGIN_FAILED,
              userToken: userToken,
              loading: true,
            }),
          );
        } else {
          dispatch(
            LOGIN_SUCCESS({
              type: LoginType.LOGIN_SUCCESS,
              userToken: userToken,
              loading: true,
            }),
          );
        }
      }, 10);
    }
  }, [loginStore.type]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      const keyboardListenerWillHide: EmitterSubscription =
        Keyboard.addListener('keyboardWillHide', (event: KeyboardEvent) => {
          dispatch(
            KEYBOARD_EVENT_CHANGE({
              type: 'keyboardWillHide',
              event: event,
            }),
          );
        });
      const keyboardListenerWillShow: EmitterSubscription =
        Keyboard.addListener('keyboardWillShow', (event: KeyboardEvent) => {
          dispatch(
            KEYBOARD_EVENT_CHANGE({
              type: 'keyboardWillShow',
              event: event,
            }),
          );
        });
      return () => {
        keyboardListenerWillHide.remove();
        keyboardListenerWillShow.remove();
      };
    } else {
      const keyboardListenerDidHide: EmitterSubscription = Keyboard.addListener(
        'keyboardDidHide',
        (event: KeyboardEvent) => {
          dispatch(
            KEYBOARD_EVENT_CHANGE({
              type: 'keyboardDidHide',
              event: event,
            }),
          );
        },
      );
      const keyboardListenerDidShow: EmitterSubscription = Keyboard.addListener(
        'keyboardDidShow',
        (event: KeyboardEvent) => {
          dispatch(
            KEYBOARD_EVENT_CHANGE({
              type: 'keyboardDidShow',
              event: event,
            }),
          );
        },
      );
      return () => {
        keyboardListenerDidHide.remove();
        keyboardListenerDidShow.remove();
      };
    }
  }, [dispatch]);

  return (
    <NavigationContainer theme={navTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

//Navigator Stacks
const Stack = createNativeStackNavigator();
const LearnStack = createNativeStackNavigator<LearnTabParamList>();
const ExploreStack = createNativeStackNavigator<ExploreTabParamList>();
const CommunityStack = createNativeStackNavigator<CommunityTabParamList>();
const LoadingStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator<RootStackParamList>();

const RootNavigator = () => {
  const loginStore = useSelector(getLoginStore);
  console.log('loginStore', loginStore);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {loginStore.type === LoginType.LOGIN_SUCCESS ? (
        <Stack.Group>
          <Stack.Screen
            options={{animation: 'fade'}}
            name="Tabs"
            component={TabNavigator}
          />
        </Stack.Group>
      ) : loginStore.type === LoginType.LOGIN_FAILED ? (
        <Stack.Group>
          <Stack.Screen
            options={{animation: 'fade'}}
            name="LoginScreen"
            component={LoginScreen}
          />
        </Stack.Group>
      ) : (
        <Stack.Screen
          options={{animation: 'fade'}}
          name="Loading"
          component={LoadingStackNavigator}
        />
      )}
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Learn"
      screenOptions={({route}) => ({
        lazy: true,
        animationEnabled: false,
        swipeEnabled: true,
        headerShown: false,
        drawerHideStatusBarOnOpen: false,
        tabBarIcon: ({focused}) => {
          let iconName: any;
          if (route.name === 'Community') {
            iconName = focused ? (
              <View style={{width: 32}}>
                <Community />
              </View>
            ) : (
              <View style={{width: 32}}>
                <CommunityOutline />
              </View>
            );
          } else if (route.name === 'Learn') {
            iconName = focused ? (
              <View style={{width: 32}}>
                <LearnIndex />
              </View>
            ) : (
              <View style={{width: 32}}>
                <LearnIndexOutline />
              </View>
            );
          } else if (route.name === 'Explore') {
            iconName = focused ? (
              <View style={{width: 32}}>
                <Explore />
              </View>
            ) : (
              <View style={{width: 32}}>
                <ExploreOutline />
              </View>
            );
          }
          return iconName;
        },
        tabBarShowLabel: false,
        tabBarStyle: {height: 56},
      })}>
      <Tab.Screen name="Community" component={CommunityStackNavigator} />
      <Tab.Screen
        name="Learn"
        component={LearnStackNavigator}
        options={{
          tabBarBadge: 1,
        }}
      />
      <Tab.Screen name="Explore" component={ExploreStackNavigator} />
    </Tab.Navigator>
  );
};

const LearnStackNavigator = () => {
  return (
    <LearnStack.Navigator screenOptions={{headerShown: false}}>
      <LearnStack.Screen name="LearnScreen" component={LearnScreen} />
    </LearnStack.Navigator>
  );
};

const ExploreStackNavigator = () => {
  return (
    <ExploreStack.Navigator screenOptions={{headerShown: false}}>
      <ExploreStack.Screen name="ExploreScreen" component={ExploreScreen} />
    </ExploreStack.Navigator>
  );
};

const CommunityStackNavigator = () => {
  return (
    <CommunityStack.Navigator screenOptions={{headerShown: false}}>
      <CommunityStack.Screen
        name="CommunityScreen"
        component={CommunityScreen}
      />
    </CommunityStack.Navigator>
  );
};

const LoadingStackNavigator = () => {
  return (
    <LoadingStack.Navigator screenOptions={{headerShown: false}}>
      <LoadingStack.Screen name="LoadingScreen" component={LoadingScreen} />
    </LoadingStack.Navigator>
  );
};
