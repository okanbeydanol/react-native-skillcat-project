import {
  combineReducers,
  configureStore,
  ConfigureStoreOptions,
  EnhancedStore,
  StoreEnhancer,
  ThunkDispatch,
  Tuple,
} from '@reduxjs/toolkit';
import dbLoginSliceReducer, {LoginResult} from './slices/login';
import keyboardEventsSliceReducer from './slices/keyboard';
import deviceInfoSliceReducer from './slices/deviceInfo';
import permissionsSliceReducer from './slices/permissions';
import learningPlansSliceReducer from './slices/learningPlans';
import networkSliceReducer from './slices/network';
import {userApi} from './api/userApi';
import {createTransform, persistReducer, persistStore} from 'redux-persist';
import AsyncStorage, {
  AsyncStorageStatic,
} from '@react-native-async-storage/async-storage';
import {UnknownAction} from 'redux';
import {Persistor} from 'redux-persist/es/types';

const rootReducer = combineReducers({
  login: dbLoginSliceReducer,
  keyboardEvents: keyboardEventsSliceReducer,
  deviceInfo: deviceInfoSliceReducer,
  permissions: permissionsSliceReducer,
  learningPlans: learningPlansSliceReducer,
  network: networkSliceReducer,
  [userApi.reducerPath]: userApi.reducer,
});

const persistConfig: {
  key: string;
  storage: AsyncStorageStatic;
  whitelist: string[];
  blacklist: string[];
} = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['keyboardEvents', 'deviceInfo', 'permissions', 'learningPlans'],
  blacklist: ['network'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const createStore = (
  options?: ConfigureStoreOptions['preloadedState'] | undefined,
) =>
  configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            'persist/PERSIST',
            'persist/REHYDRATE',
            'persist/PAUSE',
            'persist/FLUSH',
            'persist/PURGE',
            'persist/REGISTER',
          ],
        },
      }).concat(userApi.middleware),
    ...options,
  });

export const store: EnhancedStore<
  any,
  UnknownAction,
  Tuple<
    [
      StoreEnhancer<{dispatch: ThunkDispatch<any, undefined, UnknownAction>}>,
      StoreEnhancer,
    ]
  >
> = createStore();
export const persistor: Persistor = persistStore(store);
