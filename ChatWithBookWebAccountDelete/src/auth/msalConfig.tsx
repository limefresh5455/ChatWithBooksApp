 
import { PublicClientApplication, Configuration } from "@azure/msal-browser";

const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_MSAI_CLIENT_ID,  
    authority: import.meta.env.VITE_MSAI_TENANT_ID, // or your tenant ID
    redirectUri: import.meta.env.VITE_MSAI_DEPLOY_REDIRECT_URL,  // Or your deployed URL
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
