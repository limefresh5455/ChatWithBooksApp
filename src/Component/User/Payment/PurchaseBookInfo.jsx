import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {API_URL} from '@env';
import {GetAllPurchageBookInfo} from '../UserService/UserService';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import BookLoading from '../../Pages/Loading/BookLoading';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width - 32; // 16 padding on each side

const PurchaseBookInfo = () => {
  const navigation = useNavigation();
  const [PurchageBookInfo, setPurchageBookInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useFocusEffect(
    useCallback(() => {
      const getPurchageBookInfo = async () => {
        try {
          setLoading(true);
          const response = await GetAllPurchageBookInfo();
          if (response.status === 200 || response.status === 201) {
            setLoading(false);
            setPurchageBookInfo(response.data);
          }
        } catch (error) {
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
          console.log('Error fetching getPurchageBookInfo', error.response);
        } finally {
          setLoading(false);
        }
      };
      getPurchageBookInfo();
    }, []),
  );

  const formatDate = dateString => {
    const options = {year: 'numeric', month: 'short', day: 'numeric'};
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getSubscriptionStatus = endDate => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return {
        status: 'Active',
        daysLeft: `${diffDays} days left`,
        badgeStyle: styles.activeBadge,
      };
    } else {
      return {
        status: 'Expired',
        daysLeft: 'Subscription ended',
        badgeStyle: styles.expiredBadge,
      };
    }
  };

  const renderItem = ({item}) => {
    const subscriptionStatus = getSubscriptionStatus(item.end_date);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Chat', {book: item.book})}>
        <View style={styles.cardRow}>
          {/* Book Image */}
          <Image
            source={{uri: `${API_URL}${item.book.image}`}}
            style={styles.bookImage}
          />

          {/* Middle Content */}
          <View style={styles.middleContent}>
            <View style={styles.topRow}>
              <View style={styles.bookInfo}>
                <Text style={styles.titleText} numberOfLines={2}>
                  {item.book.name}
                </Text>
                <Text style={styles.authorText} numberOfLines={1}>
                  by {item.book.author_name}
                </Text>
                <View style={styles.genreBadge}>
                  <Text style={styles.genreText}>{item.book.book_genre}</Text>
                </View>
              </View>
              <View style={styles.bookInfo}>
                <View
                  style={[styles.statusBadge, subscriptionStatus.badgeStyle]}>
                  <Text style={styles.statusText}>
                    {subscriptionStatus.status}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.daysLeftText,
                    subscriptionStatus.status === 'Active'
                      ? styles.activeText
                      : styles.expiredText,
                  ]}>
                  {subscriptionStatus.daysLeft}
                </Text>
                <Text style={styles.priceText}>₹{item.price}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Subscription Details */}
        <View style={styles.subscriptionContainer}>
          <View style={styles.subscriptionRow}>
            <Text style={styles.detailLabel}>Plan</Text>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailLabel}>Start</Text>
            <Text style={styles.detailLabel}>End</Text>
          </View>
          <View style={styles.subscriptionRow}>
            <Text style={styles.detailValue}>{item.plan_type}</Text>
            <Text style={styles.detailValue}>{item.duration}</Text>
            <Text style={styles.detailValue}>
              {formatDate(item.start_date)}
            </Text>
            <Text style={styles.detailValue}>{formatDate(item.end_date)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../../../assets/images/Background-Image.png')}
        style={styles.backgroundImage}
      />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Profile')}>
          <Icon name="arrow-back" size={24} color="#1777FF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>📚 Purchased Books</Text>
        <View style={{width: 32}} />
      </View>
      <FlatList
        data={PurchageBookInfo}
        renderItem={renderItem}
        keyExtractor={item => item.book.uuid}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              source={require('../../../../assets/images/no-transection.png')}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>
              You haven't purchased any books yet.
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('Home')}>
              <Text style={styles.browseButtonText}>Browse Books</Text>
            </TouchableOpacity>
          </View>
        }
      />
      {loading && <BookLoading />}
    </SafeAreaView>
  );
};

export default PurchaseBookInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.3,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'Mulish-Bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 70,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    width: CARD_WIDTH,
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  middleContent: {
    flex: 1,
    marginLeft: 12,
  },
  topRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bookImage: {
    width: 60,
    height: 85,
    borderRadius: 6,
    marginRight: 12,
  },
  bookInfo: {
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  rightSection: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  titleText: {
    fontSize: 14,
    fontFamily: 'Mulish-Bold',
    color: '#222',
    marginBottom: 2,
    lineHeight: 18,
  },
  authorText: {
    fontSize: 12,
    color: '#555',
    fontFamily: 'Mulish-Regular',
    marginBottom: 6,
  },
  genreBadge: {
    backgroundColor: '#e8f0fe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  genreText: {
    fontSize: 11,
    color: '#1a73e8',
    fontFamily: 'Mulish-SemiBold',
  },
  subscriptionContainer: {
    paddingVertical: 8,
    borderTopWidth: 0.2,
    borderColor: '#646464ff',
  },

  subscriptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  subscriptionDetail: {
    flex: 1,
    flexDirection: 'row',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
    fontFamily: 'Mulish-Regular',
  },
  detailValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Mulish-SemiBold',
    color: '#333',
  },
  priceText: {
    fontSize: 14,
    fontFamily: 'Mulish-Bold',
    color: '#1a8d3b',
    textAlign: 'right',
    marginBottom: 4,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#1bc47d',
  },
  expiredBadge: {
    backgroundColor: '#c62828',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Mulish-Bold',
    textAlign: 'right',
    color: '#fff',
  },
  daysLeftText: {
    fontSize: 11,
    fontFamily: 'Mulish-SemiBold',
    textAlign: 'right',
  },
  activeText: {
    color: '#1bc47d',
  },
  expiredText: {
    color: '#c62828',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
    resizeMode: 'contain',
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'Mulish-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#1777FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontFamily: 'Mulish-Bold',
    fontSize: 16,
  },
});
