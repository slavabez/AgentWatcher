import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

import ReportView from "./ReportView";
import { sortIntoCategories } from "./helpers";
import useInterval from "./useInterval";

const API_URL = `/api/reports`;

const AppWrapper = styled.div`
  font-family: "Roboto", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Header = styled.div`
  width: 100%;
  text-align: center;
  background-color: rebeccapurple;
  color: white;
`;

function App() {
  const [allSales, setAllSales] = useState(new Map());
  const [allStocks, setAllStocks] = useState(new Map());

  const fetchData = async () => {
    console.log("Fetching latest data");
    const res = await axios.get(API_URL);
    const sorted = sortIntoCategories(res.data);
    setAllSales(sorted.to);
    setAllStocks(sorted.from);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useInterval(fetchData, 30000);

  console.log("App (re-)rendered");

  return (
    <AppWrapper>
      <Header>
        <h1>Файлы обмена с Агент Плюс</h1>
      </Header>
      <ReportView sales={allSales} stocks={allStocks} />
    </AppWrapper>
  );
}

export default App;
