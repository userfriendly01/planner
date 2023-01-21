import {
  Header,
  HeaderAndCloseButtonWrapper,
  LeftDiv,
  ModalContainer
} from "./ManagerDelete.Styles";
import { ManagerDeleteProps } from "./ManagerDelete.Interfaces";
import {
  ConfirmationForm,
  ErrorForm,
  ModalOverlay,
  PaperContainer
} from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
import { ModalOverlayStatuses } from "globals";
import React from "react";
import { deleteManager } from "services";
import { CloseRounded } from "@mui/icons-material";

const ManagerDelete = (props: ManagerDeleteProps): any => {
  const {
    handleClose,
    selectedManager
  } = props;

  const state = useAdminState();
  const workers = useAdminState().workerContext.workers;
  const dispatch = useAdminDispatch();
  const [errorMessage, setErrorMessage] = React.useState<string>(null);
  const [saveStatus, setSaveStatus] = React.useState<ModalOverlayStatuses>(null);

  const buildTeamMembersList = () => {
    if (workers.length === 0) {
      return "";
    }

    const members = workers.filter(worker => {
      if (worker.attributes.manager_n_number && selectedManager) {
        if (worker.attributes.manager_n_number.toLowerCase() === selectedManager.manager_n_number.toLowerCase()) {
          return true;
        }
      }
    });
    const memberNames = members.map(worker => `${worker.attributes.emp_first_name} ${worker.attributes.emp_last_name}`);
    return memberNames.join(", ");
  };

  const deleteManagerClicked = (): Promise<any> => {
    setSaveStatus(ModalOverlayStatuses.SAVING);

    return deleteManager(selectedManager.manager_id)
      .then((res: any) => {
        // Remove the deleted manager from our local state
        const idx = state.managerContext.managers.findIndex(mgr => mgr.manager_n_number === selectedManager.manager_n_number);
        const lowerHalf = state.managerContext.managers.slice(0, idx);
        const upperHalf = state.managerContext.managers.slice(idx + 1);
        const updatedArray = [...lowerHalf, ...upperHalf];
        dispatch(({
          type: "editManager",
          payload: updatedArray
        }));

        setSaveStatus(ModalOverlayStatuses.SUCCESS);
        setTimeout(handleClose, 2000);
        console.log("deleteManager() successful", res);
      })
      .catch((err: any) => {
        setSaveStatus(ModalOverlayStatuses.FAIL);
        setTimeout(() => setSaveStatus(null), 2000);
        setErrorMessage("Failed to delete Manager");
        console.error("deleteManager() failed:", err);
      });
  };

  let overlayMessage = "Deleting...";
  if (saveStatus === ModalOverlayStatuses.SUCCESS) {
    overlayMessage = "Manager deleted successfully";
  } else if (saveStatus === ModalOverlayStatuses.FAIL) {
    overlayMessage = errorMessage;
  }

  const teamMembers = buildTeamMembersList();

  return (
    selectedManager ?
      <ModalContainer>
        <PaperContainer>
          {saveStatus ?
            <ModalOverlay
              message={overlayMessage}
              status={saveStatus}
            /> : null}
          <HeaderAndCloseButtonWrapper>
            <LeftDiv></LeftDiv>
            <Header>Delete Manager {selectedManager.manager_first_name} {selectedManager.manager_last_name}</Header>
            <CloseRounded onClick={handleClose}/>
          </HeaderAndCloseButtonWrapper>
          { teamMembers.length ?
            <ErrorForm TeamMembers={teamMembers} HandleClose={handleClose}/>
            :
            <ConfirmationForm SelectedManager={selectedManager} DeleteManagerClicked={deleteManagerClicked}/>
          }
        </PaperContainer>
      </ModalContainer>
      : <div></div>
  );
};

export default ManagerDelete;
