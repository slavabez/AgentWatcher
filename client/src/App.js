import React from "react";
import styled from "styled-components";
import { Link, Router } from "@reach/router";

import Reports from "./components/ReportsSection";
import DBSection from "./components/DBSection";
import Sidebar from "./components/SideBar";

const AppWrapper = styled.div`
  font-family: "Roboto", sans-serif;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const Header = styled.div`
  width: 100%;
  text-align: center;
  background-color: rebeccapurple;
  color: white;
  text-decoration: none;

  a,
  h1 {
    color: white;
    text-decoration: none;
  }
`;

const ContentWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
`;

const StyledRouter = styled(Router)`
  width: 100%;
`;

function App() {
  return (
    <AppWrapper>
      <Sidebar />
      <ContentWrap>
        <Header>
          <h1>Файлы обмена Агент Плюс</h1>
        </Header>
        <StyledRouter>
          <Reports path="/" />
          <DBSection path="db" />
        </StyledRouter>
      </ContentWrap>
    </AppWrapper>
  );
}

export default App;
