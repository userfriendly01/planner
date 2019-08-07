import { AccountBox } from "@material-ui/icons";
import { UserContext } from "context";
import React, {
  useContext
} from "react";
import styled from "styled-components";

const Card = styled.div`
  align-items: center;
  color: #1A1446;
  display: flex;
  flex: 1 1;
  font-family: 'Roboto', sans-serif;
  font-size: 1.35em;
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
    pingIdentity: { displayName }
  } = useContext(UserContext);
  return (
    <Card>{displayName}<StyledAccountBox /></Card>
  );
};

export default UserCard;