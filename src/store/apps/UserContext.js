import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   // Load user data from local storage on initial load
  //   const storedUser = localStorage.getItem('user');
  //   console.log('Stored user data:', storedUser); // Debugging log
  //   if (storedUser) {
  //     try {
  //       setUser(JSON.parse(storedUser));
  //     } catch (error) {
  //       console.error('Failed to parse user data:', error);
  //       localStorage.removeItem('user'); // Optionally clear the invalid data
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) {
  //     try {
  //       const parsedUser = JSON.parse(storedUser);
  //       if (parsedUser.profile_pic) {
  //         localStorage.setItem('profile_pic', parsedUser.profile_pic);
  //       }
  //       setUser(parsedUser);
  //     } catch (error) {
  //       console.error('Failed to parse user data:', error);
  //       localStorage.removeItem('user');
  //     }
  //   }
  // }, []);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.profile_pic) {
          localStorage.setItem('profile_pic', parsedUser.profile_pic);
        }
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const setUserDetails = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return <UserContext.Provider value={{ user, setUserDetails }}>{children}</UserContext.Provider>;
};
