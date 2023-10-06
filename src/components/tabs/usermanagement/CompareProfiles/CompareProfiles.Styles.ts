import styled from "styled-components";
import { Paper } from "@mui/material";

export const CompareProfilesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 20px;
`;

export const ProfileColumnsWrapper = styled.div`
  display: flex;
  padding: 50px;
`;

export const ProfileColumnWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid black 3px;
  height: 60vh;
  width: 30vw;
  margin: 10px;
`;
export const ProfileColumnDetails = styled.div`
  display: flex;
  flex-direction: column;
  border: solid red 1px;
  height: 90%;
  width: 70%;
  margin: 5px;
  overflow-y: scroll;
`;

export const ProfileColumnSideNav = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90%;
  border: solid blue 1px;
  width: 15%;
  margin: 5px;
`;

export const ProfileAttribute = styled.div`
  display: flex;
`;
export const ProfileKey = styled.div`
  display: flex;
  padding: 5px;
`;

export const ProfileValue = styled.div`
  display: flex;
  padding: 5px;
`;

export const ProfileColumnNavOption = styled.div<{ selected?: boolean }>`
  display: flex;
  height: 100%;
  margin: 2px;
  border: solid green 1px;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.selected ? props.theme.tableRow.selectedColor : "inherit"};
  &:hover {
    background-color: ${props => props.selected ? props.theme.tableRow.hoverSelectedColor : props.theme.tableRow.hoverColor};
    cursor: pointer;
  }
`;

export const BannerWrapper = styled.div<{ height?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: ${props => props.height ? props.height : "18vh"};
  overflow-y: scroll;
  margin: 30px 20px;
  border-radius: 5px;
  padding: 20px;
  border: solid lightgrey 1px;
`;

export const BannerMessage = styled(Paper) <{ level: string }>`
  display: flex;
  margin: 5px;
  padding: 15px;
  font-size: 19px;
  && {
    background-color: ${props => props.level === "info" && "#D9E8FE" || props.level === "success" && "#E1F2E6" || props.level === "error" && "#FFF4F5"}
  }
`;

export const BannerHeader = styled.h2`
  font-size: 30px;
`;