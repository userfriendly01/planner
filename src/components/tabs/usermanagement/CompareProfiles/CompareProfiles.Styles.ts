import styled from "styled-components";
import { Paper } from "@mui/material";
import { ModalFetchingRing, StyledButton } from "components";

export const CompareProfilesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 20px;
`;

export const ProfileColumnsWrapper = styled.div`
  display: flex;
  margin-top: 40px;
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
  align-items: center;
  height: 90%;
  width: 70%;
  margin: 5px;
  overflow-y: scroll;
  border: 2px solid lightgray;
  padding-top: 10px;
`;

export const ProfileColumnSideNav = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90%;
  width: 15%;
  margin: 5px;
`;

export const ProfileAttribute = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ProfileKey = styled.div`
  display: flex;
  padding: 5px;
  font-size: 22px;
  font-weight: bold;
`;

export const ProfileValue = styled.div`
  display: flex;
  padding: 5px;
  font-size: 18;
  text-align: center;
`;

export const ProfileColumnNavOption = styled.div<{ selected?: boolean }>`
  display: flex;
  height: 100%;
  margin: 2px;
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
  margin: 30px 20px;
  border-radius: 5px;
  padding: 20px;
`;

export const BannerMessage = styled(Paper) <{ level: string }>`
  display: flex;
  margin: 5px;
  padding: 15px;
  font-size: 19px;
  align-items: center;
  && {
    background-color: ${props => props.level === "info" && "#D9E8FE" || props.level === "success" && "#E1F2E6" || props.level === "error" && "#FFF4F5"}
  }
`;

export const ResetButton = styled(StyledButton)`
  height: 50px;
  width: 30%;
  margin-top: 30px;
  letter-spacing: 1px;
  font-size: 18px;
`;

export const StyledLoadSpinner = styled(ModalFetchingRing)`
  margin-top: 20px;
`;

export const InformationWapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 300px;
  justify-content: space-evenly;
  align-items: center;
`;

export const InformationText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 100%;
  align-items: center;
  text-align: center;
  font-size: 20px;
  letter-spacing: .2px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 50%;
  width: 55%;
  justify-content: space-between;
  min-height: 130px;
  margin-top: 20px;
`;

export const ModalContainer = styled(Paper)`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 60%
`;