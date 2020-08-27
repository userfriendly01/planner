import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import {
  Logo,
  UserCard
} from "components";
import React from "react";
import styled from "styled-components";

const StyledAppBar = styled(AppBar)`
  && {
    background-color: ${props => props.theme.libertyYellow};
    box-shadow: none;
  }
`;

const StyledToolBar = styled(Toolbar)`
  justify-content: space-between;
`;

const Header = () => {
  return (
    <StyledAppBar position="sticky" color="default">
      <StyledToolBar variant="dense">
        <Logo />
        <UserCard />
      </StyledToolBar>
    </StyledAppBar>
  );
};

export default Header;
