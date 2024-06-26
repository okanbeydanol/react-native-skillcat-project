import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import {useDispatch} from 'react-redux';

const SplashScreen = ({navigation}: any) => {
  //Dispatch
  const dispatch = useDispatch();
  //States
  const [loading, setLoading] = useState(true);
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text>Splash Screen</Text>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {},
});

export default SplashScreen;
