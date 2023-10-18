import { DeleteTritonUserProps } from "./DeleteTritonUser.Interfaces";
import {
  ButtonWrapper,
  UserFormButton
} from "../UserEntryFormWrapper/UserEntryFormWrapper.Styles";
import {
  DeleteTritonUserWrapper,
  Text
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
  const [deleteTriton, setDeleteTriton] = React.useState(form.triton.userFound);
  const [deleteCalabrioQm, setDeleteClabrioQm] = React.useState(form.calabrio_qm.userFound);
  const [deleteCalabrioWfm, setDeleteCalabrioWfm ] = React.useState(form.calabrio_wfm.userFound);
  const [profilesToDelete, setProfilesToDelete] = React.useState<profilesToDeleteState>({
    triton: true,
    calabrioQm: true
  });

  const handleCheckboxes = (profile: string) => {
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
    const termDate = Date.now();

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
      terminationDate: termDate
    };
    if (profilesToDelete.triton) {
      body.systems.push("TRITON");
    }
    if (profilesToDelete.calabrioQm) {
      body.systems.push("QM");
    }
    console.log("REQUEST BODY:", body);

    terminateWorker(body)
      .then(() => {
        resultMessage = `Successfully marked Triton worker for delete in ${body.systems}`;

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
          overlayMessage: "Successfully Deleted User",
          saveStatus: ModalOverlayStatuses.SUCCESS,
          saveUser: true
        });
        wait(() => {
          updateLoading({
            ...loading,
            saveUser: false
          });
          handleClose();
        }, timeouts.MODAL_OVERLAY);
      })
      .catch(error => {
        console.log(error);
        if (typeof error.response?.data?.error === "object" ){
          resultMessage = `Failed to terminate worker ${tritonWorker.sid}`; //todo what's the responses?
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
      <Text>This user will be deactivated in the following systems:</Text>
      <Text></Text>
      <div>
        <Checkbox
          checked={profilesToDelete.triton}
          onChange={ () => handleCheckboxes("triton") }
        />
        Triton

        <Checkbox
          checked={profilesToDelete.calabrioQm}
          onChange={ () => handleCheckboxes("calabrioQm") }
        /> Calabrio QM
      </div>
      { isWorkerDid ?
        <ForwardToEntryForm
          label="This user has a direct dial number. Please choose a forward to option before confirming."
          updateForwardTo={(inactiveForwardTo: string) => tritonWorker.inactiveForwardTo = inactiveForwardTo}
        />
        : null
      }
      <ButtonWrapper>
        <UserFormButton onClick={handleClose}>
          Close
        </UserFormButton>
        <UserFormButton
          disabled={(!deleteTriton && !deleteCalabrioQm && !deleteCalabrioWfm) || (!profilesToDelete.triton && !profilesToDelete.calabrioQm)}
          onClick={handleDeleteUser}
        >
          Confirm Delete
        </UserFormButton>
      </ButtonWrapper>
    </DeleteTritonUserWrapper>
  );
};

export default DeleteTritonUser;