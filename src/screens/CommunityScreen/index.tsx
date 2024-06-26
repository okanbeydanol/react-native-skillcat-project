import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SafeAreaAppHeader from '../../components/Header/SafeAreaAppHeader';
import {CommunityTabScreenProps} from '../../navigation/types';

const CommunityScreen = ({
  navigation,
}: CommunityTabScreenProps<'CommunityScreen'>) => {
  return (
    <>
      <SafeAreaAppHeader style={styles.appHeader} />
      <View>
        <Text>Community</Text>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  appHeader: {},
});

export default CommunityScreen;
