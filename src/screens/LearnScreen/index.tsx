import React from 'react';
import {BackHandler, StyleSheet, Text, View} from 'react-native';
import SafeAreaAppHeader from '../../components/Header/SafeAreaAppHeader';
import {useFocusEffect} from '@react-navigation/native';
import {LearnTabScreenProps} from '../../navigation/types';

const LearnScreen = ({
  navigation,
  route,
}: LearnTabScreenProps<'LearnScreen'>) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );
  return (
    <>
      <SafeAreaAppHeader style={styles.appHeader} />
      <View>
        <Text>Learn</Text>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  appHeader: {},
});
export default LearnScreen;
