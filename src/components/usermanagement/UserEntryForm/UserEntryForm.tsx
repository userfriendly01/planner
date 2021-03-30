import Switch from "@material-ui/core/Switch";
import {
  DefaultSkillSelector,
  ModalExtension,
  ModalNNumber,
  ModalOverlay,
  ModalPhoneNumber,
  OutlinedSelect,
  StyledButton,
  UserEntryFormState
} from "components";
import {
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
import React from "react";
import {
  createUser,
  updateUser
} from "services";
import styled from "styled-components";
import {
  mapTwilioWorkerFromDbWorker,
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
  max-height: 90vh;
  overflow-y: auto;
  width: 100%;
`;

const FormControlsPane = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 320px;
  overflow-y: auto;
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
  max-height: 80vh;
  max-width: 700px;
  overflow-y: auto;
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

const defaultNNumber = "n";

interface UserEntryFormProps {
  userEntryFormState: UserEntryFormState,
  handleClose: VoidFunction
}

const UserEntryForm: React.FC<any> = (props: UserEntryFormProps) => {

  const {
    handleClose,
    userEntryFormState: {
      formMode,
      worker
    }
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

  const getZeroOutEnabledFromProfile = (newProfileValue: string): boolean => {
    const targetProfile = profiles.find(profile => profile.profile_id === +newProfileValue);
    return !!targetProfile.zero_out_enabled.data[0];
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
      contact_uri: `client:${form.nNumber.value.toLowerCase()}`,
      unique_id: form.nNumber.value.toLowerCase()
    };
    createUser({
      attributes,
      // values below are used by twilio-worker-api, they do not map to Twilio worker attributes
      alternateDid: form.alternateDid.e164,
      directDialNum: form.directDialNum.e164,
      zeroOutEnabled: form.zeroOutEnabled
    })
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
          payload: [mapTwilioWorkerFromDbWorker(dbWorker)]
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

    // TODO ADD INACTIVEFORWARDTO
    updateUser({
      workerSid: worker.sid,
      attributes,
      // values below are used by twilio-worker-api, they do not map to Twilio worker attributes
      alternateDid: form.alternateDid.e164,
      directDialNum: form.directDialNum.e164,
      zeroOutEnabled: form.zeroOutEnabled
    })
      .then(dbWorker => {
        dispatch(({
          type: "updateWorker",
          payload: mapTwilioWorkerFromDbWorker(dbWorker)
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
        updateLoading({
          ...loading,
          overlayMessage: `Failed to update user: ${worker.attributes.full_name}`,
          saveStatus: modalOverlayStatuses.FAIL,
          saveUser: true
        });
        wait(() => updateLoading({
          ...loading,
          saveUser: false
        }), 2000);
        console.error("UserEntryForm - Failed to update twilio worker", err);
      });
  };

  const nNumberInputValid = form.nNumberFetchedUser ? true : false;
  const extensionInputValid = (form.extension.valid || form.extension.value === "");
  const managerValid = form.manager.value !== "";
  const profileIdValid = form.profileId.value !== "";
  const formValid = (formMode === formModes.INSERT ? nNumberInputValid : true)
    && profileIdValid && managerValid && form.outgoing.valid && extensionInputValid
    && (form.didUser === true ? form.directDialNum.valid && form.alternateDid.valid : true);
  const formUpdated = (
    form.defaultSkillsUpdated || form.manager.updated ||
    form.profileId.updated || form.outgoing.updated ||
    form.alternateDid.updated || form.directDialNum.updated ||
    form.nNumber.updated || form.extension.updated
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
            updateValue={newValue => setForm({
              ...form,
              profileId: {
                ...form.profileId,
                value: newValue,
                updated: true
              },
              zeroOutEnabled: getZeroOutEnabledFromProfile(newValue)
            })}
            value={form.profileId.value}
          />
          <ModalPhoneNumber
            allowSevenDigitVdn={false}
            id="outgoing-number"
            number={form.outgoing.value}
            onBlur={() => handleOnBlur("outgoing")}
            label="Outgoing Number *"
            showError={form.outgoing.blurred}
            updateValue={(maskedValue, unmaskedValue, isValid, e164Number) => {
              handleNumberUpdate(maskedValue, unmaskedValue, isValid, e164Number, "outgoing");
            }}
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
          <ToggleContainer>
            <Switch
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
          {form.didUser ? (
            <>
              <ToggleContainer>
                <Switch
                  checked={form.zeroOutEnabled}
                  value={form.zeroOutEnabled}
                  onChange={() => setForm({
                    ...form,
                    zeroOutEnabled: !form.zeroOutEnabled // toggle
                  })}
                  inputProps={{ "aria-label": "toggle overflow skill" }}
                />
                <ToggleLabel>Overflow Skill</ToggleLabel>
              </ToggleContainer>
              <ModalPhoneNumber
                allowSevenDigitVdn={false}
                id="twilio-did"
                number={form.directDialNum.value}
                onBlur={() => handleOnBlur("directDialNum")}
                label="Twilio DID *"
                showError={form.directDialNum.blurred}
                updateValue={(maskedValue, unmaskedValue, isValid, e164Number) => {
                  handleNumberUpdate(maskedValue, unmaskedValue, isValid, e164Number, "directDialNum");
                }}
              />
              <ModalPhoneNumber
                disabled={!worker.alternateDid || formMode === formModes.INSERT ? false : true}
                // disabled={formMode === formModes.INSERT ? false : true}
                allowSevenDigitVdn={false}
                id="skype-teams-did"
                number={form.alternateDid.value}
                onBlur={() => handleOnBlur("alternateDid")}
                label="Skype/Teams DID *"
                showError={form.alternateDid.blurred}
                updateValue={(maskedValue, unmaskedValue, isValid, e164Number) => {
                  handleNumberUpdate(maskedValue, unmaskedValue, isValid, e164Number, "alternateDid");
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
        </FormControlsPane>
      </FormControlsContainer>
      <ButtonWrapper>
        <StyledButton
          disabled={formMode === formModes.INSERT ? !formValid : (!formUpdated || !formValid)}
          onClick={formMode === formModes.INSERT ? doCreateUser : doUpdateUser}
        >
          {formMode === formModes.INSERT ? "Add User" : "Save User"}
        </StyledButton>
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