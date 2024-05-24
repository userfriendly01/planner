import {
  Header,
  CloseButtonContainer,
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
import { logger } from "utils";
import { IconButton } from "@mui/material";

const ManagerDelete = (props: ManagerDeleteProps): any => {
  const {
    handleClose,
    selectedManager
  } = props;

  const state = useAdminState();
  const { nNumber } = state.userContext;
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
        if (worker.attributes.manager_n_number.toLowerCase() === selectedManager.manager_n_num.toLowerCase()) {
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
        const updatedArray = state.managerContext.managers.filter(
          mgr => mgr.manager_n_num !== selectedManager.manager_n_num
        );

        dispatch(({
          type: "editManager",
          payload: updatedArray
        }));

        dispatch({
          type: "updateManagerFilter",
          payload: null
        });
        setSaveStatus(ModalOverlayStatuses.SUCCESS);
        setTimeout(handleClose, 2000);

        logger.info("Successfully deleted manager", {
          res,
          nNumber,
          managerNNumber: selectedManager.manager_n_number
        });
      })
      .catch((error: any) => {
        setErrorMessage("Failed to delete Manager");
        setSaveStatus(ModalOverlayStatuses.FAIL);
        setTimeout(() => setSaveStatus(null), 2000);

        logger.error("Failed to delete Manager", {
          error,
          nNumber,
          managerNNumber: selectedManager.manager_n_number
        });
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
          <CloseButtonContainer>
            <IconButton>
              <CloseRounded data-testid="close-button" onClick={handleClose} />
            </IconButton>
          </CloseButtonContainer>
          <Header>Delete Manager {selectedManager.manager_first_name} {selectedManager.manager_last_name}</Header>
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
