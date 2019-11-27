import {
  Edit
  // Delete
} from "@material-ui/icons";
import { useAdminState } from "context";
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
  const flashMessage = state.flashMessage;

  const editButtonOnClick = event => {
    event.stopPropagation();
    toggleReadOnly(false);
  };

  return (
    <div>
      <MessageDiv>{flashMessage}</MessageDiv>
      <IconWrapper onClick={editButtonOnClick}>
        <Edit fontSize={"inherit"}/>
      </IconWrapper>
    </div>
  );
};

ViewFlashMessage.propTypes = {
  toggleReadOnly: PropTypes.func.isRequire
};

export default ViewFlashMessage;