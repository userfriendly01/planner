import {
  Edit,
  Delete
} from "@material-ui/icons";
import { Tooltip } from "@material-ui/core";
import {
  useAdminDispatch,
  useAdminState
} from "context";
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
    toggleFetching,
    toggleReadOnly
  } = props;

  const state = useAdminState();
  const dispatch = useAdminDispatch();
  const flashMessage = state.flashMessage;
  const nNumber = state.userContext.pingIdentity.sub;

  const editButtonOnClick = () => toggleReadOnly();

  const deleteButtonOnClick = () => {
    const popUp = confirm("Are you sure you want to delete this flash message?");
    if (popUp === true) {
      toggleFetching(true);
      const req = {
        callflowId: 5,
        flashMessage: "",
        updatedBy: nNumber
      };
      myAxios.post(apiPaths.UPDATE_FLASH_MESSAGE, req)
        .then(res => {
          console.log("response:", res); // TODO: handle the response
          toggleFetching(false);
          toggleReadOnly();
          dispatch({
            type: "updateFlashMessage",
            payload: ""
          });
        })
        .catch(err => {
          toggleFetching(false);
          console.error("Failed to delete flash message", err);
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
  toggleFetching: PropTypes.func.isRequired,
  toggleReadOnly: PropTypes.func.isRequired
};

export default ViewFlashMessage;