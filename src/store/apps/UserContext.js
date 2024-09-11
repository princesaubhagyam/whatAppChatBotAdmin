// UserContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    display_name: '',
    profile_pic: '',
    whatsApp_number: '',
    user_email: '',
    full_name: '',
  });

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
