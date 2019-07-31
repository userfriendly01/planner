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
    background-color: #FFD000;
    box-shadow: none;
  }
`;

const StyledToolBar = styled(Toolbar)`
  justify-content: space-between;
`;

const Header = () => {
  return (
    <StyledAppBar position="static" color="default">
      <StyledToolBar>
        <Logo />
        <UserCard name="Change Me" />
      </StyledToolBar>
    </StyledAppBar>
  );
};

export default Header;
