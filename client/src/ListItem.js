import React from 'react';
import styled from "styled-components";
import moment from "moment";
import "moment/locale/ru";

moment.locale("ru");

const Wrapper = styled.div``;

const ListItem = props => {
  const timeSince = moment(props.time).fromNow();
  return (
    <Wrapper>
      {props.name} - {timeSince}
    </Wrapper>
  );
};

export default ListItem;
