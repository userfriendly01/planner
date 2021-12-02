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

export const ViewClosedMessage = props => {

  const {
    closedMessageState,
    setClosedMessageState
  } = props;

  const closedMessage = closedMessageState.closedMessage;
  const adminState = useAdminState();
  const nNumber = adminState.userContext.pingIdentity.sub;
  const skill = closedMessageState.skill;

  const editButtonOnClick = () => setClosedMessageState({
    ...closedMessageState,
    readOnly: false
  });

  const deleteButtonOnClick = () => {
    const popUp = confirm("Are you sure you want to delete this closed message?");
    if (popUp === true) {
      setClosedMessageState({
        ...closedMessageState,
        fetching: true,
        serviceCallError: null
      });
      const req = {
        skill: skill,
        closedMessage: "",
        updatedBy: nNumber
      };
      myAxios.post(apiPaths.FLASH_MESSAGE, req)
        .then(() => {
          setClosedMessageState({
            ...closedMessageState,
            fetching: false,
            closedMessage: "",
            readOnly: false
          });
        })
        .catch(err => {
          const deleteError = "Failed to delete closed message. Please try again or submit a request via";
          setClosedMessageState({
            ...closedMessageState,
            fetching: false,
            serviceCallError: deleteError
          });
          console.error(deleteError, err);
        });
    }
  };

  return (
    <EditMessageInput>
      <div>{closedMessage}</div>
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

ViewClosedMessage.propTypes = {
  closedMessageState: PropTypes.object.isRequired,
  setClosedMessageState: PropTypes.func.isRequired
};

export default ViewClosedMessage;