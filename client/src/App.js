import React from "react";
import styled from "styled-components";
import { Link, Router } from "@reach/router";

import Reports from "./components/ReportsSection";
import DBSection from "./components/DBSection";

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
  text-decoration: none;

  a, h1 {
    color: white;
    text-decoration: none;
  }
`;

const SettingsButton = styled(Link)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: white;
  text-decoration: none;
`;

const StyledRouter = styled(Router)`
  width: 100%;
`;

function App() {
  return (
    <AppWrapper>
      <Header>
        <Link to="/">
          <h1>Файлы обмена с Агент Плюс</h1>
        </Link>

        <SettingsButton to="/db">Настройки</SettingsButton>
      </Header>
      <StyledRouter>
        <Reports path="/" />
        <DBSection path="db" />
      </StyledRouter>
    </AppWrapper>
  );
}

export default App;
