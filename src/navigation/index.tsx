/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {
  DefaultTheme,
  NavigationContainer,
  RouteProp,
  Theme,
} from '@react-navigation/native';
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
  getLoginStore,
  LOGIN_STATUS_CHANGED,
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
import useAppUpdate from '../hooks/useAppUpdate';
import {KEYBOARD_EVENT_CHANGE} from '../store/slices/keyboard';
import {
  CommunityTabParamList,
  ExploreTabParamList,
  LearnTabParamList,
  RootStackParamList,
} from './types';
import usePermissions from '../hooks/usePermissions.tsx';
import {getNetworkStore, NetworkStore} from '../store/slices/network';
import {NativeStackNavigatorProps} from 'react-native-screens/lib/typescript/native-stack/types';
import {getUserTokenFromStorage} from '../store/api/userApi';
import {Dispatch, UnknownAction} from 'redux';
import useNetwork from '../hooks/useNetwork';
export default function Navigation() {
  const loginStore = useSelector(getLoginStore);
  const dispatch: Dispatch<UnknownAction> = useDispatch();
  const appUpdate = useAppUpdate();
  const network = useNetwork();
  const permissions = usePermissions();
  const navTheme: Theme = DefaultTheme;
  navTheme.colors.background = '#fff';
  useEffect(() => {
    console.log(
      '-------This should render only 1 time----------: NAVIGATION:useEffect2',
    );
    const subscribeToKeyboardEvents = (): (() => void) => {
      if (Platform.OS === 'ios') {
        const keyboardListenerWillHide: EmitterSubscription =
          Keyboard.addListener('keyboardWillHide', event => {
            dispatch(
              KEYBOARD_EVENT_CHANGE({
                type: 'keyboardWillHide',
                event: event,
                height: event.endCoordinates.height,
                status: false,
              }),
            );
          });

        const keyboardListenerWillShow: EmitterSubscription =
          Keyboard.addListener('keyboardWillShow', event => {
            dispatch(
              KEYBOARD_EVENT_CHANGE({
                type: 'keyboardWillShow',
                event: event,
                height: event.endCoordinates.height,
                status: true,
              }),
            );
          });

        return () => {
          keyboardListenerWillHide.remove();
          keyboardListenerWillShow.remove();
        };
      } else {
        const keyboardListenerDidHide: EmitterSubscription =
          Keyboard.addListener('keyboardDidHide', event => {
            dispatch(
              KEYBOARD_EVENT_CHANGE({
                type: 'keyboardDidHide',
                event: event,
                height: event.endCoordinates.height,
                status: false,
              }),
            );
          });

        const keyboardListenerDidShow: EmitterSubscription =
          Keyboard.addListener('keyboardDidShow', event => {
            dispatch(
              KEYBOARD_EVENT_CHANGE({
                type: 'keyboardDidShow',
                event: event,
                height: event.endCoordinates.height,
                status: true,
              }),
            );
          });

        return () => {
          keyboardListenerDidHide.remove();
          keyboardListenerDidShow.remove();
        };
      }
    };
    const unsubscribeKeyboard = subscribeToKeyboardEvents();
    const checkUserToken = async (): Promise<void> => {
      let token = loginStore.userToken
        ? loginStore.userToken
        : await getUserTokenFromStorage();
      console.log('token', token);
      if (!loginStore.userToken && !token) {
        dispatch(
          LOGIN_STATUS_CHANGED({
            type: LoginType.LOGIN_FAILED,
            userToken: null,
            loading: false,
          }),
        );
      } else {
        dispatch(
          LOGIN_STATUS_CHANGED({
            type: LoginType.LOGIN_SUCCESS,
            userToken: token,
            loading: false,
          }),
        );
      }
    };
    const fetchDeviceInfo = async (): Promise<void> => {
      const deviceInfo = await getData('[deviceInfo]');
      if (deviceInfo === null) {
        const newDeviceInfo = {
          fingerprint: await getFingerprint(),
          uniqueId: await getUniqueId(),
          version: getVersion(),
          buildNumber: getBuildNumber(),
          bundleId: getBundleId(),
          deviceId: getDeviceId(),
          manufacturer: await getManufacturer(),
          model: getModel(),
          brand: getBrand(),
        };
        await storeData('[deviceInfo]', newDeviceInfo);
        dispatch(DEVICEINFO_CHANGE(newDeviceInfo));
      }
    };
    const initializeApp = async (): Promise<void> => {
      await appUpdate.CheckAppUpdate();
      await network.listenNetwork();
      await permissions.checkPermissions();
      await fetchDeviceInfo();
      await checkUserToken();
    };

    initializeApp();

    return () => {
      unsubscribeKeyboard();
    };
  }, [dispatch]);

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {!loginStore.loading && loginStore.type === LoginType.LOGIN_SUCCESS ? (
          <Stack.Group>
            <Stack.Screen
              options={{animation: 'fade'}}
              name="Tabs"
              component={TabNavigator}
            />
          </Stack.Group>
        ) : !loginStore.loading &&
          (loginStore.type === LoginType.LOGIN_FAILED ||
            LoginType.RESTORE_TOKEN) ? (
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

const TabNavigator = () => {
  const networkStore: NetworkStore = useSelector(getNetworkStore);
  const styles = StyleSheet.create({
    width32: {width: 32},
  });
  const iconElement = (children: React.JSX.Element): React.JSX.Element => {
    return <View style={styles.width32}>{children}</View>;
  };
  const screenOptions = (tabs: {route: RouteProp<RootStackParamList>}) => {
    const tabBarIcon = ({focused}: {focused: boolean}) => {
      return iconElement(
        tabs.route.name === 'Community' ? (
          focused ? (
            <Community />
          ) : (
            <CommunityOutline />
          )
        ) : tabs.route.name === 'Learn' ? (
          focused ? (
            <LearnIndex />
          ) : (
            <LearnIndexOutline />
          )
        ) : focused ? (
          <Explore />
        ) : (
          <ExploreOutline />
        ),
      );
    };
    return {
      lazy: true,
      animationEnabled: false,
      swipeEnabled: true,
      headerShown: false,
      drawerHideStatusBarOnOpen: false,
      tabBarIcon,
      tabBarShowLabel: false,
      tabBarStyle: {height: 56},
    };
  };
  return (
    <Tab.Navigator initialRouteName="Learn" screenOptions={screenOptions}>
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

const LoadingStackNavigator = () => {
  const networkStore: NetworkStore = useSelector(getNetworkStore);
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
