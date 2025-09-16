import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';


interface AuthContextType {
  users: { [key: string]: any } | null; 
  setUsers: React.Dispatch<React.SetStateAction<{ [key: string]: any } | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
 
export const AuthProvider = createContext<AuthContextType | undefined>(undefined);


interface AuthContextProps {
  children: ReactNode;
}

const AuthContextComponent = ({ children }: AuthContextProps) => {
  const [users, setUsers] = useState<{ [key: string]: any } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = localStorage.getItem('UserData');
      
        if (userData) {
          setUsers(JSON.parse(userData));
        }
      } catch (error) {
        console.log('Failed to load user data', error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  return (
    <AuthProvider.Provider value={{ users, setUsers, loading, setLoading }}>
      {children}
    </AuthProvider.Provider>
  );
};

export default AuthContextComponent;

// Custom hook to use the Auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthProvider);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
