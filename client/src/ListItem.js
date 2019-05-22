import React from "react";
import styled from "styled-components";
import moment from "moment";
import "moment/locale/ru";

import { UploadIcon, DownloadIcon } from "./Icons";

moment.locale("ru");

const Wrapper = styled.div`
  display: flex;
  width: 80%;
  align-items: center;
  justify-content: space-between;
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;

  p {
    font-size: 1.2rem;
    margin: 1rem;
  }

  svg {
    height: 20px;
    width: 20px;
  }
`;

const Time = styled.div``;

const ListItem = props => {
  const icon = props.type === 2 ? <DownloadIcon /> : <UploadIcon />;
  const timeSince = moment(props.time).fromNow();
  return (
    <Wrapper>
      <LeftSide>
        {icon}

        <p>{props.name}</p>
      </LeftSide>
      <Time>{timeSince}</Time>
    </Wrapper>
  );
};

export default ListItem;
