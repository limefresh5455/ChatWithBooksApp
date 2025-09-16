import React, {useEffect} from 'react';
import Toast from 'react-native-toast-message';
import {GOOGLE_WEB_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar, useColorScheme, View} from 'react-native';
import WelcomePage from './Component/Auth/WelcomePage/WelcomePage';
import Login from './Component/Auth/Login/Login';
import Register from './Component/Auth/Register/Register';
import ForgotPassword from './Component/Auth/ForgotPassword/ForgotPassword';
import OtpVerify from './Component/Auth/OtpVerify/OtpVerify';
import ResetPassword from './Component/Auth/ResetPassword/ResetPassword';
import SignUpOtpVerify from './Component/Auth/OtpVerify/SignUpOtpVerify';
import SuccessFullResetPassword from './Component/Pages/SuccessFullResetPassword/SuccessFullResetPassword';
import SuccessSignUpPage from './Component/Pages/SuccessSignUpPage/SuccessSignUpPage';
import OnBoradingScreen from './Component/Pages/OnBoradingScreen/OnBoradingScreen';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useAuth} from './Component/ContextApi/AuthContext/AuthContext';
import ProtectedRoutes from './Component/ProtectedRoutes/ProtectedRoutes';
import Logout from './Component/Pages/Logout/Logout';
import BottomTabNavigator from './Component/User/BottomTabNavigator/BottomTabNavigator';
import DisplayPdf from './Component/User/DisplayPdf/DisplayPdf';
import Chat from './Component/User/Chat/Chat';
import NetworkStatus from './Component/Pages/NetworkStatus/NetworkStatus';
import PaymentSuccess from './Component/User/Payment/PaymentSuccess/PaymentSuccess';
import PaymentFailed from './Component/User/Payment/PaymentFailed/PaymentFailed';
import PaymentPending from './Component/User/Payment/PaymentPending/PaymentPending';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const Stack = createStackNavigator();

function App() {
  const {users} = useAuth();
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const colorScheme = useColorScheme();  
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      // androidClientId: GOOGLE_ANDROID_CLIENT_ID,
      offlineAccess: false,
      scopes: ['profile', 'email'],
    });
  }, []);

  React.useEffect(() => {
    const checkFirstLaunch = async () => {
      const alreadyLaunched = await AsyncStorage.getItem('alreadyLaunched');
      if (alreadyLaunched === null) {
        await AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
      setTimeout(() => setIsLoading(false), 500);
    };
    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null || isLoading) return null;

  return (
    <>
      <SafeAreaProvider>
        <StatusBar backgroundColor="#1777FF" barStyle={isDarkMode ? 'light-content' : 'dark-content'}    />
    
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            {users ? (
              <>
                <Stack.Screen name="BottomTabNavigator">
                  {props => (
                    <ProtectedRoutes
                      {...props}
                      component={BottomTabNavigator}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen name="Chat" component={Chat}    />
                <Stack.Screen name="DisplayPdf" component={DisplayPdf} />
                <Stack.Screen name="Logout" component={Logout} />
                <Stack.Screen
                  name="PaymentSuccess"
                  component={PaymentSuccess}
                />
                <Stack.Screen name="PaymentFailed" component={PaymentFailed} />
                <Stack.Screen
                  name="PaymentPending"
                  component={PaymentPending}
                />
              </>
            ) : isFirstLaunch ? (
              <>
                <Stack.Screen name="WelcomePage" component={WelcomePage} />
                <Stack.Screen
                  name="OnBoradingScreen"
                  component={OnBoradingScreen}
                />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen
                  name="ForgotPassword"
                  component={ForgotPassword}
                />
                <Stack.Screen
                  name="SignUpOtpVerify"
                  component={SignUpOtpVerify}
                />
                <Stack.Screen name="OtpVerify" component={OtpVerify} />
                <Stack.Screen name="ResetPassword" component={ResetPassword} />
                <Stack.Screen
                  name="SuccessFullResetPassword"
                  component={SuccessFullResetPassword}
                />
                <Stack.Screen
                  name="SuccessSignUpPage"
                  component={SuccessSignUpPage}
                />
              </>
            ) : (
              <>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen
                  name="ForgotPassword"
                  component={ForgotPassword}
                />
                <Stack.Screen
                  name="SignUpOtpVerify"
                  component={SignUpOtpVerify}
                />
                <Stack.Screen name="OtpVerify" component={OtpVerify} />
                <Stack.Screen name="ResetPassword" component={ResetPassword} />
                <Stack.Screen
                  name="SuccessFullResetPassword"
                  component={SuccessFullResetPassword}
                />
                <Stack.Screen
                  name="SuccessSignUpPage"
                  component={SuccessSignUpPage}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
        <NetworkStatus />
        <Toast />
      </SafeAreaProvider>
    </>
  );
}

export default App;

 
