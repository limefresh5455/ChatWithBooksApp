import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import {API_URL} from '@env';
import {SafeAreaView} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/Ionicons';
import {GetAllBooksByPagination} from '../UserService/UserService';
import BookLoading from '../../Pages/Loading/BookLoading';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Orientation from 'react-native-orientation-locker';
import ChatLoader from '../../Pages/Loading/ChatLoader';

const {width, height} = Dimensions.get('window');

const DisplayBookByPagination = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const searchInputRef = useRef(null);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastPageReached, setLastPageReached] = useState(false); // New state for last page
  const [page, setPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [appliedGenres, setAppliedGenres] = useState([]);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const debounceTimeoutRef = useRef(null);
  const genres = [
    'Math',
    'Science',
    'Psychology',
    'Thriller',
    'Adventure',
    'Daily Life',
  ];

  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.focusSearch) {
        searchInputRef.current?.focus();
      }
      setSelectedGenres([]);
      setAppliedGenres([]);
    }, [route.params?.focusSearch]),
  );

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setPage(1);
      setLastPageReached(false);
      setSearch(searchInput.trim());
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchInput]);

  useEffect(() => {
    getAllBooksByPagination();
  }, [page, search, appliedGenres]);

  const getAllBooksByPagination = async () => {
    if (loadingMore || lastPageReached) return;

    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const genreQuery = appliedGenres
        .map(genre => `genres=${genre.toLowerCase()}`)
        .join('&');

      const response = await GetAllBooksByPagination(page, search, genreQuery);

      if (response.status === 200 || response.status === 201) {
        const newBooks = response.data?.results?.books || [];

        if (newBooks.length === 0) {
          if (page === 1) {
            setAllBooks([]);
          }
          setLastPageReached(true);
        } else {
          setAllBooks(prevBooks =>
            page === 1 ? newBooks : [...prevBooks, ...newBooks],
          );
        }
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
      console.log('Error fetching getAllBooksByPagination', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreBooks = () => {
    if (!loadingMore && !lastPageReached && allBooks.length >= 4) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleSelectGenre = genre => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre],
    );
  };

  // Apply genres when 'Apply' button is clicked
  const getBooksByGenres = () => {
    setModalVisible(false);
    setPage(1);
    // setAllBooks([]);
    setLastPageReached(false);
    setAppliedGenres(selectedGenres);
  };

  const renderBook = ({item: book}) => (
    <View key={book.id} style={styles.bookCard}>
      <TouchableOpacity
        style={styles.bookCardNewBox}
        onPress={() => navigation.navigate('Chat', {book: book})}>
        <View style={styles.imageBox}>
          <Image
            source={{uri: `${API_URL}${book.image}`}}
            style={styles.bookImage}
          />
        </View>
        <Text style={styles.bookTitle} numberOfLines={1} ellipsizeMode="tail">
          {book?.name
            ? book.name.charAt(0).toUpperCase() + book.name.slice(1)
            : 'Unknown Book'}
        </Text>
        <Text style={styles.AutherName} numberOfLines={1} ellipsizeMode="tail">
          {book?.auther_name
            ? book.auther_name.charAt(0).toUpperCase() +
              book.auther_name.slice(1)
            : 'Unknown Author'}
        </Text>
      </TouchableOpacity>
      <View style={styles.iconButtonRow}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Chat', {book})}
          style={styles.iconButton}>
          <Icon name="chatbubbles-outline" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Subscription', {book})}
          style={styles.iconButton}>
          <AntDesign name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleClearFilters = () => {
    setModalVisible(false);
    setSelectedGenres([]);
    setAppliedGenres([]);
    setPage(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon
          name="search-outline"
          size={24}
          color="#000"
          style={styles.searchIcon}
        />
        <TextInput
          ref={searchInputRef}
          placeholder="Search By BookName..."
          placeholderTextColor="#000"
          style={styles.searchInput}
          value={searchInput}
          onChangeText={text => setSearchInput(text)}
        />
        <Icon
          name="options-outline"
          size={24}
          color="#1777FF"
          style={styles.filterIcon}
          onPress={() => setModalVisible(true)}
        />
      </View>
      {/* Genre Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Genre</Text>
            <View style={styles.genreContainer}>
              {genres.map(genre => (
                <TouchableOpacity
                  key={genre}
                  style={[
                    styles.genreButton,
                    selectedGenres.includes(genre) &&
                      styles.selectedGenreButton,
                  ]}
                  onPress={() => handleSelectGenre(genre)}>
                  <Text
                    style={[
                      styles.genreText,
                      selectedGenres.includes(genre) &&
                        styles.selectedGenreText,
                    ]}>
                    {genre}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <Pressable
                onPress={handleClearFilters}
                style={styles.cancelButtonMain}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={getBooksByGenres}
                style={styles.applyButtonMain}>
                <Text style={styles.applyButton}>Apply</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {!loading && allBooks.length === 0 ? (
        <View style={styles.noBooksContainer}>
          <Image
            source={require('../../../../assets/images/NoBook.png')}
            style={styles.noBooksImage}
          />
        </View>
      ) : (
        <FlatList
          data={allBooks}
          keyboardShouldPersistTaps="handled"
          renderItem={renderBook}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={2}
          scrollEnabled={allBooks.length > 2}
          contentContainerStyle={{
            paddingBottom: 100,
            alignItems: 'center',
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreBooks}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            loadingMore && !lastPageReached ? <ChatLoader /> : null
          }
        />
      )}

      {loading && <BookLoading />}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#1777FF',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.001,
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
    // elevation: 10,
  },
  searchIcon: {
    marginRight: width * 0.03,
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.045,
    borderLeftWidth: 1,
    borderLeftColor: '#C9C9C9',
    paddingLeft: width * 0.03,
    color: '#000',
  },
  filterIcon: {
    marginLeft: width * 0.03,
  },
  modalContainer: {
    flex: 1,
    top: 90,
    alignItems: 'flex-end',
    right: 20,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.9,
    padding: height * 0.01,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 10,
  },
  modalTitle: {
    fontSize: width * 0.06,
    fontWeight: '400',
    fontFamily: 'Mulish-Bold',
    marginBottom: height * 0.02,
    paddingLeft: 10,
    color: '#000',
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: height * 0.02,
  },
  genreButton: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    fontFamily: 'Mulish-Regular',
    borderColor: '#1777FF',
    margin: width * 0.02,
  },
  selectedGenreButton: {
    borderColor: '#007BFF',
    borderWidth: 2,
    elevation: 12,
  },
  genreText: {
    fontSize: width * 0.04,
    fontFamily: 'Mulish-Bold',
    color: '#1777FF',
  },
  selectedGenreText: {
    color: '#000',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
  },
  cancelButtonMain: {
    backgroundColor: '#fff',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    borderRadius: 25,
    elevation: 10,
  },
  cancelButton: {
    fontSize: width * 0.04,
    fontFamily: 'Mulish-Regular',
    color: '#000',
  },
  applyButtonMain: {
    backgroundColor: '#1777FF',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    borderRadius: 25,
    elevation: 10,
  },

  applyButton: {
    fontSize: width * 0.04,
    fontFamily: 'Mulish-Regular',
    color: '#fff',
  },

  header_box: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: height * 0.01,
  },

  sectionContainer: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: width * 0.025,
  },
  sectionTitle1: {
    fontSize: width * 0.055,
    fontWeight: '800',
    color: '#000',
    marginLeft: width * 0.05,
    marginVertical: height * 0.015,
  },
  long_arrow_right: {
    padding: width * 0.05,
  },
  sectionTitle: {
    fontSize: width * 0.06,
    fontWeight: '800',
    color: '#000',
    marginLeft: width * 0.05,
    marginBottom: height * 0.02,
    marginTop: height * 0.02,
  },

  bookCard: {
    // flex: 1,
    margin: width * 0.025,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderColor: '#1777FF',
    borderWidth: 1,
    // paddingVertical: height * 0.03,
    backgroundColor: '#fff',
    paddingBottom: 10,
  },

  bookCardNewBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBox: {
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

  bookImage: {
    width: 170,
    height: 190,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'cover',
    overflow: 'hidden',
  },
  bookTitle: {
    fontSize: width * 0.042,
    fontFamily: 'Mulish-Bold',
    color: '#000',
    textAlign: 'center',
    maxWidth: width * 0.4,
    height: height * 0.03,
    overflow: 'hidden',
  },
  AutherName: {
    fontSize: width * 0.036,
    color: '#8D8D8D',
    fontFamily: 'Mulish-Regular',
    textAlign: 'center',
    maxWidth: width * 0.35,
    height: height * 0.03,
    marginVertical: height * 0.005,
    overflow: 'hidden',
  },
  iconButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginTop: 5,
  },

  iconButton: {
    backgroundColor: '#1777FF',
    // padding: 8,
    height: height * 0.045,
    width: width * 0.12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: height * 0.005,
    paddingHorizontal: width * 0.07,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: width * 0.034,
  },

  noBooksContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  noBooksImage: {
    width: width * 0.9,
    height: height * 0.4,
    resizeMode: 'cover',
  },
});

export default DisplayBookByPagination;
