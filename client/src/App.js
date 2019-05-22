import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import styled from "styled-components";

import ReportView from "./ReportView";

const AppWrapper = styled.div`
  font-family: "Roboto", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const socket = io.connect();
socket.on("connect", () => {
  console.log("IO connected");
});

const subscribeToAllReports = (cb) => {
  socket.on("report.all", all => cb(all));
};

const subscribeToAddedTo = (cb) => {
  socket.on("report.added.to", newTo => cb(newTo));
};

const subscribeToAddedFrom = (cb) => {
  socket.on("report.added.from", newFrom => cb(newFrom));
};

const subscribeToRemovedTo = (cb) => {
  socket.on("report.deleted.to", removedTo => cb(removedTo));
};

const subscribeToRemovedFrom = (cb) => {
  socket.on("report.deleted.from", removedFrom => cb(removedFrom));
};

function App() {
  const [allSales, setAllSales] = useState(new Map());
  const [allStocks, setAllStocks] = useState(new Map());

  const handleAllReports = allReports => {
    console.log("All reports received", allReports);
    const sales = new Map();
    const stocks = new Map();
    allReports.forEach(r => {
      if (r.type === 2) {
        // "To", i.e. sale
        sales.set(`${r.name}-${r.type}`, r);
      } else if (r.type === 1) {
        stocks.set(`${r.name}-${r.type}`, r);
      }
    });
    setAllSales(sales);
    setAllStocks(stocks);
  };

  const handleToReportAdded = report => {
    console.log("TO Added", report, allSales);
    const sales = allSales;
    sales.set(`${report.name}-${report.type}`, report);
    setAllSales(sales);
  };

  const handleFromReportAdded = report => {
    console.log("FROM Added", report, allStocks);
    const stocks = allStocks;
    stocks.set(`${report.name}-${report.type}`, report);
    setAllStocks(stocks);
  };

  const handleToReportRemoved = report => {
    console.log("TO removed, ", report, allSales);
    const sales = allSales;
    sales.delete(`${report.name}-${report.type}`);
    setAllSales(sales);
  };

  const handleFromReportRemoved = report => {
    console.log("FROM removed, ", report, allStocks);
    const stocks = allStocks;
    stocks.delete(`${report.name}-${report.type}`);
    setAllStocks(stocks);
  };



  useEffect(() => {
    try {
      socket.open();
      socket.emit("report.all");

      subscribeToAllReports(handleAllReports);
      subscribeToAddedTo(handleToReportAdded);
      subscribeToAddedFrom(handleFromReportAdded);
      subscribeToRemovedTo(handleToReportRemoved);
      subscribeToRemovedFrom(handleFromReportRemoved);

    } catch (e) {
      console.error("Error connecting to the server");
    }

  }, []);

  console.log("App (re-)rendered");

  return (
    <AppWrapper>
      <h1>Файлы обмена с Агент Плюс</h1>
      <ReportView sales={allSales} stocks={allStocks} />
    </AppWrapper>
  );
}

export default App;
