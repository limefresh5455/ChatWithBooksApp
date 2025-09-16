import React from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Privacy Policy for ChatWithBooks</Text>
      <Text style={styles.subtitle}>Last updated: October 23, 2024</Text>

      <Text style={styles.paragraph}>
        This Privacy Policy describes Our policies and procedures on the
        collection, use and disclosure of Your information when You use the
        Service and tells You about Your privacy rights and how the law protects
        You.
      </Text>

      <Text style={styles.paragraph}>
        We use Your Personal data to provide and improve the Service. By using
        the Service, You agree to the collection and use of information in
        accordance with this Privacy Policy. This Privacy Policy has been
        created with the help of the Free Privacy Policy Generator.
      </Text>

      <Text style={styles.sectionTitle}>Payment-Related Information</Text>

      <Text style={styles.paragraph}>
        We use the PhonePe SDK within our application to facilitate secure and
        seamless payment processing. When you make a payment through PhonePe,
        relevant data such as transaction ID, amount, and payment status may be
        shared with PhonePe solely for the purpose of completing the
        transaction. We do not collect or store sensitive financial information
        such as card numbers or UPI PINs. All payment-related information is
        handled in accordance with PhonePe’s privacy and security policies. By
        making a payment through our app, you consent to sharing necessary
        transaction details with PhonePe.
      </Text>

      <Text style={styles.paragraph}>
        If you experience any issues related to payment, such as failed
        transactions or incorrect deductions, please reach out to us at the
        email provided below. We will coordinate with PhonePe’s support team to
        help resolve your issue.
      </Text>
    </ScrollView>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 80,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  subtitle: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    color: 'black',
  },
  paragraph: {
    fontSize: 15,
    marginBottom: 10,
    lineHeight: 22,
    textAlign: 'justify',
    color: 'black',
  },
});
