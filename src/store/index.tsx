import {
  combineReducers,
  configureStore,
  ConfigureStoreOptions,
} from '@reduxjs/toolkit';
import dbLoginSliceReducer from './slices/login';
import keyboardEventsSliceReducer from './slices/keyboard';
import deviceInfoSliceReducer from './slices/deviceInfo';
import permissionsSliceReducer from './slices/permissions';
import {loginApi} from './api/loginApi';
import {userApi} from './api/userApi';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rootReducer = combineReducers({
  login: dbLoginSliceReducer,
  keyboardEvents: keyboardEventsSliceReducer,
  deviceInfo: deviceInfoSliceReducer,
  permissions: permissionsSliceReducer,
  [loginApi.reducerPath]: loginApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
});
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['login'],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const createStore = (
  options?: ConfigureStoreOptions['preloadedState'] | undefined,
) =>
  configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
        // serializableCheck: {
        //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // },
      }).concat(loginApi.middleware, userApi.middleware),
    ...options,
  });

export const store = createStore();

export const persistor = persistStore(store);
