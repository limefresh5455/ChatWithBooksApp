import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {API_URL} from '@env';
import Pdf from 'react-native-pdf';
import BookLoading from '../../Pages/Loading/BookLoading';
import {GetAllBooks} from '../UserService/UserService';
import Toast from 'react-native-toast-message';
import {captureRef} from 'react-native-view-shot';
import ImageCropPicker from 'react-native-image-crop-picker';
import Orientation from 'react-native-orientation-locker';
import RNFS from 'react-native-fs';

const {width, height} = Dimensions.get('window');

const DisplayPdf = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const book = route.params?.book;
  const pdfUrl = `${API_URL}${book?.pdf}`;
  // const pdfUrl = `${API_URL}${book?.pdf}?timestamp=${Date.now()}`;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumberInput, setPageNumberInput] = useState('');
  const [loading, setLoading] = useState(true);

  const [allBooks, setAllBooks] = useState([]);
  const pdfRef = React.useRef(null);
  const pageInputRef = React.useRef(null);
  const isAndroid = Platform.OS === 'android';
  const androidVersion = isAndroid ? Platform.Version : null;

  useEffect(() => {
    if (totalPages > 0) {
      setLoading(false);
    }
  }, [totalPages]);

  useEffect(() => {
    setPageNumberInput(String(currentPage)); // Set input to current page on mount and when currentPage changes
  }, [currentPage]);

  useEffect(() => {
    const getAllBooks = async () => {
      try {
        const response = await GetAllBooks();
        if (response.status === 200 || response.status === 201) {
          setAllBooks(response.data?.subscriptions);
        }
      } catch (error) {
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
        console.log('Error fetching getAllBooks', error.response);
      }
    };
    Orientation.lockToPortrait();
    getAllBooks();
  }, []);

  const toggleSelection = async () => {
    try {
      const uri = await captureRef(pdfRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      console.log('Captured URI:', uri);
      const imageurl = await ImageCropPicker.openCropper({
        height: height * 0.9,
        width: width,
        path: uri,
        cropperCircleOverlay: false,
        cropping: true,
        cropperToolbarTitle: 'Select the Area',
        cropperActiveWidgetColor: '#ffffff',
        cropperToolbarWidgetColor: '#ffffff',
        cropperToolbarColor: '#1777FF',
        cropperStatusBarColor: '#1777FF',
        cropperToolbarIconColor: '#ffffff',
        cropperToolbarCloseIconColor: '#ffffff',
        cropperToolbarDoneIconColor: '#ffffff',
        cropperToolbarTitleColor: '#ffffff',
        freeStyleCropEnabled: true,
        hideBottomControls: true,
      });

      const base64Image = await RNFS.readFile(imageurl.path, 'base64');
      const formattedImage = `data:image/png;base64,${base64Image}`;
      navigation.navigate('Chat', {
        capturedImage: formattedImage,
        book: book,
        currentPage: currentPage,
      });
    } catch (error) {
      console.log('Error capturing or cropping image:', error);
    }
  };

  const isBookSubscribed = allBooks => {
    if (Array.isArray(allBooks)) {
      return allBooks.some(sub => sub.book.id === book.id);
    }
    return false;
  };

  const handlePageChange = (page, numberOfPages) => {
    setCurrentPage(page);
    setTotalPages(numberOfPages);
    setPageNumberInput(String(page));

    if (page > 50 && !isBookSubscribed(allBooks)) {
      Alert.alert(
        'Page Limit Reached',
        'You can only read up to 50 pages. Please subscribe to continue reading.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Subscribe',
            onPress: () => navigation.navigate('Subscription', {book}), // Navigate to Subscription page
          },
        ],
      );
      setCurrentPage(50);
      pdfRef.current.setPage(50);
      return;
    }
  };

  const handleFindPage = () => {
    pageInputRef.current.focus();
  };

  const handlePageInputChange = text => {
    const pageNumber = parseInt(text);
    setPageNumberInput(text);
    if (pageNumber > totalPages) {
      Alert.alert(
        'Invalid Page Number',
        `Please enter a number between 1 and ${totalPages}`,
      );
    }
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setLoading(true);
      setTimeout(() => {
        pdfRef.current.setPage(pageNumber);
        setLoading(false); // <-- Manually stop loading after page change
      }, 200);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: isAndroid
              ? androidVersion >= 35
                ? height * 0.03
                : height * 0.01
              : height * 0.03,
          },
        ]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <MaterialIcons
            name="arrow-back-ios"
            size={width * 0.07}
            color="#fff"
          />
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text
            style={styles.headerText}
            numberOfLines={1}
            ellipsizeMode="tail">
            {book?.name
              ? book.name.charAt(0).toUpperCase() + book.name.slice(1)
              : 'Unknown Book'}
          </Text>
        </View>

        <Image
          source={{uri: `${API_URL}/${book.image}`}}
          style={styles.thumbnail}
        />
      </View>

      {loading && <BookLoading />}
      <View style={styles.pdfContainer}>
        <Pdf
          ref={pdfRef}
          trustAllCerts={false}
          enablePaging={false}
          enableAnnotationRendering={false}
          fitPolicy={0}
          source={{uri: pdfUrl, cache: true}}
          onLoadComplete={numberOfPages => {
            console.log(`Number of pages: ${numberOfPages}`);
            setTotalPages(numberOfPages); // This will trigger useEffect
          }}
          onLoadProgress={percent => {
            console.log('PDF loading progress:', percent);
          }}
          onPageChanged={handlePageChange}
          onError={error => {
            console.log(error);
            Alert.alert(
              'Error',
              'Unable to load PDF. The file may be corrupted or not in PDF format.',
            );
            setLoading(false);
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
        />
      </View>

      <View style={styles.scrollIndicator}>
        <TextInput
          ref={pageInputRef}
          style={styles.pageInput}
          keyboardType="numeric"
          value={pageNumberInput?.toString()} // Ensure the input value is a string
          onChangeText={handlePageInputChange}
          placeholder="Enter page number"
          placeholderTextColor="#999"
        />
        <Text style={styles.pageNumber}>/ {totalPages}</Text>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleFindPage}>
          <MaterialIcons name="find-in-page" size={26} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={toggleSelection}>
          <Icon name="crop" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    position: 'absolute',
    bottom: height * 0.04, // Adjust to position the buttons higher or lower
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
  },
  actionButton: {
    backgroundColor: '#1777FF',
    borderRadius: 30,
    padding: 18,
    elevation: 3,
  },

  scrollIndicator: {
    position: 'absolute',
    bottom: height * 0.04,
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingVertical: height * 0.006,
    paddingHorizontal: width * 0.04,
    borderRadius: 30,
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#1777FF',
    borderWidth: 2,
    minWidth: width * 0.3,
    maxWidth: width * 0.9,
  },

  pageNumber: {
    color: '#000',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  pageInput: {
    height: height * 0.06, // Responsive height
    width: width * 0.1, // Responsive width
    borderColor: '#000',
    textAlign: 'center',
    color: '#000',
    fontSize: width * 0.04, // Responsive font size
    fontWeight: 'bold',
  },

  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },

  icon: {
    textAlign: 'center',
  },

  pdfContainer: {
    // flex: 1,
    backgroundColor: '#fff',
    paddingTop: height * 0.01,
    width: '100%',
    height: '100%',
  },
  pdf: {
    width: '100%',
    height: '100%',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: height * 0.01,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#1777FF',
    paddingHorizontal: width * 0.06,
  },

  backButton: {
    marginRight: width * 0.03, // Add some spacing between back button and text
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1, // Takes up remaining space
    marginHorizontal: width * 0.02, // Add some horizontal margin
  },
  headerText: {
    fontSize: width * 0.045,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Mulish-Bold',
    width: width * 0.5,
  },
  subText: {
    color: '#fff',
    fontSize: width * 0.03,
    fontFamily: 'Mulish-Italic',
  },
  thumbnail: {
    width: width * 0.15,
    height: width * 0.15,
    resizeMode: 'cover',
    borderRadius: width * 0.02,
    marginLeft: width * 0.02, // Add some spacing between text and image
  },
});

export default DisplayPdf;
