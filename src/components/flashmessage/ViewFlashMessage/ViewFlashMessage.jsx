import { Tooltip } from "@material-ui/core";
import {
  Edit,
  Delete
} from "@material-ui/icons";
import { useAdminState } from "context";
import { apiPaths } from "globals";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { myAxios } from "utils";

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const EditMessageInput = styled.div`
  background-color: white;
  border: 2px solid ${props => props.theme.libertyMediumTeal};
  border-radius: 10px;
  display: flex;
  height: fit-content;
  justify-content: space-between;
  margin: 2vw;
  min-height: 10vh;
  padding: 10px;
  width: -webkit-fill-available;
`;

const IconWrapper = styled.div`
  align-items: center;
  border-radius: ${props => props.theme.tableRow.icon.hoverDiameter / 2}px;
  color: ${props => props.theme.textColor};
  cursor: pointer;
  display: flex;
  font-size: ${props => props.theme.tableRow.icon.size}px;
  height: ${props => props.theme.tableRow.icon.hoverDiameter}px;
  justify-content: center;
  width: ${props => props.theme.tableRow.icon.hoverDiameter}px;
  &:hover {
    background-color: ${props => props.theme.tableRow.selectedColor};
    cursor: pointer;
  }
`;

export const ViewFlashMessage = props => {

  const {
    flashMessageState,
    setFlashMessageState
  } = props;

  const flashMessage = flashMessageState.flashMessage;
  const adminState = useAdminState();
  const nNumber = adminState.userContext.pingIdentity.sub;
  const skill = flashMessageState.skill;

  const editButtonOnClick = () => setFlashMessageState({
    ...flashMessageState,
    readOnly: false
  });

  const deleteButtonOnClick = () => {
    const popUp = confirm("Are you sure you want to delete this flash message?");
    if (popUp === true) {
      setFlashMessageState({
        ...flashMessageState,
        fetching: true,
        serviceCallError: null
      });
      const req = {
        skill: skill,
        flashMessage: "",
        updatedBy: nNumber
      };
      myAxios.post(apiPaths.FLASH_MESSAGE, req)
        .then(() => {
          setFlashMessageState({
            ...flashMessageState,
            fetching: false,
            flashMessage: "",
            readOnly: false
          });
        })
        .catch(err => {
          const deleteError = "Failed to delete flash message. Please try again or submit a request via";
          setFlashMessageState({
            ...flashMessageState,
            fetching: false,
            serviceCallError: deleteError
          });
          console.error(deleteError, err);
        });
    }
  };

  return (
    <EditMessageInput>
      <div>{flashMessage}</div>
      <ButtonWrapper>
        <Tooltip title="Edit" placement="left">
          <IconWrapper onClick={editButtonOnClick}>
            <Edit />
          </IconWrapper>
        </Tooltip>
        <Tooltip title="Delete" placement="left">
          <IconWrapper onClick={deleteButtonOnClick}>
            <Delete />
          </IconWrapper>
        </Tooltip>
      </ButtonWrapper>
    </EditMessageInput>
  );
};

ViewFlashMessage.propTypes = {
  flashMessageState: PropTypes.object.isRequired,
  setFlashMessageState: PropTypes.func.isRequired
};

export default ViewFlashMessage;