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
import {GetTransectionStatusApi} from '../UserService/UserService';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import BookLoading from '../../Pages/Loading/BookLoading';

const {width} = Dimensions.get('window');

const TransactionHistory = () => {
  const navigation = useNavigation();
  const [TransactionDetails, setTransactionDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const getTransactionHistory = async () => {
        try {
          setLoading(true);
          const response = await GetTransectionStatusApi();
          if (response.status === 200 || response.status === 201) {
            setLoading(false);
            setTransactionDetails(response.data);
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
          console.log('Error fetching getTransactionHistory', error.response);
        } finally {
          setLoading(false);
        }
      };
      getTransactionHistory();
    }, []),
  );

  const renderItem = ({item}) => (
    <View style={styles.card}>
      {/* Top Row with Order ID */}
      <View style={styles.topHeader}>
        <Text style={styles.orderIdText}>Order ID: {item.Order_ID}</Text>
      </View>

      <View style={styles.cardRow}>
        {/* Book Image */}
        <Image
          source={{uri: `${API_URL}${item.bookImage}`}}
          style={styles.bookIcon}
        />

        {/* Middle Content */}
        <View style={styles.middleContent}>
          <Text style={styles.titleText}>{item.bookName}</Text>
          <Text style={styles.subtitleText}>
            Transaction ID: {item.TransactionId}
          </Text>
          <Text style={styles.subtitleText}>Duration: {item.duration}</Text>
        </View>

        {/* Right Content */}
        <View style={styles.rightContent}>
          <Text style={styles.priceText}>₹{item.price}</Text>
          <View
            style={[
              styles.statusBadge,
              item.paymentStatus === 'Successful'
                ? styles.success
                : item.paymentStatus === 'Pending'
                ? styles.pending
                : styles.failed,
            ]}>
            <Text style={styles.statusText}>{item.paymentStatus}</Text>
          </View>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>
    </View>
  );

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
        <Text style={styles.headerText}> Transaction History</Text>
        <View style={{width: 32}} />
      </View>
      <FlatList
        data={TransactionDetails}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.TransactionId + index}
        contentContainerStyle={{paddingBottom: 70, flexGrow: 1}}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              source={require('../../../../assets/images/no-transection.png')}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        }
      />
      {loading && <BookLoading />}
    </SafeAreaView>
  );
};

export default TransactionHistory;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 18,
    fontFamily:'Mulish-Bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 25,
    width: width * 0.92,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 6,
  },

  orderIdText: {
    fontSize: 12,
    fontFamily:'Mulish-Bold',
    color: '#999',
  },

  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#EAF1FB',
    marginRight: 12,
  },
  middleContent: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 14,
    fontFamily:'Mulish-Bold',
    color: '#222',
    marginBottom: 2,
  },
  subtitleText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 1,
     fontFamily:'Mulish-SemiBold',
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a8d3b',
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
   
  },
  statusText: {
    fontSize: 10,
    fontFamily:'Mulish-Bold',
    color: '#fff',
  },
  success: {
    backgroundColor: '#1bc47d',
  },
  pending: {
    backgroundColor: '#f9a825',
  },
  failed: {
    backgroundColor: '#c62828',
  },
  dateText: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
    fontFamily:'Mulish-Bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },

  emptyText: {
    fontSize: 16,
    color: '#888',
    fontFamily:'Mulish-Regular',
  },

  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 12,
    resizeMode: 'contain',
  },
});
