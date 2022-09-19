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
    setAction,
    setText
  } = props;

  const handleIconClick = (actionType: ActionTypes) => {
    if(action === actionType){
      setAction(ActionTypes.VIEW);
    }
    if(actionType === ActionTypes.EDIT){
      setText("");
    }
    action === actionType ? setAction(ActionTypes.VIEW) : setAction(actionType);
  };

  return (
    <ActionBarWrapper>
      <IconWrapper active={action === ActionTypes.EDIT}>
        <Edit onClick={() => handleIconClick(ActionTypes.EDIT)}/>
      </IconWrapper>
      <IconWrapper active={action === ActionTypes.DELETE}>
        <Delete onClick={() => handleIconClick(ActionTypes.DELETE)}/>
      </IconWrapper>
    </ActionBarWrapper>
  );
};

export default ActionBar;