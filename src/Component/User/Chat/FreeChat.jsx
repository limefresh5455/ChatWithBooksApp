// import {
//   useFocusEffect,
//   useNavigation,
//   useRoute,
// } from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';

import Orientation from 'react-native-orientation-locker';
// import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {UserChatBotFreeService} from '../UserService/UserService';
import ChatLoader from '../../Pages/Loading/ChatLoader';
// import Tts from 'react-native-tts';
import {SafeAreaView} from 'react-native-safe-area-context';
import ReadingDoc from './ReadingDoc';

const {width, height} = Dimensions.get('window');

// const languages = [
//   'English',
//   'Hindi',
//   'Gujarati',
//   'Marathi',
//   'Bengali',
//   'Telugu',
//   'Tamil',
//   'Kannada',
//   'Odia',
//   'Malayalam',
// ];

const FreeChat = () => {
  //   const [showLanguages, setShowLanguages] = useState(false);
  //   const [language, setLanguage] = useState('English');
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
text: "Hello! 😊 I’m your free AI chatbot. How can I help you today?",
      sender: 'bot',
      isLoading: false,
    },
  ]);

  const [questionsShown, setQuestionsShown] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef();
//   const [speakingMessageId, setSpeakingMessageId] = useState(null);
//   const [showSpeaker, setShowSpeaker] = useState(false);
  const [marginBottomValue, setMarginBottomValue] = useState(0);

  const isAndroid = Platform.OS === 'android';
  const androidVersion = isAndroid ? Platform.Version : null;

  const keyboardBehavior =
    Platform.OS === 'ios'
      ? 'padding'
      : androidVersion >= 35
      ? 'height'
      : undefined;

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 90 : 0;
  const inputBottom = isAndroid ? (androidVersion >= 35 ? 50 : 70) : 0;

  useEffect(() => {
    setMarginBottomValue(0);
  }, []),
    useEffect(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
        if (isAndroid) {
          if (androidVersion >= 35) {
            setMarginBottomValue(-50);
          } else {
            setMarginBottomValue(-70);
          }
        }
      });

      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        if (isAndroid) {
          if (androidVersion >= 35) {
            setMarginBottomValue(-20);
          } else {
            setMarginBottomValue(10);
          }
        }
      });

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, [isAndroid, androidVersion]);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  //   const handleLanguageSelect = selectedLanguage => {
  //     setLanguage(selectedLanguage);
  //     setShowLanguages(false);
  //   };

  const [inputHeight, setInputHeight] = useState(60); // Initial height

  const handleContentSizeChange = (contentWidth, contentHeight) => {
    if (contentHeight <= 120) {
      setInputHeight(contentHeight); // Adjust height based on content (for up to 5 lines)
    } else {
      setInputHeight(120);
    }
  };

 
  const handleSendMessage = async () => {
    setInputHeight(60);
    if (!questionsShown) setQuestionsShown(true);

    if (userInput.trim()) {
      const generateUniqueId = () =>
        Date.now() + Math.floor(Math.random() * 1000);

      // Add user message locally
      const newMessage = {
        id: generateUniqueId(),
        text: userInput,
        sender: 'user',
        isLoading: false,
      };
      setMessages(prev => [...prev, newMessage]);
      setUserInput('');
      setIsSending(true);

      // Build API history (last 4 messages)
      const history = messages.slice(-4).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

     
      const payload = {
        query: userInput,
        history,
      };

      try {
        // Add placeholder bot message (loading)
        const botMessage = {
          id: generateUniqueId(),
          text: '',
          sender: 'bot',
          isLoading: true,
        };
        setMessages(prev => [...prev, botMessage]);

 
        const response = await UserChatBotFreeService(payload);

        if (response.data?.reply) {
            // console.log(response.data?.reply,"response.data?.reply")
   
          setMessages(prev => {
            const lastMsg = prev[prev.length - 1];
            return [
              ...prev.slice(0, -1),
              {...lastMsg, text: response.data.reply, isLoading: false},
            ];
          });
        //   setShowSpeaker(true);
        }
      } catch (error) {
        console.log('Chat API error:', error);
        // setShowSpeaker(false);

        setMessages(prev => {
          const lastMsg = prev[prev.length - 1];
          return [
            ...prev.slice(0, -1),
            {
              ...lastMsg,
              isLoading: false,
              text: 'Something went wrong. Please try again.',
            },
          ];
        });
      } finally {
        setIsSending(false);
      }
    }
  };

//   useFocusEffect(
//     useCallback(() => {
//       Tts.stop();
//       setSpeakingMessageId(null);
//       return () => {
//         Tts.stop();
//         setSpeakingMessageId(null);
//       };
//     }, []),
//   );

//   useEffect(() => {
//     const finishListener = Tts.addEventListener('tts-finish', () => {
//       setSpeakingMessageId(null);
//     });
//     return () => {
//       Tts.stop();
//       setSpeakingMessageId(null);
//       finishListener.remove();
//     };
//   }, []);

//   const speakText = async (text, id) => {
//     try {
//       await Tts.getInitStatus();
//       Tts.stop();
//       await Tts.setDefaultLanguage('hi-IN');
//       if (speakingMessageId === id) {
//         setSpeakingMessageId(null);
//         return;
//       }
//       setSpeakingMessageId(id);
//       setTimeout(() => {
//         Tts.speak(text);
//       }, 50);
//     } catch (error) {
//       console.log('TTS Initialization error:', error);
//     }
//   };

  const renderMessageItem = ({item: message}) => (
    <View
      style={[
        styles.chatContainer,
        message.sender === 'user' ? styles.userMessage : styles.botMessage,
      ]}
         onLayout={() => {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }}
      >
      {message.sender === 'bot' && (
        <Image
          source={require('../../../../assets/images/chaticon.png')}
          style={styles.avatar}
        />
      )}
      <View
        style={[
          styles.messageBox,
          message.sender === 'user'
            ? styles.userMessageBox
            : styles.botMessageBox,
        ]}>
        <ReadingDoc content={message.text.trim()} />

        {/* {message.sender === 'bot' && !message.isLoading && showSpeaker && (
          <TouchableOpacity
            onPress={() => speakText(message.text.trim(), message.id)}
            style={styles.speakerIcon}>
            <Icon
              name={
                speakingMessageId === message.id ? 'volume-high' : 'volume-mute'
              }
              size={24}
              color="#000"
            />
          </TouchableOpacity>
        )} */}

        {message.isLoading && <ChatLoader />}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={keyboardBehavior}
        keyboardVerticalOffset={keyboardVerticalOffset}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.chatContent}
              keyboardShouldPersistTaps="handled"
              renderItem={renderMessageItem}
              onContentSizeChange={() => {
                setTimeout(() => {
                  flatListRef.current?.scrollToEnd({animated: true});
                }, 100);
              }}
            
            />

            {/* Input Field with Language Options */}
            <View
              style={[
                styles.inputContainerBox,
                // {marginBottom: marginBottomValue, bottom: inputBottom},
                { bottom: marginBottomValue + inputBottom }, 
              ]}>
              
              {/* <View style={styles.languageContainer}>
                <TouchableOpacity
                  style={styles.languageButton}
                  onPress={() => setShowLanguages(!showLanguages)}>
                  <Text style={styles.languageText}>
                    Language:
                    <Text style={styles.Selectedlanguage}> {language} </Text>
                  </Text>
                  {showLanguages ? (
                    <AntDesign name="up" size={16} color="#000" />
                  ) : (
                    <AntDesign name="down" size={16} color="#000" />
                  )}
                </TouchableOpacity>
                {showLanguages && (
                  <FlatList
                    data={languages}
                    keyboardShouldPersistTaps="handled"
                    renderItem={renderLanguageItem}
                    keyExtractor={item => item}
                    numColumns={3}
                    columnWrapperStyle={styles.columnWrapper}
                    style={styles.languageList}
                  />
                )}
              </View> */}

              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Write here your question..."
                  placeholderTextColor="#000"
                  style={[
                      styles.textInput,
                    {height: Math.max(60, inputHeight)},
                  ]}
                  value={userInput}
                  onChangeText={setUserInput}
                  multiline={true}
                  scrollEnabled={inputHeight >= 120}
                  onContentSizeChange={e =>
                    handleContentSizeChange(
                      e.nativeEvent.contentSize.width,
                      e.nativeEvent.contentSize.height,
                    )
                  }
                />
                <TouchableOpacity
                  onPress={handleSendMessage}
                  disabled={isSending}
                  style={[styles.sendButton1]}>
                  <FontAwesome
                    name="send"
                    size={25}
                    color="#1777FF"
                    style={styles.sendIcon1}
                  />
                </TouchableOpacity>
              </View>
            
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: height * 0.01,
    paddingBottom: height * 0.01,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#1777FF',
    paddingHorizontal: width * 0.03,
    // elevation: 5,
  },
  backButton: {
    padding: width * 0.02,
  },
  headerTitle: {
    fontSize: width * 0.06,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Mulish-Bold',
    width: width * 0.5,
  },
  settingsIcon: {
    padding: width * 0.02,
  },
  icon: {
    width: width * 0.08,
    height: width * 0.08,
    resizeMode: 'cover',
  },
  chatContent: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.02,
    paddingBottom: 30 ,
  },
  chatContainer: {
    flexDirection: 'row',
    marginBottom: height * 0.035,
  },
  botMessage: {
    justifyContent: 'flex-start',
    // alignItems: 'center',
    flexDirection: 'row',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: width * 0.06,
    height: width * 0.06,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: width * 0.02,
    resizeMode: 'cover',
    elevation: 5,
  },
  messageBox: {
    padding: width * 0.02,
    borderRadius: width * 0.03,
    maxWidth: width * 0.75,
  },
  botMessageBox: {
    backgroundColor: '#fff',
    elevation: 5,
  },
  userMessageBox: {
    backgroundColor: '#E8E8E8',
    elevation: 5,
  },

  inputContainerBox: {
    // borderTopWidth: 1,
    // borderTopColor: '#1777FF',
    paddingVertical: height * 0.02,
    backgroundColor: '#fff',
    // position: 'absolute',
    width: '100%',
  },
  languageContainer: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
    paddingBottom: height * 0.01,
  },
  languageText: {
    fontSize: width * 0.04,
    color: '#000',
  },
  Selectedlanguage: {
    color: '#1777FF',
    fontFamily: 'Mulish-Bold',
  },

  languageList: {
    marginTop: height * 0.01,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  languageItem: {
    flex: 1,
    alignItems: 'center',
    padding: height * 0.02,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginHorizontal: width * 0.01,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  textInput: {
    flex: 1,
    // height: height * 0.07,
    borderColor: '#1777FF',
    borderWidth: 1,
    paddingLeft: width * 0.05,
    paddingRight: width * 0.19,
    paddingVertical: height * 0.025,
    fontSize: width * 0.04,
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: width * 0.08,
    elevation: 10,
  },
  textInput1: {
    flex: 1,
    // height: height * 0.07,
    borderColor: '#ABABAB',
    borderWidth: 1,
    paddingLeft: width * 0.05,
    paddingRight: width * 0.14,
    paddingVertical: height * 0.025,
    fontSize: width * 0.04,
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: width * 0.08,
    elevation: 10,
  },

  sendButton: {
    position: 'absolute',
    right: '5%',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.02,
    borderLeftWidth: 1,
    borderLeftColor: '#e8e9eb',
  },

  sendButton1: {
    position: 'absolute',
    right: '5%',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.03,
    borderLeftWidth: 1,
    borderLeftColor: '#ABABAB',
  },

  sendIcon: {
    width: width * 0.08,
    height: width * 0.08,
    resizeMode: 'cover',
  },

  sendIcon1: {
    resizeMode: 'cover',
    padding: width * 0.01, // Responsive padding
  },

  imagePreviewContainer: {
    width: '100%',
    position: 'relative',
    marginVertical: height * 0.01,
    marginBottom: height * 0.03,
    paddingHorizontal: width * 0.04,
  },
  imagePreview: {
    width: width * 0.4,
    height: height * 0.18,
    borderRadius: width * 0.02,
    borderColor: '#ABABAB',
    borderWidth: 2,
    resizeMode: 'contain',
  },
  removeImageButton: {
    position: 'absolute',
    top: -width * 0.03,
    left: width * 0.4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: width * 0.015,
    borderRadius: width * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.04,
  },
  fullImage: {
    width: '90%',
    height: '75%',
  },

  questionsScroll: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.02,
    marginBottom: height * 0.01,
  },
  questionButton: {
    backgroundColor: '#fff', // adjust as needed
    padding: height * 0.013, // adjust for responsiveness
    borderRadius: 20,
    marginHorizontal: width * 0.02, // adjust for responsiveness
    borderWidth: 2,
    borderColor: '#1777FF',
  },
  questionText: {
    fontSize: width * 0.04, // responsive font size based on screen width
    color: '#000', // adjust as needed
  },

  disabledButton: {
    opacity: 0.4,
    color: 'white',
  },

  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    borderColor: 'white',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FreeChat;
