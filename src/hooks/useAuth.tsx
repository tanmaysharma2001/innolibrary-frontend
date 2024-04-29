import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext();

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  const { toast } = useToast();

  // call this function when you want to authenticate the user
  const login = async (data: { username: string; password: string }) => {
    // setUser(data);
    // navigate("/library");
    try {
      const requestBody = {
        username: data.username,
        password: data.password,
      };

      const response = await fetch(`${VITE_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(`Error ${response.status}: ${res.detail}`);
      }

      const user = await response.json();

      toast({
        title: `Signin Successfull.`,
        description: `You will be redirected to your Library.`,
      });

      setUser(user);
      navigate("/library");
    } catch (error) {
      toast({
        title: `Login Error:`,
        variant: "destructive",
        description: `${(error as Error).message}`,
      });
    }
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  // Sign Up
  const signup = async (data: {
    username: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const requestBody = {
        username: data.username,
        password: data.password,
        confirm_password: data.confirmPassword,
      };

      const response = await fetch(`${VITE_BACKEND_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(`Error ${response.status}: ${res.detail}`);
      }

      const user = await response.json();

      toast({
        title: `Signup Successfull.`,
        description: `You will be redirected to your Login Page.`,
      });

      navigate("/login");
    } catch (error) {
      toast({
        title: `SignUp Error:`,
        variant: "destructive",
        description: `${(error as Error).message}`,
      });
    }
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      signup,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
