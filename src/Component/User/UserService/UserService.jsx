import axiosInstance from '../../Interceptor/Interceptor';

export const getUserProfileService = async () => {
  try {
    const res = await axiosInstance.get(`/askpdf/api/profile/getUser-profile/`);
    return res;
  } catch (error) {
    console.log('Error fetching getUserProfile:', error);
    throw error;
  }
};

export const updateUserProfileService = async formData => {
  try {
    const res = await axiosInstance.patch(
      `/askpdf/api/profile/updateUser-image/`,
      formData,
    );
    return res;
  } catch (error) {
    console.log('Error fetching updateUserProfile:', error);
    throw error;
  }
};

export const UserChatBotService = async formData => {
  try {
    const res = await axiosInstance.post(`/api/conversation/`, formData);

    return res;
  } catch (error) {
    console.log('Error fetching UserChatBotService:', error);
    throw error;
  }
};


export const UserChatBotFreeService = async formData => {
  try {
    const res = await axiosInstance.post(`/askpdf/api/chat_with_student/`, formData);

    return res;
  } catch (error) {
    console.log('Error fetching UserChatBotFreeService:', error);
    throw error;
  }
};

export const GetAllBooks = async () => {
  try {
    const res = await axiosInstance.get(`/askpdf/api/get-books/`);
    return res;
  } catch (error) {
    console.log('Error fetching GetAllBooks:', error);
    throw error;
  }
};

export const GetAllBooksByPagination = async (page, search, genreQuery) => {
  try {
    console.log(page, 'page', search, 'search', genreQuery, 'genreQuery');
    const res = await axiosInstance.get(
      `/askpdf/api/search-books/?page=${page}&search=${search}&${genreQuery}`,
    );
    return res;
  } catch (error) {
    console.log('Error fetching GetAllBooksByPagination:', error);
    throw error;
  }
};

export const GetAllBookSubscription = async id => {
  try {
    const res = await axiosInstance.get(`/askpdf/api/book/${id}/`);
    return res;
  } catch (error) {
    console.log('Error fetching GetAllBookSubscription:', error);
    throw error;
  }
};

export const GetBooksByFilter = async genreQuery => {
  try {
    const res = await axiosInstance.get(
      `/askpdf/api/books/genres/?${genreQuery}`,
    );
    return res;
  } catch (error) {
    console.log('Error fetching GetBooksByFilter:', error);
    throw error;
  }
};

export const getTransactionCredentials = async formData => {
  try {
    const res = await axiosInstance.post(`/askpdf/api/initiate/`, formData);
    return res;
  } catch (error) {
    console.log('Error fetching getTransactionCredentials:', error);
    throw error;
  }
};

export const sendPaymentSuccess = async paymentDetails => {
  try {
    const res = await axiosInstance.post(
      `/askpdf/api/payment/payment_success/`,
      paymentDetails,
    );
    return res;
  } catch (error) {
    console.log('Error fetching sendPaymentSuccess:', error);
    throw error;
  }
};

export const sendPaymentFailed = async paymentDetails => {
  try {
    const res = await axiosInstance.post(
      `/askpdf/api/payment/payment_success/`,
      paymentDetails,
    );
    return res;
  } catch (error) {
    console.log('Error fetching sendPaymentSuccess:', error);
    throw error;
  }
};

export const checkstatusApi = async merchantTransactionId => {
  try {
    const res = await axiosInstance.get(
      `/askpdf/api/status/?merchantTransactionId=${merchantTransactionId}`,
    );
    return res;
  } catch (error) {
    console.log('Error fetching checkstatusApi:', error);
    throw error;
  }
};

export const GetTransectionStatusApi = async () => {
  try {
    const res = await axiosInstance.get(`/askpdf/api/transactions/`);
    return res;
  } catch (error) {
    console.log('Error fetching GetTransectionStatusApi:', error);
    throw error;
  }
};

export const GetAllPurchageBookInfo = async () => {
  try {
    const res = await axiosInstance.get(`/askpdf/api/purchased-books/`);
    return res;
  } catch (error) {
    console.log('Error fetching GetAllPurchageBookInfo:', error);
    throw error;
  }
};
