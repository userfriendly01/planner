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
import { deleteUser } from "services";
import {
  logger,
  wait
} from "utils";

const DeleteTritonUser = (props: DeleteTritonUserProps): any => {
  const {
    handleClose,
    loading,
    updateLoading
  } = props;

  const state = useAdminState();
  const identity = state.userContext.pingIdentity?.sub;
  const dispatch = useAdminDispatch();
  const form = useFormState();
  const tritonWorker: any = state.workerContext.workers.find((w: any) => w.attributes.n_number === form.nNumber.value);

  const isWorkerDid = form.triton.didUser;
  const [deleteTriton, setDeleteTriton] = React.useState(form.triton.userFound);
  const [deleteCalabrioQm, setDeleteClabrioQm] = React.useState(form.calabrio_qm.userFound);
  const [deleteCalabrioWfm, setDeleteCalabrioWfm ] = React.useState(form.calabrio_wfm.userFound);

  const handleDeleteUser = () => {
    const tritonWorkerName =  tritonWorker.attributes ? `${tritonWorker.attributes?.emp_first_name} ${tritonWorker.attributes?.emp_last_name}` : null;
    const workerName = tritonWorkerName  || tritonWorker.displayId || tritonWorker.DisplayName;
    updateLoading({
      ...loading,
      overlayMessage: `Deleting user: ${workerName}`,
      saveStatus: ModalOverlayStatuses.SAVING,
      saveUser: true
    });
    let resultMessage;
    deleteUser(tritonWorker)
      .then(() => {
        resultMessage = `Successfully deleted Triton worker with sid ${tritonWorker.sid}`;

        logger.info(resultMessage, {
          identity,
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
        if (typeof error.response?.data?.error === "object" ){
          resultMessage = `Failed to delete worker ${tritonWorker.sid}`;
        } else {
          resultMessage = error.response.data.error;
        }

        logger.error(resultMessage, {
          error,
          identity,
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
      <Text>This user will be deactivated in Triton.</Text>
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
          disabled={!deleteTriton && !deleteCalabrioQm && !deleteCalabrioWfm}
          onClick={handleDeleteUser}
        >
          Confirm Delete
        </UserFormButton>
      </ButtonWrapper>
    </DeleteTritonUserWrapper>
  );
};

export default DeleteTritonUser;