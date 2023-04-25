import {
  ButtonWrapper,
  UserFormButton
} from "../UserEntryFormWrapper/UserEntryFormWrapper.Styles";
import {
  UserFormButtonsProps
} from "../UserEntryFormWrapper/UserEntryFormWrapper.Interfaces";
import {
  useAdminDispatch,
  useAdminState,
  useFormState,
  useFormDispatch,
  userFormActions
} from "context";
import {
  formModes,
  ModalOverlayStatuses,
  timeouts,
  Worker
} from "globals";
import React from "react";
import {
  addOffice,
  createCalabrioUser,
  createUser,
  fetchUser as fetchUserServiceCall,
  getCalabrioUsers,
  updateUser,
  updateCalabrioUser
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
import { Tooltip } from "@mui/material";

const UserFormButtons = (props: UserFormButtonsProps) => {

  const {
    forwardToToggle,
    handleClose,
    loading,
    offices,
    profiles,
    updateLoading,
    worker
  } = props;

  const {
    users,
    roles,
    teams
  } = useAdminState().calabrioContext;

  const form = useFormState();
  const setForm = useFormDispatch();
  const dispatch = useAdminDispatch();

  const doCreateUser = () => {
    updateLoading({
      ...loading,
      overlayMessage: "Adding new user...",
      saveStatus: ModalOverlayStatuses.SAVING,
      saveUser: true
    });

    // see this wiki page for attributes that will be automatically updated through SSO
    // https://forge.lmig.com/wiki/display/CICCT/Twilio+Flex+SSO+Saml2+Integration
    const attributes: Partial<Worker["attributes"]> = {
      contact_uri: `client:${form.nNumber.value.toLowerCase()}`,
      default_skills: {
        levels: form.triton.defaultSkills.levels,
        skills: form.triton.defaultSkills.skills
      },
      department_id: form.nNumber.nNumberFetchedUser.departmentNumber,// need this value otherwise the department_name will not appear in flex insights,
      department_name: form.nNumber.nNumberFetchedUser.departmentName,
      did: form.triton.outgoing.e164, //if this is a did user it should be the direct dial num
      email: form.nNumber.nNumberFetchedUser.email,
      email_address: form.nNumber.nNumberFetchedUser.email,
      emp_first_name: form.nNumber.nNumberFetchedUser.firstName,
      emp_last_name: form.nNumber.nNumberFetchedUser.lastName,
      extension: form.triton.extension.value,
      full_name: `${form.nNumber.nNumberFetchedUser.firstName} ${form.nNumber.nNumberFetchedUser.lastName}`,
      location: form.nNumber.nNumberFetchedUser.officeName,
      manager_first_name: form.triton.manager.value.manager_first_name,
      manager_last_name: form.triton.manager.value.manager_last_name,
      manager_n_number: form.triton.manager.value.manager_n_number,
      manager: `${form.triton.manager.value.manager_first_name} ${form.triton.manager.value.manager_last_name}`,
      n_number: form.nNumber.value.toLowerCase(),
      office_location_name: form.nNumber.nNumberFetchedUser.officeName,
      office_location_number: form.nNumber.nNumberFetchedUser.officeNumber,
      primary_dept_name: form.nNumber.nNumberFetchedUser.departmentName,
      primary_dept_number: form.nNumber.nNumberFetchedUser.departmentNumber,
      profile_id: form.triton.profileId.value,
      unique_id: form.nNumber.value.toLowerCase()
    };

    const calabrioAttributes = {
      acdId: "", //populate with workerSid returned
      adLogin: `LM\\${form.nNumber.value.toLowerCase()}`,
      email: form.nNumber.nNumberFetchedUser?.email,
      firstName: form.nNumber.nNumberFetchedUser?.firstName,
      lastName: form.nNumber.nNumberFetchedUser?.lastName,
      groupId: form.calabrio_qm.team?.groupId,
      timeZone: form.calabrio_qm.timezone?.value,
      roles: form.calabrio_qm.roles,
      scope: {
        groups: form.calabrio_qm.scope?.groups.filter((group: any) => group.checked).map((g: any) => g.groupId),
        teams: form.calabrio_qm.scope?.teams.filter((team: any) => team.checked).map((g: any) => g.groupId)
      }
    };

    const overflowSkill = getOverflowSkillFromProfile(profiles, form.triton.profileId.value);
    if (overflowSkill !== undefined && form.triton.zeroOutEnabled.value && form.triton.directDialNum.value) {
      attributes.routing = {
        skills: [overflowSkill],
        levels: {}
      };
    }

    const operatingUnitSid = profiles.find(profile => profile.profile_id === form.triton.profileId.value).operating_unit_sid;

    const createUserReqBody = form.triton.directDialNum.value ?
      {
        attributes,
        activateEp: true,
        alternateDid: form.triton.alternateDid.e164,
        directDialNum: form.triton.directDialNum.e164,
        operatingUnitSid: operatingUnitSid,
        zeroOutEnabled: form.triton.zeroOutEnabled.value,
        selfServiceInd: form.triton.selfServiceInd.value
      } : {
        attributes,
        operatingUnitSid: operatingUnitSid,
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
              console.error(`Failed to add office: [${error}]`);
            });
        }

        dispatch({
          type: "addWorkers",
          payload: [mapWorkerFromDbWorker(dbWorker)]
        });

        calabrioAttributes.acdId = dbWorker.workerSid;

        checkConflictingUsers(calabrioAttributes, users, roles, teams).then(() => {
          console.log("Calabrio Attributes sent for create user", calabrioAttributes);
          createCalabrioUser(calabrioAttributes).then(() => {
            getCalabrioUsers().then((users: any) => {
              dispatch({
                type: "loadCalabrioUsers",
                payload: users.data
              });
            }).catch(err => console.error("Failed to reset state after conflict check & calabrio user add", err));
            setForm({
              type: userFormActions.RESET_FORM_AFTER_ADD,
              payload: {
                managerValue: form.triton.manager.value,
                outgoing: {
                  value: form.triton.outgoing.value,
                  e164: form.triton.outgoing.e164
                },
                profileIdValue: form.triton.profileId.value,
                didUser: form.triton.didUser
              }
            });
            setForm({ type: userFormActions.SET_USER_PREVIOUSLY_ADDED_TRUE });
            updateLoading({
              ...loading,
              overlayMessage: "Successfully added new user",
              saveStatus: ModalOverlayStatuses.SUCCESS,
              saveUser: true
            });
            wait(() => {
              updateLoading({
                ...loading,
                saveUser: false
              });
            }, timeouts.MODAL_OVERLAY);
          }).catch(err => {
            console.error("Error Creating Calabrio User", err);
            updateLoading({
              ...loading,
              overlayMessage: "Triton User Created. Error Creating Calabrio User",
              saveStatus: ModalOverlayStatuses.PARTIAL_FAIL,
              saveUser: true
            });
          });
        }).catch(err => {
          console.error("Error Creating Calabrio User", err);
          updateLoading({
            ...loading,
            overlayMessage: "Triton User Created. Error Creating Calabrio User",
            saveStatus: ModalOverlayStatuses.PARTIAL_FAIL,
            saveUser: true
          });
        });
      }).catch(err => {
        console.error(err.message, err.response.data);
        updateLoading({
          ...loading,
          overlayMessage: err.response.data.message || "Failed to add new user.",
          saveStatus: ModalOverlayStatuses.FAIL,
          saveUser: true
        });
      });
  };

  const doUpdateUser =  async () => {
    updateLoading({
      ...loading,
      overlayMessage: `Updating user: ${worker.attributes.full_name}`,
      saveStatus: ModalOverlayStatuses.SAVING,
      saveUser: true
    });
    const attributes: Partial<Worker["attributes"]> = {};
    let operatingUnitSid: string;
    const nNumberFetchedUser = form.nNumber.nNumberFetchedUser;

    attributes.email = nNumberFetchedUser?.email;
    attributes.email_address = nNumberFetchedUser?.email;
    attributes.emp_first_name = nNumberFetchedUser?.firstName;
    attributes.emp_last_name = nNumberFetchedUser?.lastName;
    attributes.full_name = `${nNumberFetchedUser?.firstName} ${nNumberFetchedUser?.lastName}`;

    if (form.triton.manager.updated) {
      attributes.manager_first_name = form.triton.manager.value.manager_first_name;
      attributes.manager_last_name = form.triton.manager.value.manager_last_name;
      attributes.manager_n_number = form.triton.manager.value.manager_n_number;
      attributes.manager = form.triton.manager.value.manager_first_name + " " + form.triton.manager.value.manager_last_name;
    }
    if (form.triton.profileId.updated) {
      attributes.profile_id = form.triton.profileId.value;
      operatingUnitSid = profiles.find(profile => profile.profile_id === form.triton.profileId.value).operating_unit_sid;
    }
    if (form.triton.outgoing.updated) {
      attributes.did = form.triton.outgoing.e164;
    }
    if (form.triton.extension.updated) {
      attributes.extension = form.triton.extension.value;
    }
    if (form.triton.defaultSkills.updated) {
      attributes.default_skills = {
        skills: form.triton.defaultSkills.skills,
        levels: form.triton.defaultSkills.levels
      };
    }
    if(nNumberFetchedUser){
      nNumberFetchedUser.departmentNumber ? attributes.department_id = nNumberFetchedUser.departmentNumber : null;
      nNumberFetchedUser.departmentName ? attributes.department_name = nNumberFetchedUser.departmentName: null;
      nNumberFetchedUser.departmentName ? attributes.location = nNumberFetchedUser.departmentName: null;
    }

    // update overflow skill
    const overflowSkill = getOverflowSkillFromProfile(profiles, form.triton.profileId.value);
    const nonOverflowSkills: string[] = getNonOverflowSkills(worker, profiles) ? getNonOverflowSkills(worker, profiles) : [];
    const levels = worker.attributes?.routing?.levels ? worker.attributes.routing.levels : {};
    if ((form.triton.zeroOutEnabled.updated || form.triton.profileId.updated) && form.triton.zeroOutEnabled.value) {
      attributes.routing = {
        skills: [
          ...nonOverflowSkills,
          overflowSkill
        ],
        levels: levels
      };
    }
    // remove overflow skill
    if (!form.triton.zeroOutEnabled.value && workerHasOverFlowSkill(worker, profiles)) {
      attributes.routing = {
        skills: nonOverflowSkills,
        levels: levels
      };
    }

    const payload: Partial<DbWorker> = {
      attributes,
      zeroOutEnabled: form.triton.zeroOutEnabled.value,
      selfServiceInd: form.triton.selfServiceInd.value
    };

    if(operatingUnitSid){
      payload.operatingUnitSid = operatingUnitSid;
    }
    if (form.triton.alternateDid.updated) {
      payload.alternateDid = form.triton.alternateDid.e164;
    }
    if (form.triton.directDialNum.updated) {
      payload.directDialNum = form.triton.directDialNum.e164;
      payload.activateEp = true;
    }
    if (form.triton.inactiveForwardTo.value !== null && form.triton.inactiveForwardTo.updated) {
      payload.inactiveForwardTo = form.triton.inactiveForwardTo.value;
    }

    updateUser(worker.sid, payload)
      .then(dbWorker => {
        dispatch(({
          type: "updateWorker",
          payload: mapWorkerFromDbWorker(dbWorker)
        }));

        const calabrioAttributes: any = {};
        if(form.calabrio_qm.updated) {
          calabrioAttributes.acdId = dbWorker.workerSid;
          calabrioAttributes.adLogin = `LM\\${form.nNumber.value.toLowerCase()}`;
          calabrioAttributes.email = form.nNumber.nNumberFetchedUser?.email;
          calabrioAttributes.firstName = form.nNumber.nNumberFetchedUser?.firstName;
          calabrioAttributes.lastName = form.nNumber.nNumberFetchedUser?.lastName;
          calabrioAttributes.groupId = form.calabrio_qm.team?.groupId;
          calabrioAttributes.timeZone = form.calabrio_qm.timezone?.value;
          calabrioAttributes.roles = form.calabrio_qm.roles;
          calabrioAttributes.scope = {
            groups: form.calabrio_qm.scope?.groups.filter((group: any) => group.checked).map((g: any) => g.groupId),
            teams: form.calabrio_qm.scope?.teams.filter((team: any) => team.checked).map((g: any) => g.groupId)
          };

          checkConflictingUsers(calabrioAttributes, users, roles, teams).then(() => {
            console.log("Calabrio Attributes sent for update user", calabrioAttributes);
            const calabrioCall = form.calabrio_qm.id ? (attributes: any) => updateCalabrioUser(form.calabrio_qm.id, attributes) : (attributes: any) => createCalabrioUser(attributes);
            calabrioCall(calabrioAttributes).then(() => {
              getCalabrioUsers().then((users: any) => {
                dispatch({
                  type: "loadCalabrioUsers",
                  payload: users.data
                });
              }).catch(err => console.error("Failed to reset state after conflict check & calabrio user add", err));
              setForm({ type: userFormActions.RESET_FORM });
              updateLoading({
                ...loading,
                overlayMessage: `Successfully updated user: ${worker.attributes.full_name}`,
                saveStatus: ModalOverlayStatuses.SUCCESS,
                saveUser: true
              });
              wait(() => {
                updateLoading({
                  ...loading,
                  saveUser: false
                });
                handleClose();
              }, timeouts.MODAL_OVERLAY);
            }).catch(err => {
              console.error("Error updating Calabrio user", err);
              let message = "Triton user updated. Error updating Calabrio user";
              if(!form.calabrio_qm.id){
                message = "Triton user updated.  **Calabrio User Not Updated**  Missing Calabrio profile was not able to be created. To resolve this issue, go into Calabrio and search for this user in the inactive users. Once found, you can re-activate their old profile and come back here, refresh Triton Admin, and update this worker to be accurate. If that does not work, delete and recreate the user.";
              }
              updateLoading({
                ...loading,
                overlayMessage: message,
                saveStatus: ModalOverlayStatuses.PARTIAL_FAIL,
                saveUser: true
              });
            });
          }).catch(err => {
            console.error("Error updating Calabrio user", err);
            updateLoading({
              ...loading,
              overlayMessage: "Triton User updated. Error updating Calabrio user",
              saveStatus: ModalOverlayStatuses.PARTIAL_FAIL,
              saveUser: true
            });
          });
        } else {
          setForm({ type: userFormActions.RESET_FORM });
          updateLoading({
            ...loading,
            overlayMessage: `Successfully updated user: ${worker.attributes.full_name}`,
            saveStatus: ModalOverlayStatuses.SUCCESS,
            saveUser: true
          });
          wait(() => {
            updateLoading({
              ...loading,
              saveUser: false
            });
            handleClose();
          }, timeouts.MODAL_OVERLAY);
        }
      }).catch(err => {
        console.error(err);
        updateLoading({
          ...loading,
          overlayMessage: err.response?.data.message || `Failed to update user: ${worker.attributes.full_name}`,
          saveStatus: ModalOverlayStatuses.FAIL,
          saveUser: true
        });
      });
  };

  const isUserFormButtonEnabled = form.formMode === formModes.INSERT
    ? isFormValid(form, worker, forwardToToggle)
    : (isFormUpdated(form) || form.discrepancies.length > 0) && isFormValid(form, worker, forwardToToggle);

  return (
    <ButtonWrapper>
      <UserFormButton onClick={() => handleClose()}>
          Close
      </UserFormButton>
      <UserFormButton onClick={() => setForm({ type: userFormActions.RESET_FORM })}>
          Clear
      </UserFormButton>
      <Tooltip
        title={
          form.triton.didUser && !isDidDifferentValid(form, worker, forwardToToggle) ?
            "You must edit Outgoing Number and Internal Routing before saving" : ""
        }
        placement={"bottom-start"}
        leaveDelay={500}
        arrow
      >
        <span>
          <UserFormButton
            disabled={!isUserFormButtonEnabled}
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