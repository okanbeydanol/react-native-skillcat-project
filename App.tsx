import React from 'react';
import {Provider} from 'react-redux';
import {persistor, store} from './src/store';
import Navigation from './src/navigation';
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {StyleSheet} from 'react-native';
// persistor.purge();
const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <SafeAreaView style={GlobalStyles.flex}>
            <GestureHandlerRootView style={GlobalStyles.flex}>
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
export const GlobalStyles = StyleSheet.create({
  flex: {flex: 1},
});
export default App;
