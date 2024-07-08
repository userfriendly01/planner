import {
  ButtonWrapper,
  UserFormButton
} from "usermanagement/UserEntryFormWrapper.Styles";
import {
  UserFormButtonsProps
} from "usermanagement/UserEntryFormWrapper.Interfaces";
import {
  useAdminDispatch,
  useAdminState,
  useFormState,
  useFormDispatch
} from "context/appContext";
import { userFormActions } from "context/userFormReducer";
import {
  env,
  formModes,
  timeouts
} from "globals";
import {
  ModalOverlayStatuses,
  UMUser,
  UMUserTwilioAttributes
} from "globals/interfaces";
import React from "react";
import {
  createCalabrioUser,
  getCalabrioUsers,
  updateCalabrioUser,
  createCalabrioWFMPerson
} from "services/calabrio";
import { wfmActivateExternalLogon } from "services/wfmActivateExternalLogon";
import {
  createUser, updateUser
} from "services/user";
import {
  addOffice, getOffice
} from "services/office";
import {
  getNonOverflowSkills,
  getOverflowSkillFromProfile,
  identifyFormErrors,
  isDidDifferentValid,
  isFormUpdated,
  isTritonUserValid,
  workerHasOverFlowSkill
} from "utils/usermanagementUtils";
import { logger } from "utils/logger";
import { wait } from "utils";
import {
  addWorkerToOrg,
  checkConflictingUsers
} from "utils/calabrioUtils";
import { Tooltip } from "@mui/material";
import { ApolloError } from "@apollo/client";

export const UserFormButtons = (props: UserFormButtonsProps) => {

  const {
    forwardToToggle,
    handleClose,
    loading,
    profiles,
    updateLoading,
    worker,
    setMissingFields
  } = props;

  const form = useFormState();
  const setForm = useFormDispatch();
  const dispatch = useAdminDispatch();
  const state = useAdminState();
  const {
    users,
    roles,
    teams
  } = state.calabrioContext;
  const { nNumber } = state.userContext;
  const calabrioServiceToken = state.userContext.tokens.calabrioService;

  const doCreateUser = async () => {
    updateLoading({
      ...loading,
      overlayMessage: "Adding new user...",
      saveStatus: ModalOverlayStatuses.SAVING,
      saveUser: true
    });

    const userNNumber = form.nNumber.value.toLowerCase();

    // see this wiki page for attributes that will be automatically updated through SSO
    // https://forge.lmig.com/wiki/display/CICCT/Twilio+Flex+SSO+Saml2+Integration
    const attributes: Partial<UMUserTwilioAttributes> = {
      contact_uri: `client:${userNNumber}`,
      default_skills: {
        levels: form.triton.defaultSkills.levels,
        skills: form.triton.defaultSkills.skills
      },
      department_id: form.nNumber.nNumberFetchedUser.departmentNumber,// need this value otherwise the department_name will not appear in flex insights,
      department_name: form.nNumber.nNumberFetchedUser.departmentName,
      caller_id: form.triton.outgoing.e164,
      email: form.nNumber.nNumberFetchedUser.email,
      email_address: form.nNumber.nNumberFetchedUser.email,
      emp_first_name: form.nNumber.nNumberFetchedUser.firstName,
      emp_last_name: form.nNumber.nNumberFetchedUser.lastName,
      extension: form.triton.extension.value,
      full_name: `${form.nNumber.nNumberFetchedUser.firstName} ${form.nNumber.nNumberFetchedUser.lastName}`,
      location: form.nNumber.nNumberFetchedUser.officeName,
      manager_first_name: form.triton.manager.value.manager_first_name,
      manager_last_name: form.triton.manager.value.manager_last_name,
      manager_n_number: form.triton.manager.value.manager_n_num,
      manager: `${form.triton.manager.value.manager_first_name} ${form.triton.manager.value.manager_last_name}`,
      n_number: userNNumber,
      agent_id: userNNumber,
      office_location_name: form.nNumber.nNumberFetchedUser.officeName,
      office_location_number: form.nNumber.nNumberFetchedUser.officeNumber,
      primary_dept_name: form.nNumber.nNumberFetchedUser.departmentName,
      primary_dept_number: form.nNumber.nNumberFetchedUser.departmentNumber,
      profile_id: form.triton.profileId.value,
      unique_id: userNNumber,
      routing: {
        ...form.triton.routing,
        skills: [],
        levels: {}
      }
    };

    const calabrioAttributes = {
      acdId: "", //populate with workerSid returned
      adLogin: `LM\\${userNNumber}`,
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

    if (overflowSkill !== undefined && form.triton.zeroOutEnabled.value && form.triton.did.value) {
      attributes.routing.skills = [overflowSkill];
    }

    const operatingUnitSid = profiles.find(profile => profile.profile_id === form.triton.profileId.value).ou_sid;

    const createUserReqBody = form.triton.did.value ?
      {
        attributes,
        did: form.triton.did.e164,
        operatingUnitSid: operatingUnitSid,
        zeroOutEnabled: form.triton.zeroOutEnabled.value,
        selfServiceInd: form.triton.selfServiceInd.value
      } : {
        attributes,
        operatingUnitSid: operatingUnitSid
      };

    const errors = [];

    try {
      const newWorker = await createUser(createUserReqBody);

      logger.info("Successfully created user", {
        nNumber,
        userNNumber
      });

      const officeExists = await getOffice(newWorker.attributes.office_location_number);
      if (!officeExists) {
        const newOffice = {
          office_name: newWorker.attributes.office_location_name,
          office_num: newWorker.attributes.office_location_number
        };
        addOffice(newOffice)
          .then(() => {
            logger.info("Successfully added office", {
              nNumber,
              newOffice
            });

            dispatch({
              type: "addOffice",
              payload: newOffice
            });
          })
          .catch(error => {
            logger.error("Failed to add office", {
              nNumber,
              error
            });
          });
      }

      try {
        await wfmActivateExternalLogon(state.userContext.tokens.adminService, { workerNNumbers: [userNNumber]});

        logger.info("Successfully activated WFM external login", {
          nNumber,
          userNNumber: userNNumber
        });
      } catch (error) {
        logger.error("Failed to activate WFM external login", {
          error,
          nNumber,
          userNNumber: userNNumber
        });

        errors.push(`Failed to activate WFM External Logon. ${error.message}`);
      }

      try {
        calabrioAttributes.acdId = newWorker.sid;
        await checkConflictingUsers(calabrioServiceToken, calabrioAttributes, users, roles, teams);
        await createCalabrioUser(calabrioServiceToken, calabrioAttributes);

        logger.info("Successfully created Calabrio User", {
          nNumber,
          workerSid: newWorker.sid
        });

        try {
          const updatedUsers: any = await getCalabrioUsers(calabrioServiceToken);
          dispatch({
            type: "loadCalabrioUsers",
            payload: updatedUsers.data
          });
        } catch (error) {
          logger.error(
            "Failed to reset state after conflict check & calabrio user add",
            {
              error
            },
            false
          );

          errors.push("Failed to refresh Calabrio state, please refresh Triton Admin");
        }

      } catch (error) {
        logger.error("Failed to create Calabrio QM User.", {
          error,
          nNumber
        });

        errors.push(`Failed to create Calabrio QM User. ${error.message}`);
      }

      if (form.calabrio_wfm.userFound) {
        //Edit is not supported yet but if calabrio_wfm.userFound is true, that means they are creating a new WFM user for an existing Triton User
        const wfmBody = {
          ...form.calabrio_wfm,
          PersonStartDate: form.calabrio_wfm.EmploymentStartDate,
          RoleIds: form.calabrio_wfm.Roles.map((r: any) => r.Id),
          NNumber: form.calabrio_wfm.EmploymentNumber,
          ApplicationLogon: form.calabrio_wfm.Email,
          TimeZoneId: form.calabrio_qm.timezone.value,
          Skills: form.calabrio_wfm.PersonSkills?.map((s: any) => s.Id)
        };

        if (env.APP_ENV === "production") {
          try {
            const res = await createCalabrioWFMPerson(calabrioServiceToken, wfmBody);

            logger.info("Successfully created Calabrio WFM Person", {
              nNumber,
              userNNumber: form.calabrio_wfm.EmploymentNumber
            });

            dispatch({
              type: "updateWfmOrg",
              payload: {
                org: addWorkerToOrg({
                  ...form.calabrio_wfm,
                  Id: res.data.personId,
                  ParentTeam: form.calabrio_wfm.TeamId
                }, state),
                errors: []
              }
            });
          } catch (error) {
            logger.error("Failed to create WFM User", {
              error,
              nNumber,
              userNNumber: form.calabrio_wfm.EmploymentNumber
            });

            errors.push(`Failed to create WFM User. ${error.message}`);
          }
        } else {
          logger.warn("WFM does not have a non prod environment. WFM form entries were disregarded.", {}, false);

          errors.push("WFM does not have a non prod environment. WFM form entries were disregarded.");
        }
      }

      if (errors.length === 0) {
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
      } else {
        updateLoading({
          ...loading,
          overlayMessage: `The following errors occurred: ${errors.toString()}`,
          saveStatus: ModalOverlayStatuses.PARTIAL_FAIL,
          saveUser: true
        });
      }
    } catch (error) {
      const apolloError = error as ApolloError;

      logger.error("Errors thrown creating a new user",
        {
          error,
          data: apolloError.message,
          nNumber
        },
        false
      );
      updateLoading({
        ...loading,
        overlayMessage: apolloError.message || "Failed to add new user.",
        saveStatus: ModalOverlayStatuses.FAIL,
        saveUser: true
      });
    }
  };

  const doUpdateUser = async () => {
    updateLoading({
      ...loading,
      overlayMessage: `Updating user: ${worker.attributes.full_name}`,
      saveStatus: ModalOverlayStatuses.SAVING,
      saveUser: true
    });
    const attributes: Partial<UMUserTwilioAttributes> = {};
    let operatingUnitSid: string;
    const nNumberFetchedUser = form.nNumber.nNumberFetchedUser;

    attributes.email = nNumberFetchedUser?.email;
    attributes.email_address = nNumberFetchedUser?.email;
    attributes.emp_first_name = nNumberFetchedUser?.firstName;
    attributes.emp_last_name = nNumberFetchedUser?.lastName;
    attributes.full_name = `${nNumberFetchedUser?.firstName} ${nNumberFetchedUser?.lastName}`;
    attributes.manager_first_name = form.triton.manager.value.manager_first_name;
    attributes.manager_last_name = form.triton.manager.value.manager_last_name;
    attributes.manager_n_number = form.triton.manager.value.manager_n_num;
    attributes.manager = form.triton.manager.value.manager_first_name + " " + form.triton.manager.value.manager_last_name;

    if (form.triton.profileId.updated) {
      attributes.profile_id = form.triton.profileId.value;
      operatingUnitSid = profiles.find(profile => profile.profile_id === form.triton.profileId.value).ou_sid;
    }
    if (form.triton.outgoing.updated) {
      attributes.caller_id = form.triton.outgoing.e164;
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
    if (form.triton.routing.updated) {
      attributes.routing = {
        team: form.triton.routing.team,
        caller_states: form.triton.routing.caller_states,
        backup_workers: form.triton.routing.backup_workers,
        backup_workers_active: form.triton.routing.backup_workers_active,
        sales_assoc_workers: form.triton.routing.sales_assoc_workers,
        skills: form.triton.routing.skills,
        levels: form.triton.routing.levels
      };
    }
    if (nNumberFetchedUser) {
      nNumberFetchedUser.departmentNumber ? attributes.department_id = nNumberFetchedUser.departmentNumber : null;
      nNumberFetchedUser.departmentName ? attributes.department_name = nNumberFetchedUser.departmentName : null;
      nNumberFetchedUser.departmentName ? attributes.location = nNumberFetchedUser.departmentName : null;
    }


    const overflowSkill = getOverflowSkillFromProfile(profiles, form.triton.profileId.value);
    const nonOverflowSkills: string[] = getNonOverflowSkills(worker, profiles) ? getNonOverflowSkills(worker, profiles) : [];

    // update overflow skill
    const levels = worker.attributes?.routing?.levels ? worker.attributes.routing.levels : {};
    if ((form.triton.zeroOutEnabled.updated || form.triton.profileId.updated) && form.triton.zeroOutEnabled.value) {
      if (!attributes.routing) {
        attributes.routing = form.triton.routing;
      }

      attributes.routing.skills = [
        ...nonOverflowSkills,
        overflowSkill
      ];
      attributes.routing.levels = levels;
    }

    // remove overflow skill
    if (!form.triton.zeroOutEnabled.value && workerHasOverFlowSkill(worker, profiles)) {
      if (!attributes.routing) {
        attributes.routing = form.triton.routing;
      }
      attributes.routing.skills = nonOverflowSkills;

      attributes.routing.levels = levels;
    }

    const payload: Partial<UMUser> = {
      attributes,
      zeroOutEnabled: form.triton.zeroOutEnabled.value,
      selfServiceInd: form.triton.selfServiceInd.value
    };

    if (operatingUnitSid) {
      payload.operatingUnitSid = operatingUnitSid;
    }
    if (form.triton.did.updated) {
      payload.did = form.triton.did.e164;
    }
    if (form.triton.inactiveForwardTo.value !== null && form.triton.inactiveForwardTo.updated) {
      payload.inactiveForwardTo = form.triton.inactiveForwardTo.value;
    }

    const errors = [];
    try {
      await updateUser(worker.sid, payload);

      logger.info("Successfully Updated Triton user", {
        nNumber,
        userNNumber: form.nNumber.value
      });
    } catch (err) {
      const error = err as ApolloError;

      logger.error("Failed to update Triton Worker", {
        error,
        nNumber,
        userNNumber: form.nNumber.value
      });

      errors.push(`Failed to update Triton Worker. ${error.message}`);
    }

    if (form.calabrio_qm.updated) {
      try {
        const calabrioAttributes: any = {};
        calabrioAttributes.acdId = form.calabrio_qm.acdId;
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

        if (form.calabrio_qm.id) {
          await updateCalabrioUser(calabrioServiceToken, form.calabrio_qm.id, calabrioAttributes);

          logger.info("Successfully Updated Calabrio user", {
            nNumber,
            userNNumber: form.nNumber.value
          });
        } else {
          await checkConflictingUsers(calabrioServiceToken, calabrioAttributes, users, roles, teams);
          await createCalabrioUser(calabrioServiceToken, calabrioAttributes);

          logger.info("Successfully Created Calabrio user", {
            nNumber,
            userNNumber: form.nNumber.value
          });
        }
        try {
          const updatedUsers: any = await getCalabrioUsers(calabrioServiceToken);
          dispatch({
            type: "loadCalabrioUsers",
            payload: updatedUsers.data
          });
        } catch (error) {
          logger.error("Failed to reset state after conflict check & calabrio user add", { error });
          errors.push("Failed to refresh Calabrio state, please refresh Triton Admin");
        }
      } catch (error) {
        logger.error("Failed to update Calabrio QM user", { error });
        errors.push(`Failed to update Calabrio QM user, ${error.message}`);
      }
    }

    if (form.calabrio_wfm.userFound && !form.calabrio_wfm.Id) {
      //Edit is not supported yet but if calabrio_wfm.userFound is true, that means they are creating a new WFM user for an existing Triton User
      const wfmBody = {
        ...form.calabrio_wfm,
        PersonStartDate: form.calabrio_wfm.EmploymentStartDate,
        RoleIds: form.calabrio_wfm.Roles.map((r: any) => r.Id),
        NNumber: form.calabrio_wfm.EmploymentNumber,
        ApplicationLogon: form.calabrio_wfm.Email,
        TimeZoneId: form.calabrio_qm.timezone.value,
        Skills: form.calabrio_wfm.PersonSkills?.map((s: any) => s.Id)
      };

      if (env.APP_ENV === "production") {
        try {
          const res = await createCalabrioWFMPerson(calabrioServiceToken, wfmBody);

          logger.info("Successfully created Calabrio WFM Person", {
            nNumber,
            userNNumber: form.calabrio_wfm.EmploymentNumber
          });

          dispatch({
            type: "updateWfmOrg",
            payload: {
              org: addWorkerToOrg({
                ...form.calabrio_wfm,
                Id: res.data.personId,
                ParentTeam: form.calabrio_wfm.TeamId
              }, state),
              errors: []
            }
          });
          try {
            await wfmActivateExternalLogon(state.userContext.tokens.adminService, { workerNNumbers: [form.calabrio_wfm.EmploymentNumber]});

            logger.info("Successfully activated WFM external login", {
              nNumber,
              userNNumber: form.calabrio_wfm.EmploymentNumber
            });
          } catch (error) {
            logger.error("Failed to activate WFM external login", {
              error,
              nNumber,
              userNNumber: form.calabrio_wfm.EmploymentNumber
            });

            errors.push(`Failed to activate WFM External Logon. ${error.message}`);
          }
        } catch (error) {
          logger.error("Failed to create WFM User", {
            error,
            nNumber,
            userNNumber: form.calabrio_wfm.EmploymentNumber
          });

          errors.push(`Failed to create WFM User. ${error.message}`);
        }
      } else {
        logger.warn("WFM does not have a non prod environment. WFM form entries were disregarded.", {}, false);

        errors.push("WFM does not have a non prod environment. WFM form entries were disregarded.");
      }
    }

    if (errors.length === 0) {
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
    } else {
      updateLoading({
        ...loading,
        overlayMessage: `The following errors occurred: ${errors.toString()}`,
        saveStatus: ModalOverlayStatuses.PARTIAL_FAIL,
        saveUser: true
      });
    }
  };

  const isUserFormButtonEnabled = form.formMode === formModes.INSERT
    ? isTritonUserValid(form, worker, forwardToToggle)
    : (isFormUpdated(form) || form.discrepancies.length > 0 || form.calabrio_wfm.updated) && isTritonUserValid(form, worker, forwardToToggle);

  const handleFormOnClick = () => {
    const formErrors: any = identifyFormErrors(form);
    if (formErrors.length === 0 && form.formMode === formModes.INSERT) {
      doCreateUser();
    } else if (formErrors.length === 0) {
      doUpdateUser();
    } else {
      setMissingFields(formErrors);
    }
  };

  const clearForm = () => {
    setForm({ type: userFormActions.RESET_FORM });
    setForm({
      type: userFormActions.UPDATE_USER_FOUND,
      payload: {
        system: "triton",
        isFound: true
      }
    });
    setForm({
      type: userFormActions.UPDATE_USER_FOUND,
      payload: {
        system: "calabrio_qm",
        isFound: true
      }
    });
  };

  return (
    <ButtonWrapper>
      <UserFormButton onClick={() => handleClose()}>
        Close
      </UserFormButton>
      {form.formMode === formModes.INSERT &&
        <UserFormButton onClick={clearForm}>
          Clear
        </UserFormButton>
      }
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
            onClick={handleFormOnClick}
          >
            {form.formMode === formModes.INSERT ? "Add User" : "Save User"}
          </UserFormButton>
        </span>
      </Tooltip>
    </ButtonWrapper>
  );
};