import React, { useState } from "react";
import {
  MessageBoxWrapper,
  ActionBar,
  TextField,
  UserFormButton,
  IconWrapper
} from "./MessageBox.Styles";
import {
  Edit,
  Delete,
  FileDownload
} from "@mui/icons-material";
import {
  useAdminState
} from "context";
import {
  updateFlashMessage,
  updateClosedMessage
} from "services";
interface MessageBoxProps {
  selected: any[],
  messageType: string
}

enum actionTypes  {
  VIEW = "view",
  EDIT = "edit",
  DELETE = "delete",
  EXPORT = "export"
}

export const MessageBox = (props: MessageBoxProps) => {
  const {
    selected,
    messageType
  } = props;

  const nNumber = useAdminState().userContext.pingIdentity.sub;
  const messageVariable = messageType === "Closed Message" ? "closedMessage" : "flashMessage";
  const isSingleSelection = selected.length === 1;
  const isMultiSelection = selected.length > 1;
  const [ action, setAction ] = useState(actionTypes.VIEW);
  const [ text, setText ] = useState(isSingleSelection ? selected[0][messageVariable]: "");

  const handleIconClick = (actionType: actionTypes) => {
    action === actionType ? setAction(actionTypes.VIEW) : setAction(actionType);
  };

  const handleOnSave = () => {
    //add in a confirmation step
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

  const handleEdit = () => {
    console.log("Handle Edit has been clicked!");
  };

  const handleDelete = () => {
    console.log("Handle Delete has been clicked!");
  };

  const handleExport = () => {
    console.log("Handle Edit has been clicked!");
  };

  return (
    <MessageBoxWrapper>
      <h1>{messageType}</h1>
      <ActionBar>
        <IconWrapper active={action === actionTypes.EDIT}>
          <Edit onClick={() => handleIconClick(actionTypes.EDIT)}/>
        </IconWrapper>
        <IconWrapper active={action === actionTypes.DELETE} >
          <Delete onClick={() => handleIconClick(actionTypes.DELETE)} />
        </IconWrapper>
        { isMultiSelection && <IconWrapper active={action === actionTypes.EXPORT}>
          <FileDownload onClick={() => handleIconClick(actionTypes.EXPORT)}  />
        </IconWrapper>}
      </ActionBar>
      <TextField
        readOnly={action === actionTypes.VIEW}
        onChange={setText}
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