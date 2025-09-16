import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import AuthContextComponent from "./ContextApi/AuthContext/AuthContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
 
 

createRoot(document.getElementById("root")!).render(
  <StrictMode>
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
 
    <AuthContextComponent>
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </AuthContextComponent>
    
  </GoogleOAuthProvider>
  </StrictMode>
);
