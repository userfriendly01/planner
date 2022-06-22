import { UserFormButtonsProps } from "./UserEntryForm.Interfaces";
import {
  ButtonWrapper,
  UserFormButton
} from "./UserEntryForm.Styles";
import { Tooltip } from "@material-ui/core";
import {
  useAdminDispatch,
  useFormDispatch,
  useFormState,
  userFormActions
} from "context";
import {
  formModes,
  modalOverlayStatuses,
  timeouts,
  Worker
} from "globals";
import React from "react";
import {
  addOffice,
  createUser,
  updateUser
} from "services";
import {
  DbWorker,
  getNonOverflowSkills,
  getOverflowSkillFromProfile,
  isDidDifferentValid,
  isFormUpdated,
  isFormValid,
  mapWorkerFromDbWorker,
  wait,
  workerHasOverFlowSkill
} from "utils";

const UserFormButtons = (props: UserFormButtonsProps) => {

  const {
    handleClose,
    loading,
    updateLoading,
    profiles,
    offices,
    worker,
    forwardToToggle
  } = props;

  const dispatch = useAdminDispatch();
  const form = useFormState();
  const setForm = useFormDispatch();

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
    const attributes: Partial<Worker["attributes"]> = {
      contact_uri: `client:${form.nNumber.value.toLowerCase()}`,
      default_skills: form.defaultSkills,
      department_id: form.nNumberFetchedUser.departmentNumber,// need this value otherwise the department_name will not appear in flex insights,
      department_name: form.nNumberFetchedUser.departmentName,
      did: form.outgoing.e164,
      email: form.nNumberFetchedUser.email,
      email_address: form.nNumberFetchedUser.email,
      emp_first_name: form.nNumberFetchedUser.firstName,
      emp_last_name: form.nNumberFetchedUser.lastName,
      extension: form.extension.value,
      full_name: `${form.nNumberFetchedUser.firstName} ${form.nNumberFetchedUser.lastName}`,
      location: form.nNumberFetchedUser.officeName,
      manager_first_name: parsedManager.manager_first_name,
      manager_last_name: parsedManager.manager_last_name,
      manager_n_number: parsedManager.manager_n_number,
      manager: form.nNumberFetchedUser.manager,
      n_number: form.nNumber.value.toLowerCase(),
      office_location_name: form.nNumberFetchedUser.officeName,
      office_location_number: form.nNumberFetchedUser.officeNumber,
      primary_dept_name: form.nNumberFetchedUser.departmentName,
      primary_dept_number: form.nNumberFetchedUser.departmentNumber,
      profile_id: form.profileId.value,
      sip: form.didUser ? true : false,
      unique_id: form.nNumber.value.toLowerCase()
    };

    const overflowSkill = getOverflowSkillFromProfile(profiles, form.profileId.value);
    if (overflowSkill !== undefined && form.zeroOutEnabled && form.directDialNum.value) {
      attributes.routing = {
        skills: [overflowSkill],
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
        setForm({ type: userFormActions.SET_USER_PREVIOUSLY_ADDED_TRUE });
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
    console.log(`form atrtibutes: ${form.nNumberFetchedUser}`)
    console.log(`form: ${JSON.stringify(form)}`)
    updateLoading({
      ...loading,
      overlayMessage: `Updating user: ${worker.attributes.full_name}`,
      saveStatus: modalOverlayStatuses.SAVING,
      saveUser: true
    });
    const attributes: Partial<Worker["attributes"]> = {};
    if (form.manager.updated) {
      const parsedManager = JSON.parse(form.manager.value);
      attributes.manager_first_name = parsedManager.manager_first_name;
      attributes.manager_last_name = parsedManager.manager_last_name;
      attributes.manager_n_number = parsedManager.manager_n_number;
      attributes.manager = parsedManager.manager_first_name + ' ' + parsedManager.manager_last_name;
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
    attributes.department_id = form.nNumberFetchedUser.departmentNumber;
    attributes.department_name = form.nNumberFetchedUser.departmentName;
    attributes.location = form.nNumberFetchedUser.departmentName

    // update overflow skill
    const overflowSkill = getOverflowSkillFromProfile(profiles, form.profileId.value);
    const nonOverflowSkills: string[] = getNonOverflowSkills(worker, profiles) ? getNonOverflowSkills(worker, profiles) : [];
    const levels = worker.attributes?.routing?.levels ? worker.attributes.routing.levels : {};
    if ((form.zeroOutEnabledUpdated || form.profileId.updated) && form.zeroOutEnabled) {
      attributes.routing = {
        skills: [
          ...nonOverflowSkills,
          overflowSkill
        ],
        levels: levels
      };
    }
    // remove overflow skill
    if (!form.zeroOutEnabled && workerHasOverFlowSkill(worker, profiles)) {
      attributes.routing = {
        skills: nonOverflowSkills,
        levels: levels
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

  return (
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
          <UserFormButton
            disabled={form.formMode === formModes.INSERT ? !isFormValid(form, worker, forwardToToggle) : (!isFormUpdated(form) || !isFormValid(form, worker, forwardToToggle))}
            onClick={form.formMode === formModes.INSERT ? doCreateUser : doUpdateUser}
          >
            {form.formMode === formModes.INSERT ? "Add User" : "Save User"}
          </UserFormButton>
        </span>
      </Tooltip>
      <UserFormButton
        onClick={() => {
          handleClose();
          setForm({ type: userFormActions.RESET_FORM });
        }}
      >
          Close
      </UserFormButton>
    </ButtonWrapper>
  );
};

export default UserFormButtons;