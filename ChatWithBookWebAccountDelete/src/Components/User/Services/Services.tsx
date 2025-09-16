import axiosInstance from "../../../Interceptor/Interceptor";

export const GetUserDetails = async () => {
  try {
    const response = await axiosInstance.get(
      "/askpdf/api/profile/getUser-profile/"
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteAccountService = async () => {
  try {
    const response = await axiosInstance.delete("/askpdf/api/auth/delete/");
    return response;
  } catch (error) {
    throw error;
  }
};
