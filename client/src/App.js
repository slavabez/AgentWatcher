import React, { useState, useEffect, useRef } from "react";
import ioClient from "socket.io-client";
import styled from "styled-components";

import ReportView from "./ReportView";

const AppWrapper = styled.div`
  font-family: "Roboto", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const socket = ioClient.connect();
socket.on("connect", () => {
  console.log("Connected");
});

function App() {

  const [allSales, setAllSales] = useState(new Map());
  const [allStocks, setAllStocks] = useState(new Map());

  const handleSalesAdd = (s) => {
    const sales = allSales;
    sales.set(`${s.name}-${s.type}`, s);
    setAllSales(sales);
  };

  useEffect(() => {
    try {

      socket.on("report.all", r => {
        const sales = new Map();
        const stocks = new Map();
        r.forEach(r => {
          if (r.type === 2) {
            // "To", i.e. sale
            sales.set(`${r.name}-${r.type}`, r);
          } else if (r.type === 1) {
            stocks.set(`${r.name}-${r.type}`, r);
          }
        });
        setAllSales(sales);
        setAllStocks(stocks);
      });

      socket.on("report.added.to", r => {
        console.log(`TO report added`, r);
        handleSalesAdd(r);
      });

      socket.on("report.added.from", r => {
        console.log("FROM report added", r);
        allStocks.set(`${r.name}-${r.type}`, r);
        setAllStocks(allStocks);
      });

      socket.on("report.deleted.to", r => {
        console.log("TO report deleted", r);
        allSales.delete(`${r.name}-${r.type}`);
        setAllSales(allSales);
      });

      socket.on("report.deleted.from", r => {
        console.log("FROM report deleted", r);
        allStocks.delete(`${r.name}-${r.type}`);
        setAllStocks(allStocks);
      });

      socket.emit("report.all");
    } catch (e) {
      console.error("Error connecting to the server");
    }

    return () => {
      socket.close();
    };
  }, []);

  console.log("render");

  return (
    <AppWrapper>
      <h1>Файлы обмена с Агент Плюс</h1>
      <ReportView sales={allSales} stocks={allStocks} />
    </AppWrapper>
  );
}



export default App;
