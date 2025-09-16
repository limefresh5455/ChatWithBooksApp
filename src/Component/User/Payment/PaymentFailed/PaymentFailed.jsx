import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const PaymentSuccess = ({ route, navigation }) => {
  const { orderId, transactionId, planType, duration, price } = route.params;

 
  return (
    <LinearGradient
      colors={['#e6f0ff', '#f4f9ff', '#ffffff']}
      style={styles.container}
    >
      <Animatable.View animation="zoomIn" duration={800} style={styles.contentContainer}>
        {/* Success Icon */}
        <Animatable.Image
          animation="bounceIn"
          duration={1000}
          source={require('../../../../../assets/images/paymentFailed.png')}
          style={styles.successImage}
          resizeMode="contain"
        />

        {/* Title */}
        <Animatable.Text animation="fadeInUp" duration={800} delay={200} style={styles.title}>
          Payment Failed!
        </Animatable.Text>

        {/* Details Card */}
        <Animatable.View animation="fadeInUp" duration={800} delay={400} style={styles.card}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Order ID:</Text>
            <Text style={styles.value}>{orderId || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Transaction ID:</Text>
            <Text style={styles.value}>{transactionId || 'N/A'}</Text>
          </View>
          {planType && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Plan:</Text>
              <Text style={styles.value}>{planType} ({duration})</Text>
            </View>
          )}
          {price && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Amount:</Text>
              <Text style={styles.value}>₹{price}</Text>
            </View>
          )}
        </Animatable.View>

        {/* Button */}
        <Animatable.View animation="fadeInUp" duration={800} delay={600}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('TransactionHistory')}
            activeOpacity={0.8}
            accessibilityLabel="Go to Library"
            accessibilityRole="button"
          >
            <LinearGradient
              colors={['#1777FF', '#1777FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Check Payment Status</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>
    </LinearGradient>
  );
};

export default PaymentSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05, 
    paddingVertical: height * 0.02,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  successImage: {
    width: width * 0.30,
    height: width * 0.30,
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: '700',
     color: '#1777FF',
    textAlign: 'center',
    marginBottom: height * 0.03,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: width * 0.05,
    width: '100%',
    marginBottom: height * 0.03,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: height * 0.01,
  },
  label: {
    fontSize: width * 0.04, // ~14-16px
    color: '#555',
    fontWeight: '500',
  },
  value: {
    fontSize: width * 0.04,
    color: '#333',
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  button: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonGradient: {
    width: width * 0.85, // 85% of screen width
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
 
});