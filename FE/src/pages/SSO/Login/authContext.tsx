import React, { createContext, useState, useEffect } from "react";
import { User, AuthTokens } from "../../../types";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export interface AuthContextType {
  user: User | null;
  authTokens: AuthTokens | null;
  loginUser: (email: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: JSX.Element | JSX.Element[];
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() =>
    JSON.parse(localStorage.getItem("authTokens") || "null")
  );

  const isTokenExpired = (token: string) => {
    const decoded: any = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp < now;
  };

  useEffect(() => {
    if (authTokens && !isTokenExpired(authTokens.access)) {
      const decodeUser = jwtDecode<any>(authTokens.access);
      const userMapped: User = {
        user_id: decodeUser.user_id,
        email: decodeUser.email,
        role: decodeUser.role,
        hotel_id: decodeUser.hotel_id || null,
      };
      setUser(userMapped);
    } else {
      logoutUser();
    }
  }, [authTokens]);

  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/sso/login/", { email, password });
      if (response.data.success) {
        const token = response.data.tokens;
        setAuthTokens(token);
        const decodeUser = jwtDecode<any>(token.access);
        const userMapped: User = {
          user_id: decodeUser.user_id,
          email: decodeUser.email,
          role: decodeUser.role,
          hotel_id: decodeUser.hotel_id || null,
        };
        setUser(userMapped);
        localStorage.setItem("authTokens", JSON.stringify(token));
        localStorage.setItem("user", JSON.stringify(userMapped));
        return true;
      }
    } catch (error) {
      console.error("Login error:", error);
    }
    return false;
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, authTokens, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;