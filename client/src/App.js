import React, { useState, useEffect } from 'react';
import ioClient from "socket.io-client";
import logo from './logo.svg';
import './App.css';

function App() {

  useEffect(() => {
    const socket = ioClient.connect();
    socket.on("connect", () => {
      console.log(`We got a connection`);
    });

    socket.on("report.all", r => {
      console.log(`Got some reports:`, r);
    });

    socket.emit("report.all");
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
