import React from "react";
import {
  ActionBarWrapper,
  IconWrapper
} from "../ClosedFlashMessage.Styles";
import {
  ActionBarProps,
  ActionTypes
} from "../ClosedFlashMessage.Interfaces";
import {
  Edit,
  Delete
} from "@mui/icons-material";

const ActionBar = (props: ActionBarProps) => {

  const {
    action,
    setAction
  } = props;

  const handleIconClick = (actionType: ActionTypes) => {
    if(action === actionType){
      setAction(ActionTypes.VIEW);
    } else {
      setAction(actionType);
    }
  };

  return (
    <ActionBarWrapper>
      <IconWrapper
        active={action === ActionTypes.EDIT}
        onClick={() => handleIconClick(ActionTypes.EDIT)}>
        <Edit/>
      </IconWrapper>
      <IconWrapper
        active={action === ActionTypes.DELETE}
        onClick={() => handleIconClick(ActionTypes.DELETE)}>
        <Delete/>
      </IconWrapper>
    </ActionBarWrapper>
  );
};

export default ActionBar;