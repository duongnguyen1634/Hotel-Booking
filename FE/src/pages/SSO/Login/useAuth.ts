import { useContext } from "react";
import AuthContext from "./authContext";
import { AuthContextType } from "./authContext";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};