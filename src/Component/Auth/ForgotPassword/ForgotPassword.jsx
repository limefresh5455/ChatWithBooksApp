import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import {forgotPasswordValidation} from '../Validation/Validation';
import {forgotPasswordService} from '../Service/Service';
import {SafeAreaView} from 'react-native-safe-area-context';
import BookLoading from '../../Pages/Loading/BookLoading';
import Orientation from 'react-native-orientation-locker';
import Toast from 'react-native-toast-message';

const {width, height} = Dimensions.get('window');

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    Orientation.lockToPortrait();
    return () => Orientation.unlockAllOrientations();
  }, []);

  const handleForgotPassword = async () => {
    try {
      const validation = await forgotPasswordValidation(email);
      setErrors(validation);
      if (Object.keys(validation).length === 0) {
        Keyboard.dismiss();
        setLoading(true);
        const response = await forgotPasswordService({email});
        setLoading(false);
        if (response.status === 200 || response.status === 201) {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'OTP sent to your email.',
          });
          navigation.navigate('OtpVerify', {email});
          setEmail('');
        }
      }
    } catch (error) {
      setLoading(false);
      const message =
        error.response?.data?.detail || 'Failed to send OTP. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
      console.error('Forgot Password Error:', error.response);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../../../assets/images/Background-Image.png')}
        style={styles.backgroundImage}
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Form Container */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>FORGOT PASSWORD</Text>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Icon name="mail" size={24} color="#212529" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor="#4F4F4F"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  if (text) {
                    setErrors(prevErrors => ({...prevErrors, email: null}));
                  }
                }}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            {/* Continue Button */}
            <Animatable.View animation="bounceInDown" duration={1500}>
              <TouchableOpacity
                style={styles.ContinueButton}
                onPress={handleForgotPassword}
                disabled={loading}>
                <Text style={styles.ContinueButtonText}>CONTINUE</Text>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </ScrollView>
        {/* Back to Login at Bottom */}
        <View style={styles.signInContainer}>
          <Text style={styles.accountText}>Back to the?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInText}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {loading && <BookLoading />}
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
     height: height,
    resizeMode: 'cover',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.05,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 15,
    padding: width * 0.05,
  },
  title: {
    fontSize: width * 0.06,
    fontFamily: 'Mulish-Bold',
    color: '#1777FF',
    marginBottom: height * 0.03,

  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#212529',
    borderRadius: 25,
    marginBottom: height * 0.025,
    width: '100%',
    height: 55,
    color: '000',
    fontWeight: '700',
  },
  icon: {
    marginRight: 10,
    padding: width * 0.02,
  },
  input: {
    flex: 1,
    fontSize: width * 0.05,
    lineHeight: 20,
    color: '#000',
    fontWeight: '600',
  },
  ContinueButton: {
    backgroundColor: '#1777FF',
    paddingVertical: height * 0.02,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  ContinueButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontFamily: 'Mulish-Bold',
  },
  signInContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountText: {
    fontSize: width * 0.04,
    fontFamily: 'Mulish-Bold',
    fontWeight: 'bold',
    color: '#212529',
  },
  signInText: {
    fontSize: width * 0.056,
    color: '#1777FF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: width * 0.04,
    fontFamily: 'Mulish-Regular',
    marginLeft: width * 0.03,
    // marginBottom: height * 0.01,
  },
});

export default ForgotPassword;
