import React from "react";
import styled from "styled-components";
import { Link } from "@reach/router";

import { ListIcon, SettingsIcon } from "./Icons";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #0d1b2a;
  min-height: 100vh;
`;

const SidebarLink = styled(Link)`
  margin: 1rem 1rem 0;
  
  @media(max-width: 600px) {
  margin: 0.25rem 0.25rem 0;
  }
`;

const SideBar = () => {
  return (
    <Wrapper>
      <SidebarLink to="/">
        <ListIcon fill="#ccc" color="#333" />
      </SidebarLink>
      <SidebarLink to="/db">
        <SettingsIcon fill="#ccc" color="#333" />
      </SidebarLink>
    </Wrapper>
  );
};

export default SideBar;
