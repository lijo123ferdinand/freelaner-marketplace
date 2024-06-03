import React, { createContext, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  const login = (token) => {
    const decodedToken = jwtDecode(token);
    setAuth({
      token,
      user: decodedToken,
    });
  };

  const logout = () => {
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
