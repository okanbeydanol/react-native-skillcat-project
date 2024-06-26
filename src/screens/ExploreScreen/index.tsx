import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SafeAreaAppHeader from '../../components/Header/SafeAreaAppHeader';
import {ExploreTabScreenProps} from '../../navigation/types';

const ExploreScreen = ({
  navigation,
  route
}: ExploreTabScreenProps<'ExploreScreen'>) => {
  return (
    <>
      <SafeAreaAppHeader style={styles.appHeader} />
      <View>
        <Text>Explore</Text>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  appHeader: {},
});
export default ExploreScreen;
