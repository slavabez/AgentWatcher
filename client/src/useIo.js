import { useState, useEffect } from "react";
import io from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState(
    io.connect(`http://localhost:5000`, {
      autoConnect: false,
      transports: ["websocket"]
    })
  );
  useEffect(() => {
    return () => {
      socket.removeAllListeners();
      socket.close();
    };
  }, [socket]);
  return [socket, setSocket];
};

export default useSocket;
