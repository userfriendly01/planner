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
  TwilioWorkerSkills,
  useAdminDispatch,
  useAdminState
} from "context";
import {
  extensionMatcher,
  formModes,
  modalOverlayStatuses,
  timeouts
} from "globals";
import React, {
  useState
} from "react";
import {
  createUser,
  FetchUserResponse,
  updateUser
} from "services";
import styled from "styled-components";
import {
  getValidSkillsObject,
  mapWorkerFromTwilioWorker,
  sortManagersByName,
  sortProfilesByName,
  wait
} from "utils";

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
  width: 100%
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
  flex: 1 1 auto;
  flex-direction: column;
  left: 50%;
  max-width: 700px;
  padding: 0 8px;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
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

export interface UserEntryFormProps {
  userEntryFormState: UserEntryFormState,
  handleClose: VoidFunction
};

export interface PhoneNumberState {
  value: string,
  blurred: boolean,
  e164: string,
  updated: boolean,
  valid: boolean,
};

export interface UserEntryForm_FormState {
  defaultSkills: TwilioWorkerSkills,
  defaultSkillsUpdated: boolean,
  didUser: boolean,
  extension: string,
  extensionBlurred: boolean,
  extensionUpdated: boolean,
  extensionValid: boolean,
  manager: string,
  managerBlurred: boolean,
  managerUpdated: boolean,
  nNumber: string,
  nNumberBlurred: boolean,
  nNumberFetchedUser: FetchUserResponse,
  nNumberUpdated: boolean,
  outgoing: PhoneNumberState,
  overflowSkill: boolean,
  profileId: string,
  profileIdBlurred: boolean,
  profileIdUpdated: boolean,
  skypeTeamsDid: PhoneNumberState,
  twilioDid: PhoneNumberState
};

const UserEntryForm = (props: UserEntryFormProps) => {

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

  const initialDefaultSkills = getValidSkillsObject()
  const getInitialFormState = (): UserEntryForm_FormState => {
    const initialForm: UserEntryForm_FormState = {
      defaultSkills: initialDefaultSkills,
      defaultSkillsUpdated: false,
      didUser: false,
      extension: "",
      extensionBlurred: false,
      extensionUpdated: false,
      extensionValid: false,
      manager: "",
      managerBlurred: false,
      managerUpdated: false,
      nNumber: defaultNNumber,
      nNumberBlurred: false,
      nNumberFetchedUser: null,
      nNumberUpdated: false,
      outgoing: {
        value: "",
        blurred: false,
        e164: undefined,
        updated: false,
        valid: false,
      },
      overflowSkill: false,
      profileId: "",
      profileIdBlurred: false,
      profileIdUpdated: false,
      skypeTeamsDid: {
        value: "",
        blurred: false,
        e164: undefined,
        updated: false,
        valid: false,
      },
      twilioDid: {
        value: "",
        blurred: false,
        e164: undefined,
        updated: false,
        valid: false,
      }
    };
    if (formMode === formModes.UPDATE) {
      // did user fields need to be updated if they exist
      initialForm.defaultSkills = getValidSkillsObject(worker.attributes.default_skills);
      initialForm.extension = worker.attributes.extension || "";
      initialForm.extensionValid = true;
      initialForm.manager = JSON.stringify(managers.find(m => m.manager_n_number === worker.attributes.manager_n_number));
      initialForm.nNumber = worker.attributes.n_number || defaultNNumber;
      initialForm.outgoing.value = worker.attributes.did ? worker.attributes.did.replace(/^\+1/, "").replace(/^1/, "") : ""; // remove +1 or 1 from start of e164
      initialForm.outgoing.valid = worker.attributes.did ? true : false;
      initialForm.profileId = `${worker.attributes.profile_id}`;
    }
    return initialForm;
  }

  const [form, setForm] = useState<UserEntryForm_FormState>(getInitialFormState());
  const [loading, updateLoading] = useState({
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
    const parsedManager = JSON.parse(form.manager);

    // see this wiki page for attributes that will be automatically updated through SSO
    // https://forge.lmig.com/wiki/display/CICCT/Twilio+Flex+SSO+Saml2+Integration
    const attributes: Partial<TwilioWorker["attributes"]> = {
      default_skills: form.defaultSkills,
      did: form.outgoing.e164,
      email: form.nNumberFetchedUser.email,
      email_address: form.nNumberFetchedUser.email,
      emp_first_name: form.nNumberFetchedUser.firstName,
      emp_last_name: form.nNumberFetchedUser.lastName,
      extension: form.extension,
      full_name: `${form.nNumberFetchedUser.firstName} ${form.nNumberFetchedUser.lastName}`,
      manager_first_name: parsedManager.manager_first_name,
      manager_last_name: parsedManager.manager_last_name,
      manager_n_number: parsedManager.manager_n_number,
      n_number: form.nNumber.toLowerCase(),
      office_location_name: form.nNumberFetchedUser.officeName,
      office_location_number: form.nNumberFetchedUser.officeNumber,
      primary_dept_name: form.nNumberFetchedUser.departmentName,
      primary_dept_number: form.nNumberFetchedUser.departmentNumber,
      profile_id: form.profileId,
      contact_uri: `client:${form.nNumber.toLowerCase()}`,
      unique_id: form.nNumber.toLowerCase()
    };
    createUser(attributes)
      .then(twilioWorker => {
        setForm({
          ...form,
          // reset default skills
          defaultSkills: initialDefaultSkills,
          defaultSkillsUpdated: false,
          // reset extension
          extension: "",
          extensionBlurred: false,
          extensionUpdated: false,
          extensionValid: false,
          // reset n number
          nNumber: defaultNNumber,
          nNumberBlurred: false,
          nNumberFetchedUser: null,
          // reset blurs for everything else
          managerBlurred: false,
          profileIdBlurred: false,
          outgoing: {
            ...form.outgoing,
            blurred: false
          },
          // reset skype teams did and twilio did
          skypeTeamsDid: {
            value: "",
            blurred: false,
            e164: undefined,
            updated: false,
            valid: false,
          },
          twilioDid: {
            value: "",
            blurred: false,
            e164: undefined,
            updated: false,
            valid: false,
          }
        });
        dispatch({
          type: "addWorkers",
          payload: [mapWorkerFromTwilioWorker(twilioWorker)]
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
        updateLoading({
          ...loading,
          overlayMessage: "Failed to add new user",
          saveStatus: modalOverlayStatuses.FAIL,
          saveUser: true
        });
        wait(() => {
          updateLoading({
            ...loading,
            saveUser: false
          });
        }, timeouts.MODAL_OVERLAY);
        console.error("UserEntryForm - Failed to create worker in twilio workspace", err);
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
    if (form.managerUpdated) {
      const parsedManager = JSON.parse(form.manager);
      attributes.manager_first_name = parsedManager.manager_first_name;
      attributes.manager_last_name = parsedManager.manager_last_name;
      attributes.manager_n_number = parsedManager.manager_n_number;
    }
    if (form.profileIdUpdated) {
      attributes.profile_id = form.profileId;
    }
    if (form.outgoing.updated) {
      attributes.did = form.outgoing.e164;
    }
    if (form.extensionUpdated) {
      attributes.extension = form.extension;
    }
    if (form.defaultSkillsUpdated) {
      attributes.default_skills = form.defaultSkills;
    }
    updateUser(worker.sid, attributes)
      .then(twilioWorker => {
        dispatch(({
          type: "updateWorker",
          payload: mapWorkerFromTwilioWorker(twilioWorker)
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
  const extensionInputValid = (form.extensionValid || form.extension === "");
  const managerValid = form.manager !== "";
  const profileIdValid = form.profileId !== "";
  const formValid = (formMode === formModes.INSERT ? nNumberInputValid : true)
    && profileIdValid && managerValid && form.outgoing.valid && extensionInputValid
    && (form.didUser === true ? form.twilioDid.valid && form.skypeTeamsDid.valid : true);
  const formUpdated = (form.defaultSkillsUpdated || form.managerUpdated || form.profileIdUpdated || form.outgoing.updated || form.nNumberUpdated || form.extensionUpdated)

  return (
    <ModalContainer>
      {loading.saveUser ?
        <ModalOverlay
          status={loading.saveStatus}
          message={loading.overlayMessage}
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
            error={form.managerBlurred && !managerValid}
            helperText={managerValid || !form.managerUpdated ? null : "Please select a manager"}
            label={"Manager *"}
            labelWidth={67}
            onBlur={() => setForm({
              ...form,
              managerBlurred: true
            })}
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
              manager: newValue,
              managerUpdated: true
            })}
            value={form.manager}
          />
          <OutlinedSelect
            error={form.profileIdBlurred && !profileIdValid}
            helperText={profileIdValid || !form.profileIdUpdated ? null : "Please select a team"}
            label={"Team *"}
            labelWidth={44}
            onBlur={() => setForm({
              ...form,
              profileIdBlurred: true
            })}
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
              profileId: newValue,
              profileIdUpdated: true
            })}
            value={form.profileId}
          />
          <ModalPhoneNumber
            allowSevenDigitVdn={false}
            id="outgoing-number"
            number={form.outgoing.value}
            onBlur={() => setForm({
              ...form,
              outgoing: {
                ...form.outgoing,
                blurred: true
              }
            })}
            label="Outgoing Number *"
            showError={form.outgoing.blurred}
            updateValue={(maskedValue, unmaskedValue, isValid, e164Number) => {
              setForm({
                ...form,
                outgoing: {
                  ...form.outgoing,
                  value: maskedValue,
                  e164: e164Number,
                  updated: true,
                  valid: isValid && (e164Number ? true : false)
                },
              });
            }}
          />
          <ModalNNumber
            disabled={(formMode === formModes.UPDATE) || (form.nNumberFetchedUser ? true : false)}
            fetchedUser={form.nNumberFetchedUser}
            label="N Number *"
            onBlur={() => setForm({
              ...form,
              nNumberBlurred: true
            })}
            onClear={() => {
              setForm({
                ...form,
                nNumber: defaultNNumber,
                nNumberFetchedUser: null,
                nNumberUpdated: true
              });
            }}
            onComplete={(fetchedUser, nNumber) => setForm({
              ...form,
              nNumber,
              nNumberFetchedUser: fetchedUser
            })}
            onUpdate={nNumber => {
              setForm({
                ...form,
                nNumber,
                nNumberUpdated: true
              });
            }}
            value={form.nNumber}
          />
          <ModalExtension
            disabled={form.extensionValid && extensionMatcher.test(form.extension)}
            error={form.extensionBlurred && !extensionInputValid}
            extension={form.extension}
            originalValue={(worker && worker.attributes) ? worker.attributes.extension : undefined}
            onBlur={() => setForm({
              ...form,
              extensionBlurred: true
            })}
            onClear={() => {
              setForm({
                ...form,
                extension: "",
                extensionUpdated: true,
                extensionValid: false
              });
            }}
            onUpdate={(extension, extensionValid) => setForm({
              ...form,
              extension,
              extensionBlurred: extensionValid, // blur if valid because we are going to disable this control
              extensionUpdated: true,
              extensionValid
            })}
          />
          <ToggleContainer>
            {/* <h3>DID User</h3> */}
            <Switch
              checked={form.didUser}
              onChange={() => setForm({
                ...form,
                didUser: !form.didUser
              })}
              inputProps={{ "aria-label": "toggle did user" }}
            />
            <ToggleLabel>DID User</ToggleLabel>
          </ToggleContainer>
          {form.didUser ? (
            <>
              <ToggleContainer>
                <Switch
                  checked={form.overflowSkill}
                  value={form.overflowSkill}
                  onChange={() => setForm({
                    ...form,
                    overflowSkill: !form.overflowSkill
                  })}
                  inputProps={{ "aria-label": "toggle overflow skill" }}
                />
                <ToggleLabel>Overflow Skill</ToggleLabel>
              </ToggleContainer>
              <ModalPhoneNumber
                allowSevenDigitVdn={false}
                id="twilio-did"
                number={form.twilioDid.value}
                onBlur={() => setForm({
                  ...form,
                  twilioDid: {
                    ...form.twilioDid,
                    blurred: true
                  }
                })}
                label="Twilio DID *"
                showError={form.twilioDid.blurred}
                updateValue={(maskedValue, unmaskedValue, isValid, e164Number) => {
                  setForm({
                    ...form,
                    twilioDid: {
                      ...form.twilioDid,
                      value: maskedValue,
                      e164: e164Number,
                      updated: true,
                      valid: isValid && (e164Number ? true : false)
                    }
                  });
                }}
              />
              <ModalPhoneNumber
                allowSevenDigitVdn={false}
                id="skype-teams-did"
                number={form.skypeTeamsDid.value}
                onBlur={() => setForm({
                  ...form,
                  skypeTeamsDid: {
                    ...form.skypeTeamsDid,
                    blurred: true
                  }
                })}
                label="Skype/Teams DID *"
                showError={form.skypeTeamsDid.blurred}
                updateValue={(maskedValue, unmaskedValue, isValid, e164Number) => {
                  setForm({
                    ...form,
                    skypeTeamsDid: {
                      ...form.skypeTeamsDid,
                      value: maskedValue,
                      e164: e164Number,
                      updated: true,
                      valid: isValid && (e164Number ? true : false)
                    }
                  });
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
              })
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