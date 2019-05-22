import React, { useState, useEffect } from "react";
import styled from "styled-components";

import useSocket from "./useIo";
import ReportView from "./ReportView";

const AppWrapper = styled.div`
  font-family: "Roboto", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function App() {
  const [allSales, setAllSales] = useState(new Map());
  const [allStocks, setAllStocks] = useState(new Map());
  const [socket] = useSocket();

  socket.on("connect", () => {
    console.log("Connected to IO");
  });

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

  socket.on("report.all", handleAllReports);
  socket.on("report.added.to", handleToReportAdded);
  socket.on("report.added.from", handleFromReportAdded);
  socket.on("report.deleted.to", handleToReportRemoved);
  socket.on("report.deleted.from", handleFromReportRemoved);

  useEffect(() => {
    console.log("Use-effect trigger");
    try {
      socket.open();
      socket.emit("report.all");
    } catch (e) {
      console.error("Error connecting to the server");
    }

    return(() => {
      socket.removeAllListeners();
      socket.stop();
    });
  }, [socket]);

  console.log("App (re-)rendered");

  return (
    <AppWrapper>
      <h1>Файлы обмена с Агент Плюс</h1>
      <ReportView sales={allSales} stocks={allStocks} />
    </AppWrapper>
  );
}

export default App;
