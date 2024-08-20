// Context.js
import React, { createContext, useState } from 'react';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [isOn, setIsOn] = useState(false);

  const toggleOnOff = () => {
    setIsOn((prevState) => !prevState);
  };

  return <EventContext.Provider value={{ toggleOnOff, isOn }}>{children}</EventContext.Provider>;
};

export default EventContext;
