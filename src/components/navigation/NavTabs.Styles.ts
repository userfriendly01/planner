import { Button } from "@mui/material";
import styled from "styled-components";
import { Link } from "react-router-dom";

export const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledTab = styled(Button)`
  color: black !important;
  && {
    font-size: 1.1em;
    margin: 5px;
  }
`;
export const StyledTabContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  position: sticky;
  top: 48px;
  z-index: 99;
  background-color: rgb(255, 226, 128);
  margin-bottom: 40px;
`;

export const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  padding: 0px 30px;
  background: rgb(255, 226, 128);
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
  margin: 10px 0px;
`;