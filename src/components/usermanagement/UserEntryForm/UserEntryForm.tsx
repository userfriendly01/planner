import {
  LoadingState,
  UserEntryFormProps
} from "./UserEntryForm.Interfaces";
import {
  Header1,
  Header2,
  ModalContainer
} from "./UserEntryForm.Styles";
import {
  ModalOverlay,
  UserFormAccordion,
  UserFormButtons
} from "components";
import {
  useFormDispatch,
  useFormState,
  useAdminState,
  userFormActions
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

  const form = useFormState();
  const setForm = useFormDispatch();

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

  const [forwardToToggle, setForwardToToggle] = useState(false);

  const [loading, updateLoading] = useState<LoadingState>({
    lookupUser: false,
    overlayMessage: "",
    saveStatus: null,
    saveUser: false
  });

  const doHandleClose = () => {
    handleClose();
    setForm({
      type: userFormActions.RESET_FORM
    });
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
      <Header1>{form.formMode === formModes.INSERT ? "Add a User" : "Edit User"}</Header1>
      {
        form.formMode === formModes.UPDATE
          ? <Header2>{worker.attributes.full_name}</Header2>
          : null
      }
      <UserFormAccordion
        form={form}
        skills={skills}
        worker={worker}
        workers={workers}
        profiles={profiles}
        managers={managers}
        forwardToToggle={forwardToToggle}
        setForwardToToggle={setForwardToToggle}
      />
      <UserFormButtons
        handleClose={doHandleClose}
        setUserModalState={handleClose}
        loading={loading}
        updateLoading={updateLoading}
        profiles={profiles}
        offices={offices}
        worker={worker}
        forwardToToggle={forwardToToggle}
      />
    </ModalContainer>
  );
};

export default UserEntryForm;