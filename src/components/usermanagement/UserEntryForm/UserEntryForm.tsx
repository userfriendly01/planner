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
    worker,
    skills,
    workers
  } = props;

  const form = useFormState();
  const setForm = useFormDispatch();
  console.log("**Form: ", form);

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

  const defaultView = {
    tab: 0,
    view: <BasicFormInfo
      skills={skills}
      worker={worker}
      workers={workers}
      profiles={profiles}
      managers={managers}
      forwardToToggle={forwardToToggle}
      setForwardToToggle={setForwardToToggle}
    />
  };

  const didFormView = {
    tab: 1,
    view: <DidFormInfo
      worker={worker}
      profiles={profiles}
    />
  };

  const skillsView = {
    tab: 2,
    view: <SkillsFormInfo />
  };

  const [ activeTab, setActiveTab ] = React.useState(defaultView);
  const doHandleClose = () => {
    handleClose();
    setForm({
      type: userFormActions.RESET_FORM
    });
  };

  const handleTabChange = (newValue: number) => {
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
      <Header1>{form.formMode === formModes.INSERT ? "Add a User" : "Edit User"}</Header1>
      {
        form.formMode === formModes.UPDATE
          ? <Header2>{worker.attributes.full_name}</Header2>
          : null
      }
      <TabContainer>
        <UserFormTabs
          value={activeTab.tab}
          onChange={(event, tab) => handleTabChange(tab)}
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
        profiles={profiles}
        offices={offices}
        worker={worker}
        forwardToToggle={forwardToToggle}
      />
    </ModalContainer>
  );
};

export default React.forwardRef(UserEntryForm);