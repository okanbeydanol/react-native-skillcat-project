import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SafeAreaAppHeader from '../../components/Header/SafeAreaAppHeader';
import {LearnTabScreenProps} from '../../navigation/types';

const SectionsScreen = ({
  navigation,
  route,
}: LearnTabScreenProps<'sections'>) => {
  //Route Params
  const {competencyid, fromLearnTab, fromSkillsTab} = route.params;
  return (
    <>
      <SafeAreaAppHeader style={styles.appHeader} />
      <View>
        <Text>SectionsScreen</Text>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  appHeader: {},
});
export default SectionsScreen;
