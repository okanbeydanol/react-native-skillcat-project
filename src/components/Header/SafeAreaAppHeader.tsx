import {
  ImageStyle,
  LayoutRectangle,
  NativeSyntheticEvent,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

const SafeAreaAppHeader = ({
  style,
  children,
  headerLayout,
}: {
  style?: ViewStyle | TextStyle | ImageStyle;
  children?: any;
  headerLayout?: (layout: LayoutRectangle) => void;
}) => {
  const handleHeaderLayout = (
    event: NativeSyntheticEvent<{layout: LayoutRectangle}>,
  ) => {
    const layout = event.nativeEvent.layout;
    headerLayout && headerLayout(layout);
  };
  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
      onLayout={handleHeaderLayout}>
      <View style={[styles.headerStyle, style]}>{children}</View>
    </SafeAreaView>
  );
};

export default SafeAreaAppHeader;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
    height: 0,
  },
  headerStyle: {
    height: 0,
  },
});
