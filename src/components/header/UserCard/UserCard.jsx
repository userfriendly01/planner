import { AccountBox } from "@material-ui/icons";
import { useAdminState } from "context";
import React from "react";
import styled from "styled-components";

const Card = styled.div`
  align-items: center;
  color: ${props => props.theme.textColor};
  display: flex;
  flex: 1 1;
  font-family: 'Roboto', sans-serif;
  font-size: 1.2em;
  font-weight: 400;
  letter-spacing: 0.5px;
  line-height: 1.5rem;
  justify-content: flex-end;
`;

const StyledAccountBox = styled(AccountBox)`
  padding-left: 10px;
  && {
    font-size: 1.35em;
  }
`;

const UserCard = () => {
  const {
    userContext: {
      pingIdentity: { displayName }
    }
  } = useAdminState();
  return (
    <Card>{displayName}<StyledAccountBox /></Card>
  );
};

export default UserCard;