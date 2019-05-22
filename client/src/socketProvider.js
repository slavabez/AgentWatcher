import React, { useState, useEffect, Provider } from 'react';
import io from "socket.io-client";
import SocketContext from "./socketContext";

const SocketProvider = ({children}) => {

  useEffect(() => {

  }, []);

  return (
    <SocketContext.Provider value={}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
