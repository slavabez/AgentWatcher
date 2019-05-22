import React from "react";
import styled from "styled-components";

import ListItem from "./ListItem";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-around;
  align-items: flex-start;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;

  @media (min-width: 1024px) {
    width: 50%;
  }
`;

const Loading = styled.div`
  font-size: 3rem;
  padding: 2rem;
`;

const ReportView = ({ sales, stocks, isLoading }) => {
  const salesSorted = Array.from(sales.values()).sort(compareReport);
  const stocksSorted = Array.from(stocks.values()).sort(compareReport);

  if (isLoading) {
    return (
      <Wrapper>
        <Loading>Загрузка...</Loading>
      </Wrapper>
    );
  }

  const noSales = salesSorted.length === 0;
  const noStocks = stocksSorted.length === 0;

  const renderSales = noSales ? (
    <h3>Нет заказов</h3>
  ) : (
    salesSorted.map(r => (
      <ListItem
        key={`${r.name}-${r.time}-${r.type}`}
        name={r.name}
        time={r.time}
        type={r.type}
      />
    ))
  );

  const renderStocks = noStocks ? (
    <h3>Нет выгрузок</h3>
  ) : (
    stocksSorted.map(r => (
      <ListItem
        key={`${r.name}-${r.time}-${r.type}`}
        name={r.name}
        time={r.time}
        type={r.type}
      />
    ))
  );

  return (
    <Wrapper>
      <List>
        <h2>Непроведенные заказы</h2>
        {renderSales}
      </List>
      <List>
        <h2>Выгрузка для агентов</h2>
        {renderStocks}
      </List>
    </Wrapper>
  );
};

const compareReport = (a, b) => {
  return new Date(b.time).getTime() - new Date(a.time).getTime();
};

export default ReportView;
