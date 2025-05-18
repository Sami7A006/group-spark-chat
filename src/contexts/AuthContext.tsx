
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "../types";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const MOCK_USERS = [
  { id: "1", username: "demo", email: "demo@example.com", password: "password", avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=Demo" },
  { id: "2", username: "john", email: "john@example.com", password: "password", avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=John" }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
    } else {
      throw new Error("Invalid email or password");
    }
    
    setIsLoading(false);
  };

  // Mock signup function
  const signUp = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const userExists = MOCK_USERS.some(u => u.email === email);
    
    if (userExists) {
      setIsLoading(false);
      throw new Error("Email already in use");
    }
    
    // Create new user
    const newUser = {
      id: `${MOCK_USERS.length + 1}`,
      username,
      email,
      avatar: `https://api.dicebear.com/6.x/avataaars/svg?seed=${username}`
    };
    
    MOCK_USERS.push({ ...newUser, password });
    
    setCurrentUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    signUp,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
