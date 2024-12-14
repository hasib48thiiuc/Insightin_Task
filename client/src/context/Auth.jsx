import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage on component mount
    const savedUser = JSON.parse(localStorage.getItem("user")); // Correct key
    if (savedUser) {
      setUser(savedUser); // Set the full user object
    }
  }, []);

  const login = async (userData) => {
    try {
      console.log("User data in login:", userData);
      setUser(userData); // Set the entire user object
      localStorage.setItem("user", JSON.stringify(userData)); // Save the user object
      localStorage.setItem("token", JSON.stringify(userData)); // Save the user object

      console.log("User logged in successfully.");
    } catch (error) {
      console.error("Error logging in user:", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Clear the user data on logout
    console.log("User logged out successfully.");
    Cookies.remove("access_token");
    localStorage.removeItem("token");  // or
     document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
