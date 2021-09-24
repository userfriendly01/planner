import { BasicFormInfoProps } from "./UserEntryForm.Interfaces";
import {
  FormControlsContainer,
  FormControlsPane,
  StyledIcon,
  ToggleContainer,
  ToggleLabel
} from "./UserEntryForm.Styles";
import {
  InputAdornment,
  Switch,
  Tooltip
} from "@material-ui/core";
import {
  ForwardToEntryForm,
  ModalExtension,
  ModalNNumber,
  ModalPhoneNumber,
  OutlinedSelect
} from "components";
import {
  useFormDispatch,
  useFormState,
  userFormActions
} from "context";
import {
  extensionMatcher,
  formModes
} from "globals";
import React from "react";
import {
  getOverflowSkillFromProfile,
  isExtensionValid,
  isProfileIdValid,
  isManagerValid,
  sortManagersByName,
  sortProfilesByName
} from "utils";

const BasicFormInfo = (props: BasicFormInfoProps) => {

  const {
    skills,
    worker,
    workers,
    profiles,
    managers,
    forwardToToggle,
    setForwardToToggle
  } = props;

  const form = useFormState();
  const setForm = useFormDispatch();

  const isOutgoingDisabled = (): boolean => {
    if (form.formMode === formModes.INSERT) {
      return false;
    } else {
      return form.editDisabled && worker.directDialNum ? true : false;
    }
  };

  const editPenClick = (): void => {
    if (forwardToToggle) {
      // reset did fields to initial form
      setForm({
        type: "EDIT_PEN_CLICK_FORWARD_TO_TOGGLE",
        payload: worker
      });
    } else {
      setForm({
        type: "EDIT_PEN_CLICK_NO_FORWARD_TO_TOGGLE"
      });
    }
    setForwardToToggle(!forwardToToggle);
  };

  const handleOnBlur = (field: string) => {
    const isFieldValid = form[field].valid;
    if(!isFieldValid){
      setForm({
        type: userFormActions.SET_BLUR_ON_FIELD,
        payload: field
      });
    }
  };

  return(
    <FormControlsContainer>
      <FormControlsPane>
        <OutlinedSelect
          error={form.manager.blurred && !isManagerValid(form)}
          helperText={isManagerValid(form) || !form.manager.updated ? null : "Please select a manager"}
          label={"Manager *"}
          labelWidth={67}
          onBlur={() => handleOnBlur("manager")}
          optionsList={managers.sort(sortManagersByName)}
          optionsDisplayFunc={option => {
            return {
              display: `${option.manager_first_name} ${option.manager_last_name}`,
              key: option.manager_id,
              value: JSON.stringify(option)
            };
          }}
          updateValue={newValue => setForm({
            type: userFormActions.UPDATE_MANAGER,
            payload: newValue
          })}
          value={form.manager.value}
        />
        <OutlinedSelect
          error={form.profileId.blurred && !isProfileIdValid(form)}
          helperText={isProfileIdValid(form) || !form.profileId.updated ? null : "Please select a team"}
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
            setForm({
              type: userFormActions.UPDATE_TEAM,
              payload: {
                profileId: newValue,
                profiles
              }
            });
          }}
          value={form.profileId.value}
        />
        <ModalNNumber
          disabled={(form.formMode === formModes.UPDATE) || (form.nNumberFetchedUser ? true : false)}
          fetchedUser={form.nNumberFetchedUser}
          label="N Number *"
          onBlur={() => handleOnBlur("nNumber")}
          onClear={() => setForm({ type: userFormActions.CLEAR_N_NUMBER })}
          onComplete={(fetchedUser, nNumber) => setForm({
            type: userFormActions.COMPLETE_N_NUMBER,
            payload: {
              nNumber,
              fetchedUser
            }
          })}
          onUpdate={nNumber => {
            setForm({
              type: userFormActions.UPDATE_N_NUMBER,
              payload: nNumber
            });
          }}
          value={form.nNumber.value}
        />
        <ModalExtension
          disabled={form.extension.valid && extensionMatcher.test(form.extension.value)}
          error={form.extension.blurred && !isExtensionValid(form)}
          extension={form.extension.value}
          originalValue={(worker && worker.attributes) ? worker.attributes.extension : undefined}
          onBlur={() => setForm({ type: userFormActions.CLEAR_EXTENSION })}
          onClear={() => setForm({ type: userFormActions.CLEAR_EXTENSION })}
          onUpdate={(extension, extensionValid) => setForm({
            type: userFormActions.UPDATE_EXTENSION,
            payload: {
              extension,
              isValid: extensionValid
            }
          })}
        />
        <Tooltip
          title={
            form.formMode === formModes.UPDATE && worker.directDialNum ?
              "Twilio DID can not be removed" : ""
          }
          placement={"bottom-start"}
        >
          <ToggleContainer>
            <Switch
              disabled={form.formMode === formModes.UPDATE && worker.directDialNum ? true : false}
              checked={form.didUser}
              onChange={() => {
                setForm({ type: userFormActions.INITIATE_DID_FIELDS });
                if (form.userPreviouslyAdded) {
                  setForm({ type: userFormActions.CLEAR_OUTGOING_NUMBER });
                }
              }}
              inputProps={{ "aria-label": "toggle-did-user" }}
            />
            <ToggleLabel>DID User</ToggleLabel>
          </ToggleContainer>
        </Tooltip>
        {form.didUser ? (
          <Tooltip
            title={getOverflowSkillFromProfile(profiles, form.profileId.value) !== undefined ?
              "" : "No overflow skill exists for this team"}
            placement={"bottom-start"}
          >
            <ToggleContainer>
              <Switch
                checked={form.zeroOutEnabled}
                value={form.zeroOutEnabled}
                disabled={getOverflowSkillFromProfile(profiles, form.profileId.value) === undefined}
                onChange={() => setForm({ type: userFormActions.INITIATE_ZERO_OUT_FIELDS })}
                inputProps={{ "aria-label": "toggle-zero-out" }}
              />
              <ToggleLabel>Overflow Skill</ToggleLabel>
            </ToggleContainer>
          </Tooltip>
        ): null
        }
      </FormControlsPane>
      <FormControlsPane>
        <ModalPhoneNumber
          disabled={isOutgoingDisabled()}
          allowSevenDigitVdn={false}
          id="outgoing-number"
          number={form.outgoing.value}
          onBlur={() => handleOnBlur("outgoing")}
          label="Outgoing Number *"
          showError={form.outgoing.blurred}
          updateValue={(maskedValue: string, _unmaskedValue: string, isValid: boolean, e164Number: string) => {
            setForm({
              type: userFormActions.UPDATE_PHONE_NUMBER,
              payload: {
                field: "outgoing",
                maskedValue,
                isValid,
                e164Number
              }
            });
          }}
          icon={worker?.directDialNum && form.formMode !== formModes.INSERT ? (
            <InputAdornment position="end">
              <StyledIcon
                fontSize="large"
                onClick={() => editPenClick()}
              />
            </InputAdornment>
          ) : null
          }
        />
        {forwardToToggle && form.formMode === formModes.UPDATE ? (
          <ForwardToEntryForm
            label={"Please choose a forward to option for the existing outgoing number"}
            skills={skills}
            workers={workers}
            updateForwardTo={(value: string) => {
              setForm({
                type: userFormActions.UPDATE_INACTIVE_FORWARD_TO,
                payload: value
              });
            }}
          />
        ) : null}
        {form.didUser ? (
          <>
            <ModalPhoneNumber
              disabled={form.editDisabled}
              allowSevenDigitVdn={false}
              id="internal-routing-number"
              number={form.directDialNum.value}
              label="Internal Routing Number *"
              showError={form.directDialNum.blurred}
              onBlur={() =>
                setForm({
                  type: userFormActions.SET_BLUR_ON_FIELD,
                  payload: "directDialNum"
                })
              }
              updateValue={(maskedValue, _unmaskedValue, isValid, e164Number) => {
                setForm({
                  type: userFormActions.UPDATE_PHONE_NUMBER,
                  payload: {
                    field: "directDialNum",
                    maskedValue,
                    isValid,
                    e164Number
                  }
                });
              }}
            />
            <ModalPhoneNumber
              disabled={!worker?.alternateDid || form.formMode === formModes.INSERT ? false : true}
              allowSevenDigitVdn={false}
              id="skype-teams-did"
              number={form.alternateDid.value}
              label="Skype/Teams DID *"
              showError={form.alternateDid.blurred}
              onBlur={() =>
                setForm({
                  type: userFormActions.SET_BLUR_ON_FIELD,
                  payload: "alternateDid"
                })
              }
              updateValue={(maskedValue, _unmaskedValue, isValid, e164Number) => {
                setForm({
                  type: userFormActions.UPDATE_PHONE_NUMBER,
                  payload: {
                    field: "alternateDid",
                    maskedValue,
                    isValid,
                    e164Number
                  }
                });
              }}
            />
          </>
        ) : null}
      </FormControlsPane>
    </FormControlsContainer>
  );
};

export default BasicFormInfo;