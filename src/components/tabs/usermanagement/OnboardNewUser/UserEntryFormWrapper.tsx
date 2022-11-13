import {
  LoadingState,
  UserEntryFormProps
} from "./UserEntryFormWrapper.Interfaces";
import {
  Header1,
  Header2,
  Header4,
  Text,
  ModalContainer,
  DiscrepancyContainer
} from "./UserEntryFormWrapper.Styles";
import {
  ModalOverlay,
  BasicFormInfo,
  CallRecordingForm,
  SkillsFormInfo,
  UserFormButtons
} from "components";
import {
  useFormState,
  useAdminState
} from "context";
import { formModes } from "globals";
import React, { useState } from "react";
import { sortWorkersByFullName } from "utils";

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
  const [forwardToToggle, setForwardToToggle] = useState(false);

  console.log("FORM", form);

  const [loading, updateLoading] = useState<LoadingState>({
    lookupUser: false,
    overlayMessage: "",
    saveStatus: null,
    saveUser: false
  });

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
      <Header1>{form.formMode === formModes.INSERT ? "Add a User" : "Edit User"}</Header1>
      {
        form.formMode === formModes.UPDATE
          ? <Header2>{worker.attributes.full_name}</Header2>
          : null
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
      <h2>Triton User Settings</h2>
      <BasicFormInfo
        skills={skills}
        worker={worker}
        workers={workers}
        profiles={profiles}
        managers={managers}
        forwardToToggle={forwardToToggle}
        setForwardToToggle={setForwardToToggle}
      />
      <SkillsFormInfo />
      <h2>Calabrio Quality Management User Settings</h2>
      <CallRecordingForm twilioWorker={worker} />
      <UserFormButtons
        forwardToToggle={forwardToToggle}
        handleClose={handleClose}
        loading={loading}
        offices={offices}
        profiles={profiles}
        updateLoading={updateLoading}
        worker={worker}
      />
    </ModalContainer>
  );
};

export default UserEntryForm;