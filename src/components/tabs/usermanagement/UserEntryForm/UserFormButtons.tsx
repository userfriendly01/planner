import { UserFormButtonsProps } from "./UserEntryForm.Interfaces";
import {
  ButtonWrapper,
  UserFormButton
} from "./UserEntryForm.Styles";
import { Tooltip } from "@material-ui/core";
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
  Worker,
  Discrepancy,
  discrepancyType
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

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await fetchUserServiceCall(form.nNumber.value);
        setForm({
          type: userFormActions.COMPLETE_N_NUMBER,
          payload: {
            nNumber: form.nNumber.value,
            fetchedUser
          }
        });
        if(fetchedUser.email?.toLowerCase() !== worker.attributes?.email?.toLowerCase()){
          const discrepancy: Discrepancy = {
            type: discrepancyType.CALABRIO,
            message: "Triton email does not match HR email."
          };
          setForm({
            type: userFormActions.SET_DISCREPANCIES,
            payload: discrepancy
          });
        }
      } catch (err) {
        console.error("Failed to fetch user from peoples database.");
      }
    };
    if(!form.nNumberFetchedUser && form.nNumber.value && form.formMode === formModes.UPDATE){
      fetchUser();
    }
  }, []);

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
      timeZone: form.calabrioUser.timezone?.value,
      roles: form.calabrioUser.roles,
      scope: {
        groups: form.calabrioUser.scope?.groups.filter((group: any) => group.checked).map((g: any) => g.groupId),
        teams: form.calabrioUser.scope?.teams.filter((team: any) => team.checked).map((g: any) => g.groupId)
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
            getCalabrioUsers().then((agents: any) => {
              dispatch({
                type: "loadCalabrioUsers",
                payload: agents.data
              });
            }).catch(err => console.error("Failed to reset state after conflict check & calabrio user add", err));
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
              handleClose(true);
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
    const nNumberFetchedUser = form.nNumberFetchedUser;

    attributes.email = nNumberFetchedUser?.email;
    attributes.email_address = nNumberFetchedUser?.email;
    attributes.emp_first_name = nNumberFetchedUser?.firstName;
    attributes.emp_last_name = nNumberFetchedUser?.lastName;
    attributes.full_name = `${nNumberFetchedUser?.firstName} ${nNumberFetchedUser?.lastName}`;

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

        const calabrioAttributes: any = {};
        if(form.calabrioUser.updated) {
          calabrioAttributes.acdId = dbWorker.workerSid;
          calabrioAttributes.adLogin = `LM\\${form.nNumber.value.toLowerCase()}`;
          calabrioAttributes.email = form.nNumberFetchedUser?.email;
          calabrioAttributes.firstName = form.nNumberFetchedUser?.firstName;
          calabrioAttributes.lastName = form.nNumberFetchedUser?.lastName;
          calabrioAttributes.groupId = form.calabrioUser.team?.groupId;
          calabrioAttributes.timeZone = form.calabrioUser.timezone?.value;
          calabrioAttributes.roles = form.calabrioUser.roles;
          calabrioAttributes.scope = {
            groups: form.calabrioUser.scope?.groups.filter((group: any) => group.checked).map((g: any) => g.groupId),
            teams: form.calabrioUser.scope?.teams.filter((team: any) => team.checked).map((g: any) => g.groupId)
          };

          checkConflictingUsers(calabrioAttributes, users, roles, teams).then(() => {
            console.log("Calabrio Attributes sent for update user", calabrioAttributes);
            const calabrioCall = form.calabrioUser.id ? (attributes: any) => updateCalabrioUser(form.calabrioUser.id, attributes) : (attributes: any) => createCalabrioUser(attributes);
            calabrioCall(calabrioAttributes).then(() => {
              getCalabrioUsers().then((agents: any) => {
                dispatch({
                  type: "loadCalabrioUsers",
                  payload: agents.data
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
              if(!form.calabrioUser.id){
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