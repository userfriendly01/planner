import { DeleteTritonUserProps } from "./DeleteTritonUser.Interfaces";
import {
  ButtonWrapper,
  UserFormButton
} from "../UserEntryFormWrapper/UserEntryFormWrapper.Styles";
import {
  CheckboxWrapper,
  DeleteTritonUserWrapper,
  Text
} from "./DeleteTritonUser.Styles";
import { ForwardToEntryForm } from "components";
import { useAdminDispatch } from "context";
import {
  ModalOverlayStatuses,
  timeouts
} from "globals";
import React from "react";
import { deleteUser } from "services";
import { wait } from "utils";
import {
  FormControlLabel,
  Radio
} from "@mui/material";

const DeleteTritonUser = (props: DeleteTritonUserProps): any => {
  const {
    handleClose,
    loading,
    setWorkerOpts,
    updateLoading,
    workerOpts
  } = props;

  const dispatch = useAdminDispatch();
  const isWorkerDid = workerOpts.worker.directDialNum;
  const [deleteTriton, setDeleteTriton] = React.useState(workerOpts.systems.triton);
  const [deleteCalabrioQm, setDeleteClabrioQm] = React.useState(workerOpts.systems.calabrio_qm);
  const [deleteCalabrioWfm, setDeleteCalabrioWfm ] = React.useState(workerOpts.systems.calabrio_wfm);

  const handleDeleteUser = () => {
    const deletedWorker = workerOpts.worker;
    const workerName = deletedWorker.attributes?.full_name || deletedWorker.displayId || deletedWorker.DisplayName;
    updateLoading({
      ...loading,
      overlayMessage: `Deleting user: ${workerName}`,
      saveStatus: ModalOverlayStatuses.SAVING,
      saveUser: true
    });
    let resultMessage;
    const tritonPromise = deleteUser(deletedWorker)
      .then(() => {
        resultMessage = `Successfully deleted Triton worker with sid ${deletedWorker.sid}`;
        console.log(resultMessage);
        dispatch({
          type: "deleteWorker",
          payload: deletedWorker.sid
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
      .catch(err => {
        if (typeof err.response.data.error === "object" ){
          resultMessage = `Failed to delete worker ${deletedWorker.sid}`;
        } else {
          resultMessage = err.response.data.error;
        }
        console.error(resultMessage, {
          error: err
        });
        updateLoading({
          ...loading,
          overlayMessage: "Error Deleting Triton User",
          saveStatus: ModalOverlayStatuses.FAIL,
          saveUser: true
        });
      });
  };

  const wtf = () => {
    console.log("**WWHHHAATTT TFF");
  };

  return (
    <DeleteTritonUserWrapper>
      <Text>This user will be deleted/deactivated from the checked systems.</Text>
      <CheckboxWrapper>
        { workerOpts.systems.triton && <>
          <FormControlLabel
            control={
              <Radio
                checked={deleteTriton}
                value="triton"
                onClick={() => setDeleteTriton(!deleteTriton)}
              />}
            label="Triton"
            labelPlacement="bottom"
          />
        </>}
        { workerOpts.systems.calabrio_qm && <>
          <FormControlLabel
            control={
              <Radio
                checked={deleteCalabrioQm}
                onChange={event => setDeleteClabrioQm(event.target.checked)}
                value="calabrio-qm"
              />}
            label="Calabrio QM"
            labelPlacement="bottom"
          />
        </>}
        { workerOpts.systems.calabrio_wfm && <>
          <FormControlLabel
            control={
              <Radio
                checked={deleteCalabrioWfm}
                onChange={event => setDeleteCalabrioWfm(event.target.checked)}
                value="calabrio-wfm"
              />}
            label="Calabrio WFM"
            labelPlacement="bottom"
          />
        </>}
      </CheckboxWrapper>
      { isWorkerDid ?
        <ForwardToEntryForm
          label={"This user has a direct dial number. Please choose a forward to option before confirming."}
          updateForwardTo={(inactiveForwardTo: string) => setWorkerOpts({
            ...workerOpts,
            worker: {
              ...workerOpts.worker,
              inactiveForwardTo
            }
          })}
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