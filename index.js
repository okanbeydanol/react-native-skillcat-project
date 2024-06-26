/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry, LogBox, YellowBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

LogBox.ignoreLogs([/react-native-gesture-handler/]);

AppRegistry.registerComponent(appName, () => App);
