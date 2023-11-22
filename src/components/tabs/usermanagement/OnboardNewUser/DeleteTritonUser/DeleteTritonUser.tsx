import { DeleteTritonUserProps } from "./DeleteTritonUser.Interfaces";
import {
  ButtonWrapper,
  UserFormButton,
  StyledDivider
} from "../UserEntryFormWrapper/UserEntryFormWrapper.Styles";
import {
  DeleteTritonUserWrapper,
  Text,
  CheckboxWrapper
} from "./DeleteTritonUser.Styles";
import { ForwardToEntryForm } from "components";
import {
  useAdminState,
  useFormState,
  useAdminDispatch
} from "context";
import {
  ModalOverlayStatuses,
  timeouts
} from "globals";
import React from "react";
import { terminateWorker } from "services";
import {
  logger,
  wait
} from "utils";
import { Checkbox } from "@mui/material";

const DeleteTritonUser = (props: DeleteTritonUserProps): any => {
  const {
    handleClose,
    loading,
    updateLoading
  } = props;

  interface profilesToDeleteState {
    triton: boolean,
    calabrioQm: boolean
  }

  const state = useAdminState();
  const nNumber = state.userContext.pingIdentity?.sub;
  const dispatch = useAdminDispatch();
  const form = useFormState();
  const tritonWorker: any = state.workerContext.workers.find((w: any) => w.attributes.n_number === form.nNumber.value);

  logger.log("TRITON WORKER", tritonWorker);
  const isWorkerDid = form.triton.didUser;
  const [isDeleteEnabled, setIsDeleteEnabled] = React.useState(isWorkerDid ? false : true);
  // const [deleteTriton, setDeleteTriton] = React.useState(form.triton.userFound);
  // const [deleteCalabrioQm, setDeleteClabrioQm] = React.useState(form.calabrio_qm.userFound);
  // const [deleteCalabrioWfm, setDeleteCalabrioWfm ] = React.useState(form.calabrio_wfm.userFound);
  const [profilesToDelete, setProfilesToDelete] = React.useState<profilesToDeleteState>({
    triton: true,
    calabrioQm: true
  });

  const handleSystemSelection = (profile: string) => {
    if (profile === "triton") {
      setProfilesToDelete(
        {
          ...profilesToDelete,
          triton: !profilesToDelete.triton
        });
    } else if (profile === "calabrioQm") {
      setProfilesToDelete(
        {
          ...profilesToDelete,
          calabrioQm: !profilesToDelete.calabrioQm
        });
    }
  };

  const handleDeleteUser = () => {
    const tritonWorkerName =  tritonWorker.attributes ? `${tritonWorker.attributes?.emp_first_name} ${tritonWorker.attributes?.emp_last_name}` : null;
    const workerName = tritonWorkerName  || tritonWorker.displayId || tritonWorker.DisplayName;
    const termDate = new Date().toISOString().split("T")[0];

    updateLoading({
      ...loading,
      overlayMessage: `Deleting user: ${workerName}`,
      saveStatus: ModalOverlayStatuses.SAVING,
      saveUser: true
    });
    let resultMessage;

    const body: any = {
      nNumber: tritonWorker.attributes?.n_number,
      workerSid: tritonWorker.sid,
      email: tritonWorker.attributes?.email_address || tritonWorker.attributes?.email,
      firstName: tritonWorker.attributes?.emp_first_name,
      lastName: tritonWorker.attributes?.emp_last_name,
      systems: [],
      terminationDate: termDate,
      inactiveForwardTo: isWorkerDid ? tritonWorker.inactiveForwardTo : ""
    };
    if (profilesToDelete.triton) {
      body.systems.push("TRITON");
    }
    if (profilesToDelete.calabrioQm) {
      body.systems.push("QM");
    }

    terminateWorker(body)
      .then(response => {
        resultMessage = `Successfully marked Triton worker for delete in ${body.systems}`;
        const overlayMessage = response.data?.split("+")[0] ? response.data?.split("+")[0] : "Successfully Deleted User";

        logger.info(resultMessage, {
          nNumber,
          workerSid: tritonWorker.sid,
          userNNumber: tritonWorker.attributes?.n_number
        });

        dispatch({
          type: "deleteWorker",
          payload: tritonWorker.sid
        });
        updateLoading({
          ...loading,
          overlayMessage: overlayMessage,
          saveStatus: ModalOverlayStatuses.SUCCESS,
          saveUser: true
        });
        wait(() => {
          updateLoading({
            ...loading,
            saveUser: false
          });
          handleClose();
        }, timeouts.MODAL_OVERLAY_ATTENTION);
      })
      .catch(error => {
        if (typeof error.response?.data?.error === "object" ){
          resultMessage = `Failed to terminate worker ${tritonWorker.sid}`;
        } else {
          resultMessage = error.response.data.error;
        }

        logger.error(resultMessage, {
          error,
          nNumber,
          tritonWorker
        });

        updateLoading({
          ...loading,
          overlayMessage: `Error Deleting Triton User. ${resultMessage}`,
          saveStatus: ModalOverlayStatuses.FAIL,
          saveUser: true
        });
      });
  };

  return (
    <DeleteTritonUserWrapper>
      <Text>Note: there is a grace period of 2 days before this user will be permanently deleted</Text>
      <StyledDivider />
      <Text>User will be deactivated in the following systems: </Text>
      <div
        style={{
          display: "flex",
          justifyContent: "center"
        }}
      >
        <CheckboxWrapper>
          <Checkbox
            checked={profilesToDelete.triton}
            onChange={ () => handleSystemSelection("triton") }
          />
          <Text>Triton</Text>
        </CheckboxWrapper>
        <CheckboxWrapper>
          <Checkbox
            checked={profilesToDelete.calabrioQm}
            onChange={ () => handleSystemSelection("calabrioQm") }
            style={{
              marginLeft: "125px"
            }}
          /> <Text>Calabrio QM</Text>
        </CheckboxWrapper>
      </div>
      { isWorkerDid ?
        <ForwardToEntryForm
          label="This user has a direct dial number. Please choose a forward to option before confirming."
          updateForwardTo={
            (inactiveForwardTo: string) => {
              tritonWorker.inactiveForwardTo = inactiveForwardTo;
              if (inactiveForwardTo) {
                setIsDeleteEnabled(true);
              } else {
                setIsDeleteEnabled(false);
              }
            }
          }
        />
        : null
      }
      <ButtonWrapper>
        <UserFormButton onClick={handleClose}>
          Close
        </UserFormButton>
        <UserFormButton
          disabled={!isDeleteEnabled}
          onClick={handleDeleteUser}
        >
          Confirm Delete
        </UserFormButton>
      </ButtonWrapper>
    </DeleteTritonUserWrapper>
  );
};

export default DeleteTritonUser;