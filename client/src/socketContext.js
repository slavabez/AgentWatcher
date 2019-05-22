import React, {createContext} from "react";

const SocketContext = createContext({ toReports: [], fromReports: [] });

export default SocketContext;
