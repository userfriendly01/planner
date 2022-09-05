import React, { useState } from "react";
import {
  MessageBoxWrapper,
  ActionBar,
  TextField,
  UserFormButton,
  IconWrapper
} from "./MessageBox.Styles";
import { MessageBoxProps } from "../CallFlowManagement.Interfaces";
import {
  Edit,
  Delete,
  FileDownload
} from "@mui/icons-material";
import {
  useAdminState
} from "context";
import {
  Skill
} from "globals";
import {
  updateFlashMessage,
  updateClosedMessage
} from "services";

enum actionTypes  {
  VIEW = "view",
  EDIT = "edit",
  DELETE = "delete",
  EXPORT = "export"
}

export const MessageBox = (props: MessageBoxProps) => {
  const {
    confirmationModalOpts,
    setConfirmationModalOpts,
    selected,
    messageType
  } = props;

  const nNumber = useAdminState().userContext.pingIdentity.sub;
  const apiCall = messageType === "Closed Message" ? updateClosedMessage : updateFlashMessage;
  const messageVariable = messageType === "Closed Message" ? "closedMessage" : "flashMessage";
  const isSingleSelection = selected.length === 1;
  const isMultiSelection = selected.length > 1;
  const [ action, setAction ] = useState(actionTypes.VIEW);
  const [ text, setText ] = useState(isSingleSelection ? selected[0][messageVariable]: "");

  const handleIconClick = (actionType: actionTypes) => {
    action === actionType ? setAction(actionTypes.VIEW) : setAction(actionType);
  };

  const handleOnSave = () => {
    switch(action){
      case actionTypes.EDIT:
        handleEdit();
        break;
      case actionTypes.DELETE:
        handleDelete();
        break;
      case actionTypes.EXPORT:
        handleExport();
        break;
      default:
        break;
    }
  };

  const handleCloseConfirmation = () => {
    setConfirmationModalOpts({
      ...confirmationModalOpts,
      open: false
    });
  };

  const handleEdit = () => {
    const onConfirm = async () => {
      const results = await Promise.allSettled(selected.map((skill: Skill) => {
        return apiCall(skill, text, nNumber);
      }));
      console.log("Handle Results", results);
    };
    const confirmationText = `Are you sure you want to update the ${messageType}
    for ${ !isMultiSelection ? selected[0].name : selected.length + " skills"}`;

    setConfirmationModalOpts({
      open: true,
      confirmationText,
      callbackMethods: {
        onConfirm: onConfirm,
        handleClose: handleCloseConfirmation
      }
    });
  };

  //Delete can be handled as a separate story - leaving the structure here
  const handleDelete = () => {
    console.log("Handle Delete has been clicked!");
  };

  const handleExport = () => {
    console.log("Handle Export has been clicked!");
  };

  return (
    <MessageBoxWrapper>
      <h1>{messageType}</h1>
      <ActionBar>
        <IconWrapper active={action === actionTypes.EDIT}>
          <Edit onClick={() => handleIconClick(actionTypes.EDIT)}/>
        </IconWrapper>
        { isMultiSelection && <IconWrapper active={action === actionTypes.EXPORT}>
          <FileDownload onClick={() => handleIconClick(actionTypes.EXPORT)}  />
        </IconWrapper>}
      </ActionBar>
      <TextField
        readOnly={action !== actionTypes.EDIT}
        onChange={event => setText(event.target.value)}
        value={text}
      />
      {(isSingleSelection || isMultiSelection) && action !== actionTypes.VIEW &&
        <UserFormButton
          onClick={handleOnSave}
        >
          { isMultiSelection ?
            `${action} ${selected.length} ${messageType}s`
            : `${action} ${selected[0].name} ${messageType}`
          }
        </UserFormButton>
      }
    </MessageBoxWrapper>
  );
};

export default MessageBox;