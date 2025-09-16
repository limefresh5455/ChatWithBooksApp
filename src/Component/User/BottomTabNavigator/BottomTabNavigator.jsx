import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DisplayAllBook from '../DisplayAllBook/DisplayAllBook';
import Subscription from '../Subscription/Subscription';
import UserLibrary from '../UserLibrary/UserLibrary';
import UserProfile from '../UserProfile/UserProfile';
import DisplayBookByPagination from '../DisplayBookByPagination/DisplayBookByPagination';

import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import TransactionHistory from '../Payment/TransactionHistory';
import PurchaseBookInfo from '../Payment/PurchaseBookInfo';
import FreeChat from '../Chat/FreeChat';
// import Chat from '../Chat/Chat';
// import DisplayPdf from '../DisplayPdf/DisplayPdf';

const Tab = createBottomTabNavigator();
const {width} = Dimensions.get('window');

const BottomTabNavigator = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: keyboardVisible ? {display: 'none'} : styles.tabBar,
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#000',
          tabBarLabelStyle: {display: 'none'},
        }}>
        <Tab.Screen
          name="DisplayAllBook"
          component={DisplayAllBook}
          options={{
            tabBarIcon: ({focused}) => (
              <IconWrapper focused={focused}>
                <AntDesign
                  name="home"
                  size={26}
                  style={[{color: focused ? '#1777FF' : '#000'}]}
                />
              </IconWrapper>
            ),
          }}
        />

           <Tab.Screen
          name="FreeChatBot"
          component={FreeChat}
          options={{
            tabBarIcon: ({focused}) => (
              <IconWrapper focused={focused}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={26}
                  style={[{color: focused ? '#1777FF' : '#000'}]}
                />
              </IconWrapper>
            ),
          }}
        />

        <Tab.Screen
          name="Library"
          component={UserLibrary}
          options={{
            tabBarIcon: ({focused}) => (
              <IconWrapper focused={focused}>
                <AntDesign
                  name="book"
                  size={26}
                  style={[{color: focused ? '#1777FF' : '#000'}]}
                />
              </IconWrapper>
            ),
          }}
        />

        <Tab.Screen
          name="Subscription"
          component={Subscription}
          options={{
            tabBarButton: () => null,
          }}
        />

        <Tab.Screen
          name="DisplayBookByPagination"
          component={DisplayBookByPagination}
          options={{
            tabBarButton: () => null,
          }}
        />

        <Tab.Screen
          name="TransactionHistory"
          component={TransactionHistory}
          options={{
            tabBarButton: () => null,
          }}
        />

        <Tab.Screen
          name="PurchaseBooks"
          component={PurchaseBookInfo}
          options={{
            tabBarButton: () => null,
          }}
        />

     

        <Tab.Screen
          name="Profile"
          component={UserProfile}
          options={{
            tabBarIcon: ({focused}) => (
              <IconWrapper focused={focused}>
                <Ionicons
                  name="person-outline"
                  size={26}
                  style={[{color: focused ? '#1777FF' : '#000'}]}
                />
              </IconWrapper>
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const IconWrapper = ({focused, children}) => {
  return (
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#1777FF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // elevation: 10,
    paddingTop: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  iconContainer: {
    height: width * 0.12,
    width: width * 0.12,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  activeIconContainer: {
    backgroundColor: '#fff',
  },
});

export default BottomTabNavigator;
