import { createContext, useEffect, useState } from "react";
import axios from "../config/axios";

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get("/users/profile")
      .then((res) => {
        console.log("User restored:", res.data.user);
        setUser(res.data.user);
      })
      .catch((err) => {
        console.log(
          "Failed to restore user:",
          err.response?.data || err.message
        );

        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};