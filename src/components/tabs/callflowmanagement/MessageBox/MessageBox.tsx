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
import { ExcelExport } from "@progress/kendo-react-excel-export";
import {
  useAdminState,
  useAdminDispatch
} from "context";
import {
  Skill,
  ModalOverlayStatuses,
  timeouts
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
    setSaveResult,
    confirmationModalOpts,
    setConfirmationModalOpts,
    selected,
    setSelected,
    messageType
  } = props;

  const _export = React.useRef(null);
  const state = useAdminState();
  const dispatch = useAdminDispatch();
  const nNumber = state.userContext.pingIdentity.sub;
  const apiCall = messageType === "Closed Message" ? updateClosedMessage : updateFlashMessage;
  const messageVariable = messageType === "Closed Message" ? "closedMessage" : "flashMessage";
  const isSingleSelection = selected.length === 1;
  const isMultiSelection = selected.length > 1;
  const [ action, setAction ] = useState(actionTypes.VIEW);
  const [ text, setText ] = useState("");

  React.useEffect(() => {
    if(isSingleSelection) {
      setText(selected[0][messageVariable]);
    } else {
      setAction(actionTypes.VIEW);
      setText("");
    }
  }, [selected]);

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
    setSaveResult({
      message: "",
      status: null
    });
  };

  const updateStateOnResolvedPromises = (promises: any[]) => {
    const skills = state.skillContext.skills.slice();
    const updatedSkills = skills.map(s => {
      let updatedSkill = s;
      promises.forEach(promise => {
        const data = JSON.parse(promise.value.config.data);
        const skillName = data.skill;
        const message = data[messageVariable];
        if(s.name === skillName) {
          updatedSkill = {
            ...s,
            messageVariable: message
          };
        }
      });
      return updatedSkill;
    });
    dispatch({
      type: "updateSkills",
      payload: updatedSkills
    });
  };

  const handleResults = (results: any[]) => {
    console.log("Handle Results", results);
    const successfulPromises = results.filter(r => r.status === "fulfilled");
    const rejectedPromises = results.filter(r => r.status === "rejected");
    if(rejectedPromises.length === 0){
      setSaveResult({
        message: "Request Successfully Processed",
        status: ModalOverlayStatuses.SUCCESS
      });
      updateStateOnResolvedPromises(successfulPromises);
      setTimeout(() => {
        handleCloseConfirmation();
        setSelected([]);
      }, timeouts.MODAL_OVERLAY);
    } else if (successfulPromises.length === 0){
      setSaveResult({
        message: "Request Failed",
        status: ModalOverlayStatuses.FAIL
      });
    } else {
      let message = "The following skills failed to update: ";
      rejectedPromises.forEach((promise: any, index: number) => {
        const data = JSON.parse(promise.value.config.data);
        if(index !== rejectedPromises.length - 1){
          message = message + data.skill + ", ";
        } else {
          message = message + data.skill;
        }
      });
      updateStateOnResolvedPromises(successfulPromises);
      setSaveResult({
        message,
        status: ModalOverlayStatuses.PARTIAL_FAIL
      });
    }
  };

  const handleEdit = () => {
    const onConfirm = async () => {
      setSaveResult({
        message: "Processing...",
        status: ModalOverlayStatuses.SAVING
      });
      const results = await Promise.allSettled(selected.map((skill: Skill) => {
        return apiCall(skill, text, nNumber);
      }));
      handleResults(results);
    };
    const confirmationText = `Are you sure you want to update the ${messageType}
    for ${ !isMultiSelection ? selected[0].name : selected.length + " skills?"}`;

    setConfirmationModalOpts({
      open: true,
      confirmationText,
      callbackMethods: {
        onConfirm: onConfirm,
        handleClose: handleCloseConfirmation
      }
    });
  };

  //Delete can be handled as a separate story  - leaving the structure here
  const handleDelete = () => {
    console.log("Handle Delete has been clicked!");
  };

  const handleExport = () => {
    console.log("Handle Export has been clicked!");
    const columns = [
      {
        field: "name",
        title: "Skill Name",
        width: "50px"
      },
      {
        field: "closedMessage",
        title: "Closed Message",
        width: "200px"
      },
      {
        field: "flashMessage",
        title: "Flash Message",
        width: "200px"
      }
    ];
    if (_export.current !== null) {
      _export.current.save(selected, columns);
    }
    setAction(actionTypes.VIEW);
  };

  return (
    <MessageBoxWrapper>
      <ExcelExport ref={_export}/>
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