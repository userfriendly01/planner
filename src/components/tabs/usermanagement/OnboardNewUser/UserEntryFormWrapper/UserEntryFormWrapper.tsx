import {
  UserAction,
  LoadingState,
  WorkerOpts
} from "./UserEntryFormWrapper.Interfaces";
import {
  DiscrepancyContainer,
  Header1,
  Header2,
  Header4,
  HeaderRow,
  ModalContainer,
  StyledDivider,
  Text
} from "./UserEntryFormWrapper.Styles";
import {
  DeleteTritonUser,
  ModalOverlay,
  BasicFormInfo,
  CallRecordingForm,
  UserFormButtons
} from "components";
import {
  useFormState,
  useAdminState,
  useFormDispatch,
  userFormActions
} from "context";
import React from "react";
import { useNavigate } from "react-router-dom";
import { sortWorkersByFullName } from "utils";
import { formModes } from "globals";
import { Checkbox } from "@mui/material";

const UserEntryForm = () => {

  const defaultWorkerOpts: WorkerOpts = {
    action: UserAction.ADD,
    systems: {
      triton: true,
      calabrio_qm: true,
      calabrio_wfm: false
    }
  };

  const state = useAdminState();
  const form = useFormState();
  const setForm = useFormDispatch();
  const navigate = useNavigate();

  const skills = state.skillContext.skills;
  const workers = state.workerContext.workers.sort(sortWorkersByFullName);
  const tritonWorker = workers.find((w: any) => w?.attributes.n_number === form.nNumber.value);
  const managers = state.managerContext.managers;
  const profiles = state.profileContext.profiles;
  const offices = state.officeContext.offices;

  const [ workerOpts, setWorkerOpts ] = React.useState(defaultWorkerOpts);
  const [ forwardToToggle, setForwardToToggle ] = React.useState(false);
  const [loading, updateLoading] = React.useState<LoadingState>({
    lookupUser: false,
    overlayMessage: "",
    saveStatus: null,
    saveUser: false
  });

  React.useEffect(() => {

    return () => {
      setForm({ type: userFormActions.RESET_FORM });
    };
  }, []);

  console.log("FORM", form);

  const handleResetForm = () => {
    navigate(-1);
    setForm({ type: userFormActions.RESET_FORM });
  };

  const handleCheckbox = (checked: boolean, system: string) => {
    if(!checked && system === "calabrio_qm"){
      console.log("Please select a reason for skipping the calabrio profile.", checked);
      setWorkerOpts({
        ...workerOpts,
        systems: {
          ...workerOpts.systems,
          [system]: checked
        }
      });
    } else {
      setWorkerOpts({
        ...workerOpts,
        systems: {
          ...workerOpts.systems,
          [system]: checked
        }
      });
    }
  };

  return (
    <ModalContainer>
      {loading.saveUser ?
        <ModalOverlay
          status={loading.saveStatus}
          message={loading.overlayMessage}
          handleClose={() => {
            updateLoading({
              ...loading,
              saveUser: false
            });
          }}
        /> : null}
      { form.formMode === formModes.INSERT && <Header1>Onboard New User</Header1> }
      { form.formMode === formModes.UPDATE && <Header1>Edit User</Header1> }
      { form.formMode === formModes.DELETE && <Header1>Deactivate User</Header1> }
      { form.formMode !== formModes.INSERT && <Header2>{`${tritonWorker?.attributes.emp_first_name} ${tritonWorker?.attributes.emp_last_name}`}</Header2> }
      { form.formMode === formModes.DELETE &&
        <DeleteTritonUser
          handleClose={handleResetForm}
          loading={loading}
          workerOpts={workerOpts}
          updateLoading={updateLoading}
        />
      }
      {
        form.discrepancies.length > 0
          ? <DiscrepancyContainer>
            <Header4>Discrepencies have been found for this worker. They will be corrected when you hit Save User </Header4>
            {
              form.discrepancies.map((d:any, index: number) => {
                return (
                  <Text key={index}>{d.message}</Text>
                );
              })
            }
          </DiscrepancyContainer>
          : null
      }
      <StyledDivider />
      <HeaderRow>
        <h2>Triton User Settings</h2>
        { form.formMode !== formModes.DELETE &&
          <Checkbox
            checked={workerOpts.systems.triton}
            onChange={(event: any) => handleCheckbox(event.target.checked, "triton")}
          />
        }
      </HeaderRow>
      { workerOpts.systems.triton && <BasicFormInfo
        skills={skills}
        worker={tritonWorker}
        workers={workers}
        profiles={profiles}
        managers={managers}
        forwardToToggle={forwardToToggle}
        setForwardToToggle={setForwardToToggle}
      /> }

      <StyledDivider />
      <HeaderRow>
        <h2>Calabrio Quality Management User Settings</h2>
        { form.formMode !== formModes.DELETE &&
          <Checkbox
            checked={workerOpts.systems.calabrio_qm}
            onChange={(event: any) => handleCheckbox(event.target.checked, "calabrio_qm")}
          />
        }
      </HeaderRow>
      { workerOpts.systems.calabrio_qm && <CallRecordingForm twilioWorker={tritonWorker} /> }
      <StyledDivider />
      { form.formMode !== formModes.DELETE && <UserFormButtons
        forwardToToggle={forwardToToggle}
        handleClose={handleResetForm}
        loading={loading}
        offices={offices}
        profiles={profiles}
        updateLoading={updateLoading}
        worker={tritonWorker}
      />
      }
    </ModalContainer>
  );
};

export default UserEntryForm;