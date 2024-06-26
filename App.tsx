import React from 'react';
import {Provider} from 'react-redux';
import {persistor, store} from './src/store/index';
import Navigation from './src/navigation/index';
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {KeyboardProvider} from 'react-native-keyboard-controller';
// persistor.purge();
// AsyncStorage.clear();
const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <SafeAreaView style={{flex: 1}}>
            <GestureHandlerRootView style={{flex: 1}}>
              <KeyboardProvider>
                <Navigation />
              </KeyboardProvider>
            </GestureHandlerRootView>
          </SafeAreaView>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
