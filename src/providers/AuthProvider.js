import { createContext } from "react";
import { useAuth } from "../hooks/useAuth";

export const context = createContext({ token: "", loading: true, error: "" });

const AuthProvider = ({ children }) => {
  const auth = useAuth();

  return <context.Provider value={auth}>{children}</context.Provider>;
};

export default AuthProvider;
