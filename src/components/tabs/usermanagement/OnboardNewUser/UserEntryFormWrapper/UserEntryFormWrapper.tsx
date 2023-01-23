import {
  UserAction,
  LoadingState,
  UserEntryFormProps
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
import { sortWorkersByFullName } from "utils";
import { Checkbox } from "@mui/material";

const UserEntryForm = (props: UserEntryFormProps) => {

  const {
    handleClose,
    setWorkerOpts,
    workerOpts
  } = props;

  const state = useAdminState();
  const skills = state.skillContext.skills;
  const worker = workerOpts.worker;
  const workers = state.workerContext.workers.sort(sortWorkersByFullName);
  const managers = state.managerContext.managers;
  const profiles = state.profileContext.profiles;
  const offices = state.officeContext.offices;

  const form = useFormState();
  const setForm = useFormDispatch();
  const [forwardToToggle, setForwardToToggle] = React.useState(false);

  console.log("FORM", form);

  const [loading, updateLoading] = React.useState<LoadingState>({
    lookupUser: false,
    overlayMessage: "",
    saveStatus: null,
    saveUser: false
  });

  const handleResetForm = () => {
    if(workerOpts.action === UserAction.ADD) {
      setForm({
        type: userFormActions.RESET_FORM_AFTER_ADD,
        payload: {
          managerValue: form.manager.value,
          outgoing: {
            value: form.outgoing.value,
            e164: form.outgoing.e164
          },
          profileIdValue: form.profileId.value,
          didUser: form.didUser
        }
      });
    } else {
      setForm({
        type: userFormActions.RESET_FORM
      });
      handleClose();
    }
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
      { workerOpts.action === UserAction.ADD && <Header1>Onboard New User</Header1> }
      { workerOpts.action === UserAction.EDIT && <Header1>Edit User</Header1> }
      { workerOpts.action === UserAction.DELETE && <Header1>Deactivate User</Header1> }
      { workerOpts.action !== UserAction.ADD && <Header2>{worker.attributes.full_name}</Header2> }
      { workerOpts.action === UserAction.DELETE &&
        <DeleteTritonUser
          handleClose={handleResetForm}
          loading={loading}
          workerOpts={workerOpts}
          setWorkerOpts={setWorkerOpts}
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
        { workerOpts.action !== UserAction.DELETE &&
          <Checkbox
            checked={workerOpts.systems.triton}
            onChange={(event: any) => handleCheckbox(event.target.checked, "triton")}
          />
        }
      </HeaderRow>
      { workerOpts.systems.triton && <BasicFormInfo
        skills={skills}
        worker={worker}
        workers={workers}
        profiles={profiles}
        managers={managers}
        forwardToToggle={forwardToToggle}
        setForwardToToggle={setForwardToToggle}
      /> }

      <StyledDivider />
      <HeaderRow>
        <h2>Calabrio Quality Management User Settings</h2>
        { workerOpts.action !== UserAction.DELETE &&
          <Checkbox
            checked={workerOpts.systems.calabrio_qm}
            onChange={(event: any) => handleCheckbox(event.target.checked, "calabrio_qm")}
          />
        }
      </HeaderRow>
      { workerOpts.systems.calabrio_qm && <CallRecordingForm twilioWorker={worker} /> }
      <StyledDivider />
      { workerOpts.action !== UserAction.DELETE && <UserFormButtons
        forwardToToggle={forwardToToggle}
        handleClose={handleResetForm}
        loading={loading}
        offices={offices}
        profiles={profiles}
        updateLoading={updateLoading}
        worker={worker}
      />
      }
    </ModalContainer>
  );
};

export default UserEntryForm;