/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState} from 'react';
import {
  Alert,
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {
  saveUserTokenToStorage,
  useLazyGetTokenQuery,
} from '../../store/api/userApi';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import Animated, {
  useSharedValue,
  runOnJS,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  SharedValue,
} from 'react-native-reanimated';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {LongPressGestureHandler} from 'react-native-gesture-handler';
import {storeData} from '../../utils/async-storage.tsx';
import {LOGIN_STATUS_CHANGED, LoginType} from '../../store/slices/login.tsx';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const [user_token] = useLazyGetTokenQuery();
  const [username, setUsername] = useState('kenyan@okan.epa');
  const [password, setPassword] = useState('Test1234');
  const [showLogin, setShowLogin] = useState(false);
  const [sliderHeight, setSliderHeight] = useState(0);
  const PAGE_WIDTH = Dimensions.get('window').width;
  const progress = useSharedValue(0);
  const baseOptions = {
    vertical: false,
    width: PAGE_WIDTH,
    height: 0,
  };
  const colors = [
    '#26292E',
    '#899F9C',
    '#B3C680',
    '#5C6265',
    '#F5D399',
    '#F1F1F1',
  ];
  const ref = React.useRef<ICarouselInstance>(null);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const handleLogin = () => {
    user_token({username, password}).then(response => {
      console.log(response);
      if (response.isSuccess) {
        Alert.alert('Login Successful!');
        dispatch(
          LOGIN_STATUS_CHANGED({
            type: LoginType.LOGIN_SUCCESS,
            userToken: response.data.token,
            loading: false,
          }),
        );
      } else {
        Alert.alert('Login Failed');
      }
    });
  };

  const handleGoogleSignIn = () => {
    // Handle Google Sign-In
  };

  const handleFacebookSignIn = () => {
    // Handle Facebook Sign-In
  };

  const handleAppleSignIn = () => {
    // Handle Apple Sign-In
  };

  const handleLongPress = () => {
    console.log('Long press detected');
  };

  const styles = StyleSheet.create({
    appHeader: {
      height: 0,
    },
    scrollView: {
      flexGrow: 1,
    },
    logo: {
      width: 200, // Adjust width as needed
      height: 60, // Adjust height as needed
      resizeMode: 'contain',
      alignSelf: 'center',
    },
    splashLeftPicture: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 100, // Adjust as needed
      height: 100, // Adjust as needed
      resizeMode: 'contain',
    },
    splashRightPicture: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 100, // Adjust as needed
      height: 100, // Adjust as needed
      resizeMode: 'contain',
    },
    slider: {
      minHeight: sliderHeight,
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    oauthContainer: {
      marginTop: 20,
    },
    termOfUse: {
      color: '#000',
      textAlign: 'center',
      fontFamily: 'SF Pro Display',
      fontSize: 12,
      fontStyle: 'normal',
      fontWeight: '500',
      marginBottom: 14,
    },
    link: {
      color: '#F47D57',
      fontSize: 12,
      fontWeight: '700',
      textDecorationLine: 'underline',
    },
    haveAccount: {
      color: '#F47D57',
      fontSize: 14,
      textAlign: 'center',
    },
    loginContainer: {
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    input: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    button: {
      backgroundColor: '#F47D57',
      paddingVertical: 10,
      borderRadius: 5,
      marginVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    socialLoginContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    continueWith: {
      fontSize: 16,
      color: '#00000080',
      fontWeight: '500',
      marginVertical: 10,
    },
    forgotPassword: {
      color: '#6995C9',
      fontSize: 14,
      textAlign: 'center',
      marginVertical: 10,
    },
    signup: {
      color: '#F47D57',
      fontSize: 14,
      textAlign: 'center',
      marginVertical: 10,
    },
  });

  return (
    <>
      <KeyboardAwareScrollView
        bottomOffset={20}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        disableScrollOnKeyboardHide={true}
        showsVerticalScrollIndicator={false}
        persistentScrollbar={false}
        bounces={false}
        bouncesZoom={false}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        contentContainerStyle={[styles.scrollView]}>
        {!showLogin ? (
          <>
            <View style={styles.loginContainer}>
              <Image
                source={require('../../assets/img/skillcat-logo2.png')}
                style={[styles.logo]}
              />
              <Image
                source={require('../../assets/introPictures/pinksplashleft.png')}
                style={styles.splashLeftPicture}
              />
              <Image
                source={require('../../assets/introPictures/pinksplashright.png')}
                style={styles.splashRightPicture}
              />
            </View>
            <View style={[styles.slider]}>
              <Carousel
                ref={ref}
                {...baseOptions}
                style={{
                  width: PAGE_WIDTH,
                }}
                loop
                pagingEnabled={true}
                snapEnabled={true}
                autoPlay={true}
                autoPlayInterval={1500}
                data={colors}
                onProgressChange={(_, absoluteProgress) =>
                  (progress.value = absoluteProgress)
                }
                renderItem={({index}) => (
                  <Animated.View style={{flex: 1}}>
                    <Text style={{color: colors[index], fontSize: 24}}>
                      Item {index + 1}
                    </Text>
                  </Animated.View>
                )}
              />
              {!!progress && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: 100,
                    alignSelf: 'center',
                  }}>
                  {colors.map((backgroundColor, index) => {
                    return (
                      <PaginationItem
                        backgroundColor={backgroundColor}
                        animValue={progress}
                        index={index}
                        key={index}
                        length={colors.length}
                      />
                    );
                  })}
                </View>
              )}
            </View>
            <View style={styles.oauthContainer}>
              <Text style={styles.termOfUse}>
                By clicking on sign up, you agree to our
                <Text style={styles.link} onPress={() => {}}>
                  Terms of Service and Privacy Policy.
                </Text>
              </Text>

              <Button
                title="Sign up with Google"
                onPress={handleGoogleSignIn}
              />
              <Button
                title="Sign up with Facebook"
                onPress={handleFacebookSignIn}
              />
              <Button title="Sign up with Apple" onPress={handleAppleSignIn} />
              <Button
                title="Sign up with Email"
                onPress={handleFacebookSignIn}
              />
              <TouchableOpacity onPress={() => setShowLogin(true)}>
                <Text style={styles.haveAccount}>
                  Already have an account? Log in
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.loginContainer}>
              <Image
                source={require('../../assets/img/skillcat-logo2.png')}
                style={[styles.logo]}
              />
              <Image
                source={require('../../assets/introPictures/pinksplashleft.png')}
                style={styles.splashLeftPicture}
              />
              <Image
                source={require('../../assets/introPictures/pinksplashright.png')}
                style={styles.splashRightPicture}
              />
            </View>
            <View
              style={[styles.slider]}
              onLayout={event => {
                setSliderHeight(event.nativeEvent.layout.height);
              }}>
              <Carousel
                ref={ref}
                {...baseOptions}
                style={{
                  width: PAGE_WIDTH,
                }}
                loop
                pagingEnabled={true}
                snapEnabled={true}
                autoPlay={true}
                autoPlayInterval={1500}
                data={colors}
                onProgressChange={(_, absoluteProgress) =>
                  (progress.value = absoluteProgress)
                }
                renderItem={({index}) => (
                  <Animated.View style={{flex: 1}}>
                    <Text style={{color: colors[index], fontSize: 24}}>
                      Item {index + 1}
                    </Text>
                  </Animated.View>
                )}
              />
              {!!progress && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: 100,
                    alignSelf: 'center',
                  }}>
                  {colors.map((backgroundColor, index) => {
                    return (
                      <PaginationItem
                        backgroundColor={backgroundColor}
                        animValue={progress}
                        index={index}
                        key={index}
                        length={colors.length}
                      />
                    );
                  })}
                </View>
              )}
            </View>
            <View style={styles.loginContainer}>
              <Text style={styles.header}>Login</Text>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>

              <View style={styles.socialLoginContainer}>
                <Text style={styles.continueWith}>Continue with</Text>
                <Button title="Google" onPress={handleGoogleSignIn} />
                <Button title="Facebook" onPress={handleFacebookSignIn} />
                <Button title="Apple" onPress={handleAppleSignIn} />
                <Button title="Email" onPress={handleAppleSignIn} />
              </View>

              <TouchableOpacity onPress={() => setShowLogin(false)}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowLogin(false)}>
                <Text style={styles.signup}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </KeyboardAwareScrollView>
    </>
  );
};

export default LoginScreen;

const PaginationItem: React.FC<{
  index: number;
  backgroundColor: string;
  length: number;
  animValue: SharedValue<number>;
}> = props => {
  const {animValue, index, length, backgroundColor} = props;
  const width = 10;
  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [-width, 0, width];

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
      outputRange = [-width, 0, width];
    }
    return {
      transform: [
        {
          translateX: interpolate(
            animValue?.value,
            inputRange,
            outputRange,
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  }, [animValue, index, length]);
  return (
    <View
      style={{
        backgroundColor: 'grey',
        width,
        height: width,
        borderRadius: 50,
        overflow: 'hidden',
        transform: [
          {
            rotateZ: '0deg',
          },
        ],
      }}>
      <Animated.View
        style={[
          {
            borderRadius: 50,
            backgroundColor,
            flex: 1,
          },
          animStyle,
        ]}
      />
    </View>
  );
};
