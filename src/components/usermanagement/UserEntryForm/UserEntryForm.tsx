import { Tab } from "@material-ui/core";
import {
  Header1,
  Header2,
  ModalContainer,
  TabContainer,
  UserFormTabs
} from "./UserEntryFormStyles";
import {
  ModalOverlay,
  SkillsFormInfo,
  BasicFormInfo,
  DidFormInfo,
  UserFormButtons
} from "components";
import {
  useAdminState,
  useFormState,
  useFormDispatch,
  userFormActions
} from "context";
import {
  formModes,
  LoadingState,
  UserEntryFormProps
} from "globals";
import React, { useState } from "react";

const UserEntryForm = (props: UserEntryFormProps, ref: null) => {

  const {
    handleClose,
    userEntryFormState: {
      formMode,
      worker
    },
    skills,
    workers
  } = props;

  const form = useFormState();
  console.log("**Form: ", form);
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

  if(formMode === formModes.UPDATE && form.formMode !== formModes.UPDATE) {
    setForm({
      type: userFormActions.SET_UPDATE_FORM_STATE,
      payload: {
        worker,
        managers,
        formMode: formModes.UPDATE
      }
    });
  }

  const [profileHasZeroOutEnabled, setProfileHasZeroOutEnabled] = React.useState(form.zeroOutEnabled);
  const [forwardToToggle, setForwardToToggle] = useState(false);
  const [loading, updateLoading] = useState<LoadingState>({
    lookupUser: false,
    overlayMessage: "",
    saveStatus: null,
    saveUser: false
  });

  const defaultView = {
    tab: 0,
    view: <BasicFormInfo
      form={form}
      setForm={setForm}
      skills={skills}
      worker={worker}
      workers={workers}
      profiles={profiles}
      managers={managers}
      forwardToToggle={forwardToToggle}
      setForwardToToggle={setForwardToToggle}
      setProfileHasZeroOutEnabled={setProfileHasZeroOutEnabled}
    />
  };

  const didFormView = {
    tab: 1,
    view: <DidFormInfo
      form={form}
      setForm={setForm}
      skills={skills}
      worker={worker}
      workers={workers}
      profiles={profiles}
      forwardToToggle={forwardToToggle}
      profileHasZeroOutEnabled={profileHasZeroOutEnabled}
    />
  };

  const skillsView = {
    tab: 2,
    view: <SkillsFormInfo form={form} setForm={setForm} />
  };

  const [ activeTab, setActiveTab ] = React.useState(defaultView);

  const handleTabChange = (event: any, newValue: number) => {
    switch(newValue) {
      case 1:
        setActiveTab(didFormView);
        break;
      case 2:
        setActiveTab(skillsView);
        break;
      default:
        setActiveTab(defaultView);
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
      <Header1>{formMode === formModes.INSERT ? "Add a User" : "Edit User"}</Header1>
      {
        formMode === formModes.UPDATE
          ? <Header2>{worker.attributes.full_name}</Header2>
          : null
      }
      <TabContainer>
        <UserFormTabs
          value={activeTab.tab}
          onChange={handleTabChange}
          orientation="vertical"
        >
          <Tab label="Basic Info"/>
          <Tab label="DID Info"/>
          <Tab label="Default Skills"/>
        </UserFormTabs>
        {activeTab.view}
      </TabContainer>
      <UserFormButtons
        handleClose={handleClose}
        loading={loading}
        updateLoading={updateLoading}
        form={form}
        setForm={setForm}
        profiles={profiles}
        offices={offices}
        worker={worker}
        forwardToToggle={forwardToToggle}
      />
    </ModalContainer>
  );
};

export default React.forwardRef(UserEntryForm);