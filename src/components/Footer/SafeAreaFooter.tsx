import {StyleSheet} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

const SafeAreaFooter = () => {
  return <SafeAreaView style={styles.safeArea} edges={['bottom']} />;
};

export default SafeAreaFooter;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
    margin: 0,
  },
  footerStyle: {
    height: 0,
  },
});
