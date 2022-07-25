import { UserFormButtonsProps } from "./UserEntryForm.Interfaces";
import {
  ButtonWrapper,
  UserFormButton
} from "./UserEntryForm.Styles";
import {
  Modal,
  Tooltip
} from "@material-ui/core";
import { MergeUsersModal } from "components";
import {
  useAdminDispatch,
  useAdminState,
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
  createCalabrioUser,
  createUser,
  fetchUser,
  updateUser
} from "services";
import {
  checkConflictingUsers,
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

  const users = useAdminState().calabrioContext.users;
  const dispatch = useAdminDispatch();
  const form = useFormState();
  const setForm = useFormDispatch();
  const [ mergeUsersModalState, setMergeUsersModalState ] = React.useState({
    open: false,
    permanentUser: null
  });

  const doCreateUser = () => {
    updateLoading({
      ...loading,
      overlayMessage: "Adding new user...",
      saveStatus: modalOverlayStatuses.SAVING,
      saveUser: true
    });

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
      manager_first_name: form.manager.value.manager_first_name,
      manager_last_name: form.manager.value.manager_last_name,
      manager_n_number: form.manager.value.manager_n_number,
      manager: form.nNumberFetchedUser.manager,
      n_number: form.nNumber.value.toLowerCase(),
      office_location_name: form.nNumberFetchedUser.officeName,
      office_location_number: form.nNumberFetchedUser.officeNumber,
      primary_dept_name: form.nNumberFetchedUser.departmentName,
      primary_dept_number: form.nNumberFetchedUser.departmentNumber,
      profile_id: form.profileId.value,
      unique_id: form.nNumber.value.toLowerCase()
    };

    const calabrioAttributes = {
      acdId: "", //populate with workerSid returned
      adLogin: `LM\\${form.nNumber.value.toLowerCase()}`,
      email: form.nNumberFetchedUser?.email,
      firstName: form.nNumberFetchedUser?.firstName,
      lastName: form.nNumberFetchedUser?.lastName,
      groupId: form.calabrioUser.team?.value,
      roles: form.calabrioUser.roles,
      scope: {
        groups: form.calabrioUser.scope.groups.filter((group: any) => group.checked).map((g: any) => g.groupId),
        teams: form.calabrioUser.scope.teams.filter((team: any) => team.checked).map((g: any) => g.groupId)
      }
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

        dispatch({
          type: "addWorkers",
          payload: [mapWorkerFromDbWorker(dbWorker)]
        });

        calabrioAttributes.acdId = dbWorker.workerSid;

        checkConflictingUsers(calabrioAttributes, users).then(() => {
          console.log("Calabrio Attributes sent for create user", calabrioAttributes);
          createCalabrioUser(calabrioAttributes).then(() => {
            setMergeUsersModalState({
              open: true,
              permanentUser: calabrioAttributes
            });
          });
        }).catch(err => {
          console.error("Error Creating Calabrio User", err);
          updateLoading({
            ...loading,
            overlayMessage: "Triton User Created. Error Creating Calabrio User",
            saveStatus: modalOverlayStatuses.PARTIAL_FAIL,
            saveUser: true
          });
        });
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

  const doUpdateUser =  async () => {
    updateLoading({
      ...loading,
      overlayMessage: `Updating user: ${worker.attributes.full_name}`,
      saveStatus: modalOverlayStatuses.SAVING,
      saveUser: true
    });
    const attributes: Partial<Worker["attributes"]> = {};
    if (form.manager.updated) {
      attributes.manager_first_name = form.manager.value.manager_first_name;
      attributes.manager_last_name = form.manager.value.manager_last_name;
      attributes.manager_n_number = form.manager.value.manager_n_number;
      attributes.manager = form.manager.value.manager_first_name + " " + form.manager.value.manager_last_name;
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
    const nNumberFetchedUser = await fetchUser(form.nNumber.value);
    if(nNumberFetchedUser){
      nNumberFetchedUser.departmentNumber ? attributes.department_id = nNumberFetchedUser.departmentNumber : null;
      nNumberFetchedUser.departmentName ? attributes.department_name = nNumberFetchedUser.departmentName: null;
      nNumberFetchedUser.departmentName ? attributes.location = nNumberFetchedUser.departmentName: null;
    }

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
        setForm({
          type: userFormActions.RESET_FORM
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

  const handleCloseMergeUsersModal = (reopen: boolean) => {
    if(form.formMode === formModes.INSERT){
      handleClose(reopen);
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
    } else {
      handleClose(reopen);
    }
  };

  return (
    <ButtonWrapper>
      <Modal disableBackdropClick={true} open={mergeUsersModalState.open}>
        <MergeUsersModal
          loading={loading}
          updateLoading={updateLoading}
          handleClose={handleCloseMergeUsersModal}
          mergeUsersModalState={mergeUsersModalState}
          setMergeUsersModalState={setMergeUsersModalState}
        />
      </Modal>
      <UserFormButton onClick={() => {
        handleClose();
        setForm({
          type: userFormActions.RESET_FORM
        });
      }}>
          Close
      </UserFormButton>
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
    </ButtonWrapper>
  );
};

export default UserFormButtons;