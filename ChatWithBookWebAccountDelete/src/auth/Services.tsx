import axiosInstance from "../Interceptor/Interceptor";
import { GoogleUserDetails } from "./Interface";
import { LoginFormData } from "./Validations";

export const loginUser = async (formData: LoginFormData) => {
  try {
    const response = await axiosInstance.post('/askpdf/api/auth/login/', formData); 
    return response;   
  } catch (error) {
    throw error;  
  }
};


export const SignUpUser = async (formData: any) => {
  try {
    const response = await axiosInstance.post('/api/register', formData); 
    return response;   
  } catch (error) {
    throw error;  
  }
};

export const VerifyUserByEmail = async (formData: any) => {
  try {
    const response = await axiosInstance.post('/api/verify-user', formData); 
    return response;   
  } catch (error) {
    throw error;  
  }
};

export const googleLoginService = async (formData: GoogleUserDetails) => {
  try {
    const response = await axiosInstance.post('/api/google_login', formData);
    return response;  
  } catch (error) {
    throw error;
  }
};

export const LogoutUserAndAdmin = async () => {
  try {
    const response = await axiosInstance.post('/api/logout');
    return response;  
  } catch (error) {
    throw error;
  }
};


interface ValidateInvitationParams {
  token: string | null;
  moderator_id: string | null;
  email: string | null;
}

export const ValidateInvitation = async (params: ValidateInvitationParams) => {
  try {
    const response = await axiosInstance.get("/api/validate-invitation", {
      params: {
        token: params.token,
        moderator_id: params.moderator_id,
        email: params.email,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};