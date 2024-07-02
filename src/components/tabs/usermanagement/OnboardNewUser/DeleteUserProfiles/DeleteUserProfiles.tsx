import { DeleteTritonUserProps } from "usermanagement/DeleteUserProfiles.Interfaces";
import {
  ButtonWrapper,
  UserFormButton,
  StyledDivider
} from "usermanagement/UserEntryFormWrapper.Styles";
import {
  DeleteTritonUserWrapper,
  Text,
  CheckboxWrapper
} from "usermanagement/DeleteUserProfiles.Styles";
import { ForwardToEntryForm } from "usermanagement/ForwardToEntryForm";
import {
  useAdminState,
  useFormState,
  useFormDispatch
} from "context/appContext";
import { userFormActions } from "context/userFormReducer";
import { timeouts } from "globals";
import { ModalOverlayStatuses } from "globals/interfaces";
import React from "react";
import { terminateUser } from "services/terminateUser";
import { wait } from "utils";
import { logger } from "utils/logger";
import { Checkbox } from "@mui/material";

export const DeleteTritonUser = (props: DeleteTritonUserProps): any => {
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
  const { nNumber } = state.userContext;
  const form = useFormState();
  const setForm = useFormDispatch();

  const isWorkerDid = form.triton.didUser;
  const [requireForwardTo, setRequireForwardTo] = React.useState(false);
  const [forwardToError, setForwardToError] = React.useState(false);
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
    const tritonWorkerName = form.triton.attributes ? `${form.triton.attributes?.emp_first_name} ${form.triton.attributes?.emp_last_name}` : null;
    const workerName = tritonWorkerName || form.triton.displayId || form.triton.DisplayName;
    const termDate = new Date().toISOString().split("T")[0];

    updateLoading({
      ...loading,
      overlayMessage: `Deleting user: ${workerName}`,
      saveStatus: ModalOverlayStatuses.SAVING,
      saveUser: true
    });
    let resultMessage;

    const body: any = {
      nNumber: form.triton.attributes?.n_number,
      workerSid: form.triton.sid,
      email: form.triton.attributes?.email_address || form.triton.attributes?.email,
      firstName: form.triton.attributes?.emp_first_name,
      lastName: form.triton.attributes?.emp_last_name,
      systems: [],
      terminationDate: termDate,
      inactiveForwardTo: isWorkerDid ? form.triton.inactiveForwardTo.value : ""
    };
    if (profilesToDelete.triton) {
      body.systems.push("TRITON");
    }
    if (profilesToDelete.calabrioQm) {
      body.systems.push("QM");
    }

    terminateUser(body)
      .then(() => {
        resultMessage = `Successfully marked Triton worker for delete in ${body.systems}`;
        const overlayMessage = "Successfully Deleted User";

        logger.info(resultMessage, {
          nNumber,
          workerSid: form.triton.sid,
          userNNumber: form.triton.attributes?.n_number
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
        const resultDivs = [<div>Failed to Terminate Worker. </div>];
        let results = error.response?.data?.error?.results;
        results = typeof results === "object" ? results : [];
        const forwardToFailure = results[0] && JSON.parse(results[0].body).forwardToFailure;
        if (forwardToFailure) {
          setRequireForwardTo(true);
          setForwardToError(true);
          updateLoading({
            lookupUser: false,
            overlayMessage: "",
            saveStatus: null,
            saveUser: false
          });
        } else {
          if (results.length > 0) {
            results.forEach((r: any) => {
              if (typeof r === "object") {
                const body = JSON.parse(r.body) || "";
                if (body)
                { resultDivs.push(<div>{body.message}</div>); }
              } else {
                resultDivs.push(<div>{r}</div>);
              }
            });
          }
          resultMessage = resultDivs;

          logger.error(results, {
            error,
            nNumber,
            tritonWorker: form.triton
          });

          if (results[0]?.statusCode === 200) {
            updateLoading({
              ...loading,
              overlayMessage: resultMessage,
              saveStatus: ModalOverlayStatuses.PARTIAL_FAIL,
              saveUser: true
            });
          } else {
            updateLoading({
              ...loading,
              overlayMessage: resultMessage,
              saveStatus: ModalOverlayStatuses.FAIL,
              saveUser: true
            });
          }
        }
      });
  };

  return (
    <DeleteTritonUserWrapper>
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
            onChange={() => handleSystemSelection("triton")}
          />
          <Text>Triton</Text>
        </CheckboxWrapper>
        <CheckboxWrapper>
          <Checkbox
            checked={profilesToDelete.calabrioQm}
            onChange={() => handleSystemSelection("calabrioQm")}
            style={{
              marginLeft: "125px"
            }}
          /> <Text>Calabrio QM</Text>
        </CheckboxWrapper>
      </div>
      {isWorkerDid ?
        <>
          {!forwardToError &&
            <>
              <Text>Confirm Delete to allow the system to identify the forward to option for this DID user.</Text>
              <UserFormButton style={{
                width: "400px",
                alignSelf: "center"
              }} onClick={() => setRequireForwardTo(!requireForwardTo)} >
                Manually select forward to option
              </UserFormButton>
            </>
          }
          {(requireForwardTo || forwardToError) &&
            <ForwardToEntryForm
              label={forwardToError ? "The system failed to identify the DID's forward to option, please manually select it and try again." : "This user has a direct dial number. Please choose a forward to option before confirming."}
              updateForwardTo={
                (inactiveForwardTo: string) => {
                  setForm({
                    type: userFormActions.UPDATE_INACTIVE_FORWARD_TO,
                    payload: inactiveForwardTo
                  });
                }
              }
            />
          }
        </>
        : null
      }
      <ButtonWrapper>
        <UserFormButton onClick={handleClose}>
          Close
        </UserFormButton>
        <UserFormButton
          disabled={requireForwardTo && !form.triton.inactiveForwardTo.value}
          onClick={handleDeleteUser}
        >
          Confirm Delete
        </UserFormButton>
      </ButtonWrapper>
    </DeleteTritonUserWrapper>
  );
};