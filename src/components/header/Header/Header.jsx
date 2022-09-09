import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
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
