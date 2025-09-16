import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFeather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import {API_URL} from '@env';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  updateUserProfileService,
  getUserProfileService,
} from '../UserService/UserService';
import BookLoading from '../../Pages/Loading/BookLoading';

const {width, height} = Dimensions.get('window');

const UserProfile = () => {
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState({
    username: '',
    avatar: '',
    email: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const menuItems = [
    {
      icon: 'history',
      label: 'Transaction History',
      action: () => navigation.navigate('TransactionHistory'),
    },
    {
      icon: 'library-books',
      label: 'Purchased Plan Info',
      action: () => navigation.navigate('PurchaseBooks'),
    },
    {
      icon: 'logout',
      label: 'Log Out',
      action: () => navigation.navigate('Logout'),
    },
  ];

  useEffect(() => {
    Orientation.lockToPortrait();
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      setIsLoading(true);
      const response = await getUserProfileService();
      console.log(response.data, 'response');
      if (response.status === 200) {
        setUserDetails({
          username: response.data.username,
          avatar: response.data.avatar,
          email: response.data.email,
          phone: response.data.phone_number,
        });
      }
    } catch (error) {
      handleProfileError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileError = error => {
    const {status} = error.response || {};
    const message = error.response?.data?.detail;

    if (status === 401) {
      Toast.show({
        type: 'error',
        text1: 'Unauthorized',
        text2: message || 'Your session has expired. Please log in again.',
      });
      navigation.navigate('Logout');
    }
    console.log('Profile Error:', error.response);
  };

  const handleEditImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true,
      compressImageQuality: 0.8,
    })
      .then(handleUpdateImage)
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
          console.log('Image Error:', error);
          Toast.show({
            type: 'error',
            text1: 'Image Error',
            text2: 'Failed to select image',
          });
        }
      });
  };

  const handleUpdateImage = async image => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('avatar', {
        uri: image.path,
        type: image.mime,
        name: image.filename || 'profile.jpg',
      });

      const response = await updateUserProfileService(formData);
      if (response.status === 200) {
        setUserDetails(prev => ({
          ...prev,
          avatar: response.data?.data.avatar,
        }));
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Profile picture updated',
        });
      }
    } catch (error) {
      handleProfileError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../../../assets/images/Background-Image.png')}
        style={styles.backgroundImage}
      />

      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Profile Header */}

        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={handleEditImage}>
            <View style={styles.avatarContainer}>
              {userDetails.avatar ? (
                <Image
                  source={{uri: `${API_URL}/${userDetails.avatar}`}}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {userDetails.username.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={styles.editIcon}>
                <IconFeather name="edit" size={16} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>

          <Text style={styles.name}>{userDetails.username || 'User Name'}</Text>
          <Text style={styles.handle}>
            {userDetails.email || 'user@example.com'}
          </Text>

          <Text style={styles.handleNumber}>
            {`Mobile Number: ${userDetails.phone}`}
          </Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.action}>
              <Icon
                name={item.icon}
                size={24}
                color="#555"
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>{item.label}</Text>
              <Icon
                name="chevron-right"
                size={20}
                color="#999"
                style={styles.chevron}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {isLoading && <BookLoading />}
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollView: {
    // padding: 20,
    // paddingTop: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#1777FF',
    paddingVertical: 20,
    color: '#fff',
    paddingHorizontal: 15,
    // borderBottomLeftRadius: 70,
    borderBottomRightRadius: 80,
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#1777FF',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1777FF',
  },
  avatarText: {
    fontSize: 36,
    fontFamily: 'Mulish-Bold',
    color: '#555',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1777FF',
    borderRadius: 15,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff',
  },
  handle: {
    fontSize: 18,
    fontFamily: 'Mulish-Regular',
    color: '#fff',
    marginBottom: 10,
  },
  handleNumber: {
    fontSize: 18,
    fontFamily: 'Mulish-Regular',
    color: '#fff',
    marginBottom: 20,
  },
  menuContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuIcon: {
    marginRight: 15,
    width: 24,
  },
  menuText: {
    flex: 1,
    fontFamily: 'Mulish-SemiBold',
    fontSize: 16,
    color: '#333',
  },
  chevron: {
    marginLeft: 'auto',
  },
  planContainer: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  planLabel: {
    fontWeight: 'bold',
    color: '#000',
    marginRight: 4,
    fontSize: 20,
  },
  planValue: {
    color: '#1777FF',
    fontFamily: 'Mulish-Bold',
    fontSize: 20,
  },
});

export default UserProfile;
