import { DeleteTritonUserProps } from "./DeleteUserProfiles.Interfaces";
import {
  ButtonWrapper,
  UserFormButton,
  StyledDivider
} from "../UserEntryFormWrapper/UserEntryFormWrapper.Styles";
import {
  DeleteTritonUserWrapper,
  Text,
  CheckboxWrapper
} from "./DeleteUserProfiles.Styles";
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
import { terminateUser } from "services";
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
    const tritonWorkerName = tritonWorker.attributes ? `${tritonWorker.attributes?.emp_first_name} ${tritonWorker.attributes?.emp_last_name}` : null;
    const workerName = tritonWorkerName || tritonWorker.displayId || tritonWorker.DisplayName;
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

    terminateUser(body)
      .then(response => {
        resultMessage = `Successfully marked Triton worker for delete in ${body.systems}`;
        const overlayMessage = "Successfully Deleted User";

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
                  resultDivs.push(<div>{body.message}</div>);
              } else {
                resultDivs.push(<div>{r}</div>);
              }
            });
          }
          resultMessage = resultDivs;

          logger.error(results, {
            error,
            nNumber,
            tritonWorker
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
              <UserFormButton style={{ width: "400px", alignSelf: "center" }} onClick={() => setRequireForwardTo(!requireForwardTo)} >
                Manually select forward to option
              </UserFormButton>
            </>
          }
          {(requireForwardTo || forwardToError) &&
            <ForwardToEntryForm
              label={forwardToError ? "The system failed to identify the DID's forward to option, please manually select it and try again." : "This user has a direct dial number. Please choose a forward to option before confirming."}
              updateForwardTo={
                (inactiveForwardTo: string) => {
                  tritonWorker.inactiveForwardTo = inactiveForwardTo;
                  if (inactiveForwardTo) {
                    setRequireForwardTo(false);
                  } else {
                    setRequireForwardTo(true);
                  }
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
          disabled={requireForwardTo}
          onClick={handleDeleteUser}
        >
          Confirm Delete
        </UserFormButton>
      </ButtonWrapper>
    </DeleteTritonUserWrapper>
  );
};

export default DeleteTritonUser;