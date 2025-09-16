import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import {API_URL} from '@env';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GetAllBooks} from '../UserService/UserService';
import BookLoading from '../../Pages/Loading/BookLoading';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {useAuth} from '../../ContextApi/AuthContext/AuthContext';
import Orientation from 'react-native-orientation-locker';

const {width, height} = Dimensions.get('window');

const UserLibrary = () => {
  const navigation = useNavigation();
  const {users} = useAuth();
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  const renderStars = rating => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <Image
            key={i}
            source={require('../../../../assets/images/fullStar.png')}
            style={styles.starStyle}
          />,
        );
      } else if (i - rating === 0.5) {
        stars.push(
          <Image
            key={i}
            source={require('../../../../assets/images/halfStar.png')}
            style={styles.starStyle}
          />,
        );
      } else {
        stars.push(
          <Image
            key={i}
            source={require('../../../../assets/images/emptyStar.png')}
            style={styles.starStyle}
          />,
        );
      }
    }
    return <View style={styles.starContainer}>{stars}</View>;
  };

  useFocusEffect(
    useCallback(() => {
      const getAllBooks = async () => {
        try {
          setLoading(true);
          const response = await GetAllBooks();
          if (response.status === 200 || response.status === 201) {
            setLoading(false);
            setAllBooks(response.data);
          }
        } catch (error) {
          setLoading(false);
          const {status} = error.response || {};
          const message = error.response?.data?.detail;
          if (status === 401) {
            Toast.show({
              type: 'error',
              text1: 'Unauthorized',
              text2:
                message || 'Your session has expired. Please log in again.',
            });
            navigation.navigate('Logout');
          }
          console.log('Error fetching getAllBooks', error.response);
        }
      };
      getAllBooks();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionTitle1}>
        Hi{' '}
        <Text style={styles.userName}>
          {users?.user?.name.charAt(0).toUpperCase() +
            users?.user?.name.slice(1)}
        </Text>{' '}
      </Text>

      <Text style={styles.sectionsubTitle}>
        Your Purchased Books Are Available Here.
      </Text>
      <View style={styles.sectionContainerlaibrary}>
        {allBooks.subscriptions?.length > 0 ? (
          <FlatList
            data={allBooks.subscriptions}
            keyExtractor={item => item.book.id.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.gridContainer}
            contentContainerStyle={{paddingBottom: 20}}
            renderItem={({item}) => (
              <View style={styles.bookCardNew}>
                <TouchableOpacity
                  style={styles.bookCardNewBox}
                  onPress={() =>
                    navigation.navigate('Chat', {book: item.book})
                  }>
                  <View style={styles.imageBoxNew}>
                    <Image
                      source={{uri: `${API_URL}${item.book.image}`}}
                      style={styles.bookImage1}
                    />
                  </View>
                  <Text
                    style={styles.bookTitle}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {item.book?.name.charAt(0).toUpperCase() +
                      item.book?.name.slice(1)}
                  </Text>
                  <Text
                    style={styles.AutherName}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item.book?.auther_name.charAt(0).toUpperCase() +
                      item.book?.auther_name.slice(1)}
                  </Text>
                  <View style={styles.ratingBox}>{renderStars(4)}</View>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <View style={styles.noBooksContainer}>
            <Image
              source={require('../../../../assets/images/NoBook.png')}
              style={styles.noBooksImage}
            />
          </View>
        )}
      </View>
      {loading && <BookLoading />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userName: {
    color: '#1777FF',
    fontFamily: 'Mulish-Bold',
  },
  sectionContainerlaibrary: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.02,
    marginBottom: height * 0.19,
  },
  header_box: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: height * 0.01,
  },
  long_arrow_right: {
    padding: width * 0.01,
  },
  sectionTitle1: {
    fontSize: width * 0.08,
    fontFamily: 'Mulish-Bold',
    color: '#000',
    marginLeft: width * 0.05,
    marginTop: height * 0.02,
  },
  sectionContainer: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: width * 0.03,
    elevation: 10,
  },
  sectionsubTitle: {
    fontSize: width * 0.048,
    color: '#000',
    fontFamily: 'Mulish-regular',
    marginLeft: width * 0.05,
    marginBottom: height * 0.01,
  },

  sectionTitle: {
    fontSize: width * 0.055,
    fontWeight: '800',
    color: '#000',
    marginLeft: width * 0.05,
    marginTop: height * 0.025,
    marginBottom: height * 0.025,
  },

  bookCardNew: {
    width: (width - 55) / 2, // Ensures two cards fit per row with spacing
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderColor: '#1777FF',
    borderWidth: 1,
    overflow: 'hidden',
  },

  bookCardNewBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookCard: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#F5F5F5',
    padding: 10,
    paddingVertical: 15,
    justifyContent: 'center',
    marginHorizontal: width * 0.02,
    gap: height * 0.01,
    overflow: 'hidden',
  },

  imageBoxNew: {
    width: 170,
    height: 190,
    borderColor: '#CACACA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.01,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
  },

  imageBox: {
    width: 140,
    height: 160,
    // borderWidth: 1,
    borderColor: '#CACACA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.01,
    borderRadius: 10,
    // elevation: 6
  },

  bookImage1: {
    width: 170,
    height: 190,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'cover',
    overflow: 'hidden',
  },

  bookTitle: {
    fontSize: width * 0.042,
    fontFamily: 'Mulish-regular',
    color: '#000',
    textAlign: 'center',
    maxWidth: width * 0.3, // Dynamic max width
    height: height * 0.03,
    overflow: 'hidden',
  },
  AutherName: {
    fontSize: width * 0.036,
    color: '#8D8D8D',
    textAlign: 'center',
    fontFamily: 'Mulish-regular',
    maxWidth: width * 0.25, // Dynamic max width
    height: height * 0.03,
    paddingTop: height * 0.003,
    overflow: 'hidden',
  },
  addButton: {
    backgroundColor: '#1777FF',
    borderRadius: 20,
    paddingVertical: height * 0.005,
    paddingHorizontal: width * 0.07,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: width * 0.034,
  },
  starStyle: {
    width: 15,
    height: 15,
    objectFit: 'cover',
  },
  starContainer: {
    flexDirection: 'row',
  },
  noBooksContainer: {
    marginTop: height * 0.18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noBooksImage: {
    width: width * 0.9,
    height: height * 0.3,
    resizeMode: 'cover',
  },
  gridContainer: {
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 5,
  },
  ratingBox: {
    paddingVertical: 5,
  },
});

export default UserLibrary;
