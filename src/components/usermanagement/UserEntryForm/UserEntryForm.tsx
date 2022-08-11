import {
  LoadingState,
  UserEntryFormProps
} from "./UserEntryForm.Interfaces";
import {
  Header1,
  Header2,
  Header4,
  Text,
  ModalContainer,
  DiscrepancyContainer
} from "./UserEntryForm.Styles";
import {
  ModalOverlay,
  UserFormAccordion,
  UserFormButtons
} from "components";
import {
  useFormState,
  useAdminState
} from "context";
import { formModes } from "globals";
import React, { useState } from "react";

const UserEntryForm = (props: UserEntryFormProps) => {

  const {
    handleClose,
    worker,
    skills,
    workers
  } = props;

  const {
    officeContext: {
      offices
    },
    profileContext: {
      profiles
    },
    managerContext: {
      managers
    }
  } = useAdminState();

  const form = useFormState();
  const [forwardToToggle, setForwardToToggle] = useState(false);

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
      <UserFormAccordion
        forwardToToggle={forwardToToggle}
        managers={managers}
        profiles={profiles}
        setForwardToToggle={setForwardToToggle}
        skills={skills}
        worker={worker}
        workers={workers}
      />
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