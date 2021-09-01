import {
  Tooltip, Tabs, Tab
} from "@material-ui/core";
import {
  ButtonWrapper,
  Header1,
  Header2,
  ModalContainer,
  TabContainer
} from "./UserEntryFormStyles";
import {
  ModalOverlay,
  SkillsFormInfo,
  StyledButton,
  BasicFormInfo,
  DidFormInfo
} from "components";
import {
  useAdminDispatch,
  useAdminState,
  useFormState,
  useFormDispatch,
  userFormActions
} from "context";
import {
  formModes,
  modalOverlayStatuses,
  timeouts,
  LoadingState,
  UserEntryFormProps,
  TwilioWorker
} from "globals";
import React, { useState } from "react";
import {
  addOffice,
  createUser,
  updateUser
} from "services";
import {
  DbWorker,
  isFormValid,
  mapWorkerFromDbWorker,
  isDidDifferentValid,
  getOverflowSkill,
  isFormUpdated,
  getNonOverflowSkills,
  workerHasOverFlowSkill,
  wait
} from "utils";

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
  const dispatch = useAdminDispatch();
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


  const doCreateUser = () => {
    updateLoading({
      ...loading,
      overlayMessage: "Adding new user...",
      saveStatus: modalOverlayStatuses.SAVING,
      saveUser: true
    });
    const parsedManager = JSON.parse(form.manager.value);

    // see this wiki page for attributes that will be automatically updated through SSO
    // https://forge.lmig.com/wiki/display/CICCT/Twilio+Flex+SSO+Saml2+Integration
    const attributes: Partial<TwilioWorker["attributes"]> = {
      contact_uri: `client:${form.nNumber.value.toLowerCase()}`,
      default_skills: form.defaultSkills,
      did: form.outgoing.e164,
      email: form.nNumberFetchedUser.email,
      email_address: form.nNumberFetchedUser.email,
      emp_first_name: form.nNumberFetchedUser.firstName,
      emp_last_name: form.nNumberFetchedUser.lastName,
      extension: form.extension.value,
      full_name: `${form.nNumberFetchedUser.firstName} ${form.nNumberFetchedUser.lastName}`,
      manager_first_name: parsedManager.manager_first_name,
      manager_last_name: parsedManager.manager_last_name,
      manager_n_number: parsedManager.manager_n_number,
      n_number: form.nNumber.value.toLowerCase(),
      office_location_name: form.nNumberFetchedUser.officeName,
      office_location_number: form.nNumberFetchedUser.officeNumber,
      primary_dept_name: form.nNumberFetchedUser.departmentName,
      primary_dept_number: form.nNumberFetchedUser.departmentNumber,
      profile_id: form.profileId.value,
      unique_id: form.nNumber.value.toLowerCase()
    };
    if (getOverflowSkill(form, profiles) !== null && form.zeroOutEnabled && form.directDialNum.value) {
      attributes.routing = {
        skills: [getOverflowSkill(form, profiles)],
        levels: {}
      };
    }

    const createUserReqBody = form.directDialNum.value ?
      {
        attributes,
        activateEp: true,
        alternateDid: form.alternateDid.e164,
        directDialNum: form.directDialNum.e164,
        zeroOutEnabled: form.zeroOutEnabled
      } : {
        attributes,
        activateEp: false
      };

    createUser(createUserReqBody)
      .then(dbWorker => {
        if (!offices.get(dbWorker.attributes.office_location_number)) {
          const newOffice = {
            office_nme: dbWorker.attributes.office_location_name,
            office_num: dbWorker.attributes.office_location_number
          };
          addOffice(newOffice)
            .then(() => {
              dispatch({
                type: "addOffice",
                payload: newOffice
              });
            })
            .catch(error => {
              console.log(`Failed to add office: [${error}]`);
            });
        }
        setForm({
          type: "RESET_FORM_ON_CREATE"
        });
        dispatch({
          type: "addWorkers",
          payload: [mapWorkerFromDbWorker(dbWorker)]
        });
        updateLoading({
          ...loading,
          overlayMessage: "Successfully added new user",
          saveStatus: modalOverlayStatuses.SUCCESS,
          saveUser: true
        });
        wait(() => {
          updateLoading({
            ...loading,
            saveUser: false
          });
        }, timeouts.MODAL_OVERLAY);
      })
      .catch(err => {
        console.error(err.message, err.response.data);
        updateLoading({
          ...loading,
          overlayMessage: err.response.data.message || "Failed to add new user.",
          saveStatus: modalOverlayStatuses.FAIL,
          saveUser: true
        });
      });
  };

  const doUpdateUser = () => {
    updateLoading({
      ...loading,
      overlayMessage: `Updating user: ${worker.attributes.full_name}`,
      saveStatus: modalOverlayStatuses.SAVING,
      saveUser: true
    });
    const attributes: Partial<TwilioWorker["attributes"]> = {};
    if (form.manager.updated) {
      const parsedManager = JSON.parse(form.manager.value);
      attributes.manager_first_name = parsedManager.manager_first_name;
      attributes.manager_last_name = parsedManager.manager_last_name;
      attributes.manager_n_number = parsedManager.manager_n_number;
    }
    if (form.profileId.updated) {
      attributes.profile_id = form.profileId.value;
    }
    if (form.outgoing.updated) {
      attributes.did = form.outgoing.e164;
    }
    if (form.extension.updated) {
      attributes.extension = form.extension.value;
    }
    if (form.defaultSkillsUpdated) {
      attributes.default_skills = form.defaultSkills;
    }
    // update overflow skill
    const overflowSkill = getOverflowSkill(form, profiles);
    if ((form.zeroOutEnabledUpdated || form.profileId.updated) && form.zeroOutEnabled) {
      attributes.routing = {
        skills: [
          ...getNonOverflowSkills(worker, profiles),
          overflowSkill
        ],
        levels: worker.attributes.routing.levels
      };
    }
    // remove overflow skill
    if (!form.zeroOutEnabled && workerHasOverFlowSkill(worker, profiles)) {
      attributes.routing = {
        skills: getNonOverflowSkills(worker, profiles),
        levels: worker.attributes.routing.levels
      };
    }

    const payload: Partial<DbWorker> = {
      attributes,
      zeroOutEnabled: form.zeroOutEnabled
    };

    if (form.alternateDid.updated) {
      payload.alternateDid = form.alternateDid.e164;
    }
    if (form.directDialNum.updated) {
      payload.directDialNum = form.directDialNum.e164;
      payload.activateEp = true;
    }
    if (form.inactiveForwardTo.value !== null && form.inactiveForwardTo.updated) {
      payload.inactiveForwardTo = form.inactiveForwardTo.value;
    }

    updateUser(worker.sid, payload)
      .then(dbWorker => {
        dispatch(({
          type: "updateWorker",
          payload: mapWorkerFromDbWorker(dbWorker)
        }));

        updateLoading({
          ...loading,
          overlayMessage: `Successfully updated user: ${worker.attributes.full_name}`,
          saveStatus: modalOverlayStatuses.SUCCESS,
          saveUser: true
        });
        wait(handleClose, timeouts.MODAL_OVERLAY);
      })
      .catch(err => {
        console.error(err);
        updateLoading({
          ...loading,
          overlayMessage: err.response?.data.message || `Failed to update user: ${worker.attributes.full_name}`,
          saveStatus: modalOverlayStatuses.FAIL,
          saveUser: true
        });
      });
  };

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
        <Tabs
          value={activeTab.tab}
          onChange={handleTabChange}
          orientation="vertical"
        >
          <Tab label="Basic Info"/>
          <Tab label="DID Info"/>
          <Tab label="Default Skills"/>
        </Tabs>
        {activeTab.view}
      </TabContainer>
      <ButtonWrapper>
        <Tooltip
          title={
            form.didUser && !isDidDifferentValid(form, worker, forwardToToggle) ?
              "You must edit Outgoing Number and Internal Routing before saving" : ""
          }
          placement={"bottom-start"}
          leaveDelay={500}
          arrow
        >
          <span>
            <StyledButton
              disabled={formMode === formModes.INSERT ? !isFormValid(form, worker, forwardToToggle) : (!isFormUpdated(form) || !isFormValid(form, worker, forwardToToggle))}
              onClick={formMode === formModes.INSERT ? doCreateUser : doUpdateUser}
            >
              {formMode === formModes.INSERT ? "Add User" : "Save User"}
            </StyledButton>
          </span>
        </Tooltip>
        <StyledButton
          onClick={() => {
            handleClose();
            setForm({ type: userFormActions.RESET_FORM_ON_CREATE });
          }}
        >
          Close
        </StyledButton>
      </ButtonWrapper>
    </ModalContainer>
  );
};

export default React.forwardRef(UserEntryForm);