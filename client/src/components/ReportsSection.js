import React, { useEffect, useState } from "react";
import ReportView from "./ReportView";
import axios from "axios";
import { sortIntoCategories } from "../helpers";
import useInterval from "../hooks/useInterval";

const API_URL = `/api/reports`;

const ReportsSection = () => {
  const [allSales, setAllSales] = useState(new Map());
  const [allStocks, setAllStocks] = useState(new Map());
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    console.log("Fetching latest data");
    const res = await axios.get(API_URL);
    const sorted = sortIntoCategories(res.data);
    setAllSales(sorted.to);
    setAllStocks(sorted.from);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useInterval(fetchData, 30000);

  return <ReportView isLoading={loading} sales={allSales} stocks={allStocks} />;
};

export default ReportsSection;
