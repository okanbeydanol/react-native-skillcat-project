/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {
  DefaultTheme,
  NavigationContainer,
  ParamListBase,
  StackNavigationState,
  TypedNavigator,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useDispatch, useSelector} from 'react-redux';

// Screens
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ExploreScreen from '../screens/ExploreScreen';
import LearnScreen from '../screens/LearnScreen';

import {
  getLoginStore,
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  LoginType,
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
  KeyboardEvent,
  Platform,
  StyleSheet,
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
import {getPermissionsStore} from '../store/slices/permissions';
import useAppUpdate from '../hooks/useAppUpdate';
import {KEYBOARD_EVENT_CHANGE} from '../store/slices/keyboard';
import {
  CommunityTabParamList,
  ExploreTabParamList,
  LearnTabParamList,
  RootStackParamList,
} from './types';
import usePermissions from '../hooks/usePermissions.tsx';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {getNetworkStore, NETWORK_CHANGE} from '../store/slices/network';
import {NativeStackNavigatorProps} from 'react-native-screens/lib/typescript/native-stack/types';
export default function Navigation() {
  const loginStore = useSelector(getLoginStore);
  const permissionStore = useSelector(getPermissionsStore);
  const dispatch = useDispatch();
  const appUpdate = useAppUpdate();
  const permissions = usePermissions();
  const networkStore = useSelector((state: {network: NetworkStore}) =>
    getNetworkStore(state),
  );
  const navTheme = DefaultTheme;
  navTheme.colors.background = '#fff';

  useEffect(() => {
    if (loginStore.type === LoginType.RESTORE_TOKEN) {
      setTimeout(async () => {
        if (!loginStore.userToken) {
          dispatch(
            LOGIN_FAILED({
              type: LoginType.LOGIN_FAILED,
              userToken: null,
              loading: true,
            }),
          );
        } else {
          dispatch(
            LOGIN_SUCCESS({
              type: LoginType.LOGIN_SUCCESS,
              userToken: loginStore.userToken,
              loading: true,
            }),
          );
        }
      }, 1);
    }
  }, [loginStore.type]);

  useEffect(() => {
    console.log('-------This should render only 1 time----------: NAVIGATION');
    setTimeout(async () => {
      await appUpdate.CheckAppUpdate();
      const deviceInfo = await getData('[deviceInfo]');
      if (deviceInfo === null) {
        const fingerprint = await getFingerprint();
        const uniqueId = await getUniqueId();
        const version = getVersion();
        const buildNumber = getBuildNumber();
        const bundleId = getBundleId();
        const deviceId = getDeviceId();
        const manufacturer = await getManufacturer();
        const model = getModel();
        const brand = getBrand();
        await storeData('[deviceInfo]', {
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
      if (!permissionStore.permissionsIsChecked) {
        await permissions.checkPermissions();
      }
    }, 1);
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      dispatch(
        NETWORK_CHANGE({
          isConnected: state.isConnected,
          isWifiEnabled: state.isWifiEnabled,
        }),
      );
    });

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
        unsubscribe();
        keyboardListenerDidHide.remove();
        keyboardListenerDidShow.remove();
      };
    }
  }, [dispatch]);

  return (
    <NavigationContainer theme={navTheme}>
      <RootNavigator networkStore={networkStore} />
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
//Route
type NetworkStore = {
  isConnected: boolean | null;
  isWifiEnabled: boolean | undefined;
};

const RootNavigator = ({networkStore}: {networkStore: NetworkStore}) => {
  const loginStore = useSelector(getLoginStore);
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
            initialParams={{networkStore}}
            component={TabNavigator}
          />
        </Stack.Group>
      ) : loginStore.type === LoginType.LOGIN_FAILED ? (
        <Stack.Group>
          <Stack.Screen
            options={{animation: 'fade'}}
            name="LoginScreen"
            initialParams={{networkStore}}
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

const TabNavigator = ({route}: NativeStackNavigatorProps) => {
  const networkStore = route.params.networkStore;
  const styles = StyleSheet.create({
    width32: {width: 32},
  });
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
              <View style={styles.width32}>
                <Community />
              </View>
            ) : (
              <View style={styles.width32}>
                <CommunityOutline />
              </View>
            );
          } else if (route.name === 'Learn') {
            iconName = focused ? (
              <View style={styles.width32}>
                <LearnIndex />
              </View>
            ) : (
              <View style={styles.width32}>
                <LearnIndexOutline />
              </View>
            );
          } else if (route.name === 'Explore') {
            iconName = focused ? (
              <View style={styles.width32}>
                <Explore />
              </View>
            ) : (
              <View style={styles.width32}>
                <ExploreOutline />
              </View>
            );
          }
          return iconName;
        },
        tabBarShowLabel: false,
        tabBarStyle: {height: 56},
      })}>
      <Tab.Screen
        initialParams={{networkStore}}
        name="Community"
        component={CommunityStackNavigator}
      />
      <Tab.Screen
        initialParams={{networkStore}}
        name="Learn"
        component={LearnStackNavigator}
        options={{
          tabBarBadge: 1,
        }}
      />
      <Tab.Screen
        initialParams={{networkStore}}
        name="Explore"
        component={ExploreStackNavigator}
      />
    </Tab.Navigator>
  );
};

const LearnStackNavigator = ({route}: NativeStackNavigatorProps) => {
  const networkStore = route.params.networkStore;
  return (
    <LearnStack.Navigator screenOptions={{headerShown: false}}>
      <LearnStack.Screen
        initialParams={{networkStore}}
        name="LearnScreen"
        component={LearnScreen}
      />
    </LearnStack.Navigator>
  );
};

const ExploreStackNavigator = ({route}: NativeStackNavigatorProps) => {
  const networkStore = route.params.networkStore;
  return (
    <ExploreStack.Navigator screenOptions={{headerShown: false}}>
      <ExploreStack.Screen
        initialParams={{networkStore}}
        name="ExploreScreen"
        component={ExploreScreen}
      />
    </ExploreStack.Navigator>
  );
};

const CommunityStackNavigator = ({route}: NativeStackNavigatorProps) => {
  const networkStore = route.params.networkStore;
  return (
    <CommunityStack.Navigator screenOptions={{headerShown: false}}>
      <CommunityStack.Screen
        initialParams={{networkStore}}
        name="CommunityScreen"
        component={CommunityScreen}
      />
    </CommunityStack.Navigator>
  );
};

const LoadingStackNavigator = ({route}: NativeStackNavigatorProps) => {
  const networkStore = route.params.networkStore;
  return (
    <LoadingStack.Navigator screenOptions={{headerShown: false}}>
      <LoadingStack.Screen
        initialParams={{networkStore}}
        name="LoadingScreen"
        component={LoadingScreen}
      />
    </LoadingStack.Navigator>
  );
};
