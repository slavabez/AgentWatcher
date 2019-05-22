import React from "react";
import styled from "styled-components";

import ListItem from "./ListItem";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  align-items: center;
`;

const ReportView = ({ sales, stocks }) => {
  const salesSorted = Array.from(sales.values()).sort(compareReport);
  const stocksSorted = Array.from(stocks.values()).sort(compareReport);

  return (
    <Wrapper>
      <List>
        <h2>Непроведенные Заказы</h2>
        {salesSorted.map(r => (
          <ListItem
            key={`${r.name}-${r.time}-${r.type}`}
            name={r.name}
            time={r.time}
            type={r.type}
          />
        ))}
      </List>
      <List>
        <h2>Выгрузка для агентов</h2>
        {stocksSorted.map(r => (
          <ListItem
            key={`${r.name}-${r.time}-${r.type}`}
            name={r.name}
            time={r.time}
            type={r.type}
          />
        ))}
      </List>
    </Wrapper>
  );
};

const compareReport = (a, b) => {
  return new Date(b.time).getTime() - new Date(a.time).getTime();
};

export default ReportView;
