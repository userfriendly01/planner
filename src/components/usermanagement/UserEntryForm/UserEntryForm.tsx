import {
  InputAdornment, Switch, Tooltip
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import {
  DefaultSkillSelector,
  ForwardToEntryForm,
  ModalExtension,
  ModalNNumber,
  ModalOverlay,
  ModalPhoneNumber,
  OutlinedSelect,
  StyledButton,
  UserEntryFormState
} from "components";
import {
  TaskRouterSkill,
  TwilioWorker,
  useAdminDispatch,
  useAdminState
} from "context";
import {
  extensionMatcher,
  formModes,
  modalOverlayStatuses,
  timeouts
} from "globals";
import React, { useState } from "react";
import {
  createUser,
  updateUser
} from "services";
import styled from "styled-components";
import {
  DbWorker,
  formatE164PhoneNumber,
  mapWorkerFromDbWorker,
  removeNonNumericCharacters,
  sortManagersByName,
  sortProfilesByName,
  wait
} from "utils";
import useUserEntryForm from "./useUserEntryForm";

const FlexRow = styled.div`
  display: flex;
  flex: 1 1 auto;
`;

const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 8px;
`;

const FormControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const FormControlsPane = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 320px;
  padding: 0 8px;
  width: 100%;
`;

const Header1 = styled.h1`
  align-self: center;
`;

const Header2 = styled.h2`
  align-self: center;
`;

const ModalContainer = styled.div`
  background-color: ${props => props.theme.backgroundColor};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  left: 0;
  margin: 0 auto;
  max-width: 700px;
  padding: 0 8px;
  position: absolute;
  right: 0;
  top: 10vh;
  width: 100%;
`;

const ToggleContainer = styled.div`
  display: flex;
  margin-left: 4px;
`;

const ToggleLabel = styled.div`
  align-self: center;
  font-weight: 400;
  font-size: 1rem;
`;

const StyledIcon = styled(Edit)`
  && {
    color: ${props => props.theme.button.blue.backgroundColor};
    &:hover {
      color: ${props => props.theme.button.blue.hoverColor};
      cursor: pointer;
    }
  }
`;

const defaultNNumber = "n";

interface UserEntryFormProps {
  userEntryFormState: UserEntryFormState,
  handleClose: VoidFunction,
  skills: TaskRouterSkill[],
  workers: TwilioWorker[]
}

const UserEntryForm: React.FC<any> = (props: UserEntryFormProps) => {

  const {
    handleClose,
    userEntryFormState: {
      formMode,
      worker
    },
    skills,
    workers
  } = props;

  const dispatch = useAdminDispatch();
  const {
    profileContext: {
      profiles
    },
    managerContext: {
      managers
    }
  } = useAdminState();

  const {
    form, handleOnBlur, handleNumberUpdate, initialDefaultSkills,
    loading, updateLoading, setForm
  } = useUserEntryForm(formMode, worker, managers);

  const [profileHasZeroOutEnabled, setProfileHasZeroOutEnabled] = useState(false);
  const [forwardToToggle, setForwardToToggle] = useState(false);

  const getTargetProfile = (newProfileValue: string) => profiles.find(profile => profile.profile_id === +newProfileValue);
  const overflowSkill: (string) = form.profileId.value ? getTargetProfile(form.profileId.value).overflow_skill : "";
  const getZeroOutEnabledFromProfile = (newProfileValue: string): boolean => getTargetProfile(newProfileValue).overflow_skill !== null;

  const isOutgoingDisabled = (): boolean => {
    if (formMode === formModes.INSERT) {
      return false;
    } else {
      return form.editDisabled && worker.directDialNum ? true : false;
    }
  };

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
    if (overflowSkill !== null && form.zeroOutEnabled && form.directDialNum.value) {
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
      }

    createUser(createUserReqBody)
      .then(dbWorker => {
        setForm({
          ...form,
          // reset default skills
          defaultSkills: initialDefaultSkills,
          defaultSkillsUpdated: false,
          // reset extension
          extension: {
            value: "",
            blurred: false,
            updated: false,
            valid: false
          },
          // reset n number
          nNumber: {
            ...form.nNumber,
            value: defaultNNumber,
            blurred: false
          },
          nNumberFetchedUser: null,
          // reset blurs for everything else
          manager: {
            ...form.manager,
            blurred: false
          },
          profileId: {
            ...form.profileId,
            blurred: false
          },
          outgoing: {
            ...form.outgoing,
            blurred: false
          },
          // reset Skype/Teams did and twilio did
          alternateDid: {
            value: "",
            blurred: false,
            e164: undefined,
            updated: false,
            valid: false
          },
          directDialNum: {
            value: "",
            blurred: false,
            e164: undefined,
            updated: false,
            valid: false
          }
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

  const nNumberInputValid = form.nNumberFetchedUser ? true : false;
  const extensionInputValid = (form.extension.valid || form.extension.value === "");
  const managerValid = form.manager.value !== "";
  const profileIdValid = form.profileId.value !== "";
  const inactiveForwardToValid = (forwardToToggle === true ? form.inactiveForwardTo.value !== null : true);
  // check if outgoing and directdialnum have been changed to new numbers
  const didDifferentValid = (
    forwardToToggle === true ? removeNonNumericCharacters(form.outgoing.value) !== formatE164PhoneNumber(worker?.attributes?.did) &&
    removeNonNumericCharacters(form.directDialNum.value) !== formatE164PhoneNumber(worker?.directDialNum) : true
  );
  const formValid = (formMode === formModes.INSERT ? nNumberInputValid : true)
    && profileIdValid && managerValid && form.outgoing.valid && extensionInputValid
    && (form.didUser === true ? form.directDialNum.valid && form.alternateDid.valid : true)
    && inactiveForwardToValid && didDifferentValid;
  const formUpdated = (
    form.defaultSkillsUpdated || form.manager.updated ||
    form.profileId.updated || form.outgoing.updated ||
    form.alternateDid.updated || form.directDialNum.updated ||
    form.nNumber.updated || form.extension.updated ||
    form.inactiveForwardTo.updated
  );

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
      <FormControlsContainer>
        <FormControlsPane>
          <OutlinedSelect
            error={form.manager.blurred && !managerValid}
            helperText={managerValid || !form.manager.updated ? null : "Please select a manager"}
            label={"Manager *"}
            labelWidth={67}
            onBlur={() => handleOnBlur("manager")}
            optionsList={managers.sort(sortManagersByName)}
            optionsDisplayFunc={option => {
              return {
                display: `${option.manager_first_name} ${option.manager_last_name}`,
                key: option.manager_n_number,
                value: JSON.stringify(option)
              };
            }}
            updateValue={newValue => setForm({
              ...form,
              manager: {
                ...form.manager,
                value: newValue,
                updated: true
              }
            })}
            value={form.manager.value}
          />
          <OutlinedSelect
            error={form.profileId.blurred && !profileIdValid}
            helperText={profileIdValid || !form.profileId.updated ? null : "Please select a team"}
            label={"Team *"}
            labelWidth={44}
            onBlur={() => handleOnBlur("profileId")}
            optionsList={profiles.sort(sortProfilesByName)}
            optionsDisplayFunc={option => {
              return {
                display: option.profile_nme,
                key: option.profile_id,
                value: option.profile_id
              };
            }}
            updateValue={newValue => {
              const zeroOutEnabled = getZeroOutEnabledFromProfile(newValue);
              setForm({
                ...form,
                profileId: {
                  ...form.profileId,
                  value: newValue,
                  updated: true
                },
                zeroOutEnabled
              });
              setProfileHasZeroOutEnabled(zeroOutEnabled);
            }}
            value={form.profileId.value}
          />
          <ModalPhoneNumber
            disabled={isOutgoingDisabled()}
            allowSevenDigitVdn={false}
            id="outgoing-number"
            number={form.outgoing.value}
            onBlur={() => handleOnBlur("outgoing")}
            label="Outgoing Number *"
            showError={form.outgoing.blurred}
            updateValue={(maskedValue, _unmaskedValue, isValid, e164Number) => {
              handleNumberUpdate(maskedValue, isValid, e164Number, "outgoing");
            }}
            icon={worker?.directDialNum && formMode !== formModes.INSERT ? (
              <InputAdornment position="end">
                <StyledIcon
                  fontSize="large"
                  data-testid="toggle-forward-to"
                  onClick={() => {
                    setForm({
                      ...form,
                      editDisabled: !form.editDisabled
                    });
                    setForwardToToggle(!forwardToToggle);
                  }}
                />
              </InputAdornment>
            ) : null
            }
          />
          <ModalNNumber
            disabled={(formMode === formModes.UPDATE) || (form.nNumberFetchedUser ? true : false)}
            fetchedUser={form.nNumberFetchedUser}
            label="N Number *"
            onBlur={() => handleOnBlur("nNumber")}
            onClear={() => {
              setForm({
                ...form,
                nNumber: {
                  ...form.nNumber,
                  value: defaultNNumber,
                  updated: true
                },
                nNumberFetchedUser: null
              });
            }}
            onComplete={(fetchedUser, nNumber) => setForm({
              ...form,
              nNumber: {
                ...form.nNumber,
                value: nNumber
              },
              nNumberFetchedUser: fetchedUser
            })}
            onUpdate={nNumber => {
              setForm({
                ...form,
                nNumber: {
                  ...form.nNumber,
                  value: nNumber,
                  updated: true
                }
              });
            }}
            value={form.nNumber.value}
          />
          <ModalExtension
            disabled={form.extension.valid && extensionMatcher.test(form.extension.value)}
            error={form.extension.blurred && !extensionInputValid}
            extension={form.extension.value}
            originalValue={(worker && worker.attributes) ? worker.attributes.extension : undefined}
            onBlur={() => setForm({
              ...form,
              extension: {
                ...form.extension,
                value: "",
                updated: true,
                valid: false
              }
            })}
            onClear={() => {
              setForm({
                ...form,
                extension: {
                  ...form.extension,
                  value: "",
                  updated: true,
                  valid: false
                }
              });
            }}
            onUpdate={(extension, extensionValid) => setForm({
              ...form,
              extension: {
                ...form.extension,
                value: extension,
                blurred: extensionValid,
                updated: true,
                valid: extensionValid
              }
            })}
          />
          <Tooltip
            title={
              formMode === formModes.UPDATE && worker.directDialNum ?
                "Twilio DID can not be removed" : ""
            }
            placement={"bottom-start"}
          >
            <ToggleContainer>
              <Switch
                disabled={formMode === formModes.UPDATE && worker.directDialNum ? true : false}
                checked={form.didUser}
                onChange={() => {
                  setForm({
                    ...form,
                    didUser: !form.didUser,
                    alternateDid: {
                      value: "",
                      blurred: false,
                      e164: undefined,
                      updated: false,
                      valid: false
                    },
                    directDialNum: {
                      value: "",
                      blurred: false,
                      e164: undefined,
                      updated: false,
                      valid: false
                    }
                  });
                }}
                inputProps={{ "aria-label": "toggle-did-user" }}
              />
              <ToggleLabel>DID User</ToggleLabel>
            </ToggleContainer>
          </Tooltip>
          {form.didUser ? (
            <>
              <Tooltip
                title={profileHasZeroOutEnabled ?
                  "" : "No overflow skill exists for this team"}
                placement={"bottom-start"}
              >
                <ToggleContainer>
                  <Switch
                    checked={form.zeroOutEnabled}
                    value={form.zeroOutEnabled}
                    disabled={overflowSkill === null}
                    onChange={() => setForm({
                      ...form,
                      zeroOutEnabled: !form.zeroOutEnabled
                    })}
                    inputProps={{ "aria-label": "toggle-zero-out" }}
                  />
                  <ToggleLabel>Overflow Skill</ToggleLabel>
                </ToggleContainer>
              </Tooltip>
              <ModalPhoneNumber
                disabled={form.editDisabled}
                allowSevenDigitVdn={false}
                id="internal-routing-number"
                number={form.directDialNum.value}
                onBlur={() => handleOnBlur("directDialNum")}
                label="Internal Routing Number *"
                showError={form.directDialNum.blurred}
                updateValue={(maskedValue, _unmaskedValue, isValid, e164Number) => {
                  handleNumberUpdate(maskedValue, isValid, e164Number, "directDialNum");
                }}
              />
              <ModalPhoneNumber
                disabled={!worker?.alternateDid || formMode === formModes.INSERT ? false : true}
                allowSevenDigitVdn={false}
                id="skype-teams-did"
                number={form.alternateDid.value}
                onBlur={() => handleOnBlur("alternateDid")}
                label="Skype/Teams DID *"
                showError={form.alternateDid.blurred}
                updateValue={(maskedValue, _unmaskedValue, isValid, e164Number) => {
                  handleNumberUpdate(maskedValue, isValid, e164Number, "alternateDid");
                }}
              />
            </>
          ) : null}
        </FormControlsPane>
        <FormControlsPane>
          <DefaultSkillSelector
            defaultSkills={form.defaultSkills}
            setDefaultSkills={defaultSkills => {
              setForm({
                ...form,
                defaultSkillsUpdated: true,
                defaultSkills
              });
            }}
          />
          {forwardToToggle && formMode === formModes.UPDATE ? (
            <ForwardToEntryForm
              label={"Please choose a forward to option for the existing outgoing number"}
              skills={skills}
              workers={workers}
              updateForwardTo={(value: string) => {
                setForm({
                  ...form,
                  inactiveForwardTo: {
                    value,
                    updated: true
                  }
                });
              }}
            />
          ) : null}
        </FormControlsPane>
      </FormControlsContainer>
      <ButtonWrapper>
        <Tooltip
          title={
            form.didUser && !didDifferentValid ?
              "You must edit Outgoing Number and Internal Routing before saving" : ""
          }
          placement={"bottom-start"}
          leaveDelay={500}
          arrow
        >
          <span>
            <StyledButton
              disabled={formMode === formModes.INSERT ? !formValid : (!formUpdated || !formValid)}
              onClick={formMode === formModes.INSERT ? doCreateUser : doUpdateUser}
            >
              {formMode === formModes.INSERT ? "Add User" : "Save User"}
            </StyledButton>
          </span>
        </Tooltip>
        <StyledButton
          onClick={handleClose}
        >
          Close
        </StyledButton>
      </ButtonWrapper>
    </ModalContainer>
  );
};

export default UserEntryForm;