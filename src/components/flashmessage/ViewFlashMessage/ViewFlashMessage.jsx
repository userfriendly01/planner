import {
  Edit,
  Delete
} from "@material-ui/icons";
import {
  useAdminDispatch,
  useAdminState
} from "context";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const IconWrapper = styled.div`
  align-items: center;
  border-radius: ${props => props.theme.tableRow.icon.hoverDiameter / 2}px;
  color: ${props => props.theme.libertyDarkGray};
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

const MessageDiv = styled.div`
  border: 3px solid black;
  height: 200px;
  margin: 30px;
  padding: 10px;
  width: 800px;
`;

export const ViewFlashMessage = props => {

  const { toggleReadOnly } = props;

  const state = useAdminState();
  const dispatch = useAdminDispatch();
  const flashMessage = state.flashMessage;

  const editButtonOnClick = event => {
    event.stopPropagation(); // do we need this?
    toggleReadOnly(false);
  };

  const deleteButtonOnClick = event => {
    event.stopPropagation(); // do we need this?
    const popUp = confirm("Are you sure you want to delete this flash message?");
    if (popUp === true) {
      // TODO: delete from DB
      dispatch({
        type: "updateFlashMessage",
        payload: ""
      });
      toggleReadOnly(false);
    }
  };

  return (
    <div>
      <MessageDiv>{flashMessage}</MessageDiv>
      <IconWrapper onClick={editButtonOnClick}>
        <Edit />
      </IconWrapper>
      <IconWrapper onClick={deleteButtonOnClick}>
        <Delete/>
      </IconWrapper>
    </div>
  );
};

ViewFlashMessage.propTypes = {
  toggleReadOnly: PropTypes.func.isRequired
};

export default ViewFlashMessage;