import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import Toast from 'react-native-toast-message';
 
//  console.log(API_URL,"base Url")
 
const axiosInstance = axios.create({
  baseURL: API_URL,  
});

 
axiosInstance.interceptors.request.use(
  async config => {
      const userDataJson = await AsyncStorage.getItem('user_details');
      const userData = JSON.parse(userDataJson);
      const token = userData?.access_token;   
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }  
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    config.headers['Accept'] = 'application/json';
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

 
axiosInstance.interceptors.response.use(
  response => { 
    if ( response.status === 200 || response.status === 201) {
      return response;
    }
  },
  async error => {
    const {status} = error.response || {};
    const  message = error.response?.data?.error 
 
    if (status === 401) {
      throw error; 
    }else if(status === 404 ||status === 403 ||status === 409 ||status === 400){
      let errorMessage = 'An error occurred. Please try again.';
      switch (status) {
        case 400:
          errorMessage = message || 'Bad Request. Please check the input and try again.';
          break;
        case 403:
          errorMessage = message || 'Forbidden. You do not have permission to access this resource.';
          break;
        case 404:
          errorMessage = message || 'Not Found. The requested resource could not be found.';
          break;
        case 409:
          errorMessage = message || 'Conflict. There was a conflict with your request.';
          break;
      }
      Toast.show({ type: 'error',  text1: 'Error',  text1: errorMessage});
    }else{
      Toast.show({ type: 'error', text1: 'Server Error',  text2:  'An internal server error occurred. Please try again later.'  });
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
