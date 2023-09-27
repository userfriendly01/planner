import { BasicFormInfoProps } from "../UserEntryFormWrapper/UserEntryFormWrapper.Interfaces";
import {
  FormControlsContainer,
  FormControlsPane,
  RightColumn,
  ToggleContainer,
  ToggleLabel
} from "../UserEntryFormWrapper/UserEntryFormWrapper.Styles";
import {
  Switch,
  Tooltip
} from "@mui/material";
import {
  Dropdown,
  ExtensionInput,
  ForwardToEntryForm,
  NNumberInput,
  PhoneNumberInput,
  SkillsFormInfo
} from "components";
import {
  useFormDispatch,
  useFormState,
  userFormActions
} from "context";
import { formModes } from "globals";
import React, { useState } from "react";
import {
  getOverflowSkillFromProfile,
  isProfileIdValid,
  isManagerValid,
  sortManagersByName,
  sortProfilesByName
} from "utils";
import { RoutingAttributes } from "../RoutingAttributes";

const BasicFormInfo = (props: BasicFormInfoProps) => {

  const {
    worker,
    profiles,
    managers,
    forwardToToggle,
    setForwardToToggle
  } = props;

  const form = useFormState();
  const setForm = useFormDispatch();

  const [autoUpdateOutgoing, setAutoUpdateOutgoing] = useState(form.triton.outgoing.value === form.triton.directDialNum.value || !form.triton.outgoing.value);

  const formatDropdownOption = (value: any, label: string, option: any) => {
    if(typeof option === "object"){
      return {
        ...option,
        value,
        label
      };
    } else {
      return "";
    }
  };

  const handleOnBlur = (field: string, system: string) => {
    const isFieldValid = system ? form[system][field].valid : form[field].valid;
    if(!isFieldValid){
      setForm({
        type: userFormActions.SET_BLUR_ON_FIELD,
        payload: {
          field,
          system
        }
      });
    }
  };

  return(
    <FormControlsContainer>
      <FormControlsPane>
        <Dropdown
          disabled={form.formMode === formModes.DELETE}
          error={form.triton.manager.blurred && !isManagerValid(form)}
          label={"Manager *"}
          styles={{
            width: "384px",
            margin: "8px 0px 5px 0px"
          }}
          onBlur={() => handleOnBlur("manager", "triton")}
          options={managers.sort(sortManagersByName).map(manager => formatDropdownOption(manager.manager_n_number, `${manager.manager_first_name} ${manager.manager_last_name} - ${manager.manager_n_number}`, manager))}
          updateValue={(event: any, newValue: any) => {
            setForm({
              type: userFormActions.UPDATE_MANAGER,
              payload: newValue
            });
            if(newValue.profile_id || newValue.profile_id === 0){
              setForm({
                type: userFormActions.UPDATE_TEAM,
                payload: {
                  profileId: newValue.profile_id,
                  profiles
                }
              });
            } else {
              setForm({
                type: userFormActions.UPDATE_TEAM,
                payload: {
                  profileId: "",
                  profiles
                }
              });
            }
          }}
          value={form.triton.manager.value ? `${form.triton.manager.value.manager_first_name} ${form.triton.manager.value.manager_last_name} - ${form.triton.manager.value.manager_n_number}`: ""}
        />
        <Dropdown
          disabled={form.formMode === formModes.DELETE}
          error={form.triton.profileId.blurred && !isProfileIdValid(form)}
          label={"Team *"}
          styles={{
            width: "384px",
            margin: "10px 0px"
          }}
          onBlur={() => handleOnBlur("profileId", "triton")}
          options={profiles.sort(sortProfilesByName).map((profile: any) => formatDropdownOption(profile.profile_id, `${profile.profile_nme} - ${profile.profile_id}`, profile))}
          updateValue={(event: any, newValue: any) => {
            setForm({
              type: userFormActions.UPDATE_TEAM,
              payload: {
                profileId: newValue.value,
                profiles
              }
            });
            // reset selfServiceInd value to false if set to true and then profile changed to value of 39 and below
            if(newValue.value < 39 && form.triton.selfServiceInd.value){
              setForm({ type: userFormActions.UPDATE_SELF_SERVICE_INDICATOR });
            }
          }}
          value={(form.triton.profileId.value || form.triton.profileId.value === 0) ? `${profiles.find(p => p.profile_id === form.triton.profileId.value)?.profile_nme} - ${profiles.find(p => p.profile_id === form.triton.profileId.value)?.profile_id}` : ""}
        />
        <NNumberInput
          disabled={
            (form.formMode === formModes.UPDATE) ||
            (form.nNumber.nNumberFetchedUser ? true : false) ||
            form.formMode === formModes.DELETE
          }
          fetchedUser={form.nNumber.nNumberFetchedUser}
          label="N Number *"
          onBlur={() => handleOnBlur("nNumber", null)}
          onClear={() => setForm({ type: userFormActions.CLEAR_N_NUMBER })}
          onComplete={(fetchedUser: any, nNumber: any) => setForm({
            type: userFormActions.COMPLETE_N_NUMBER,
            payload: {
              nNumber,
              fetchedUser
            }
          })}
          onUpdate={(nNumber: string) => {
            setForm({
              type: userFormActions.UPDATE_N_NUMBER,
              payload: nNumber
            });
          }}
          value={form.nNumber.value}
        />
        <SkillsFormInfo />
      </FormControlsPane>
      <RightColumn>
        <FormControlsPane>
          {form.triton.didUser && (
            <PhoneNumberInput
              disabled={form.formMode === formModes.DELETE}
              allowSevenDigitVdn={false}
              id="direct-dial-number"
              number={form.triton.directDialNum.value}
              label="Direct Dial Number *"
              showError={form.triton.directDialNum.blurred}
              onBlur={() => handleOnBlur("directDialNum", "triton")}
              updateValue={(maskedValue, _unmaskedValue, isValid, e164Number) => {
                setForm({
                  type: userFormActions.UPDATE_PHONE_NUMBER,
                  payload: {
                    field: "directDialNum",
                    maskedValue,
                    isValid,
                    e164Number,
                    initialValue: worker?.directDialNum || null
                  }
                });

                if(isValid && (!form.triton.outgoing.value || autoUpdateOutgoing)) {
                  setAutoUpdateOutgoing(true);
                  setForm({
                    type: userFormActions.UPDATE_PHONE_NUMBER,
                    payload: {
                      field: "outgoing",
                      maskedValue,
                      isValid,
                      e164Number,
                      initialValue: worker?.attributes?.did || null
                    }
                  });
                }
              }}
            />
          )}
          {form.triton.didUser
            && form.formMode === formModes.UPDATE
            && form.triton.directDialNum.updated
            && form.triton.directDialNum.e164 !== worker?.directDialNum
            && (
              <ForwardToEntryForm
                label={"Please choose a forward to option for the existing direct dial number"}
                updateForwardTo={(value: string) => {
                  setForm({
                    type: userFormActions.UPDATE_INACTIVE_FORWARD_TO,
                    payload: value
                  });
                }}
              />
            )
          }
          <PhoneNumberInput
            disabled={form.formMode === formModes.DELETE}
            allowSevenDigitVdn={false}
            id="outgoing-number"
            number={form.triton.outgoing.value}
            onBlur={() => handleOnBlur("outgoing", "triton")}
            label="Outbound Caller ID *"
            showError={form.triton.outgoing.blurred}
            updateValue={(maskedValue: string, _unmaskedValue: string, isValid: boolean, e164Number: string) => {
              setForm({
                type: userFormActions.UPDATE_PHONE_NUMBER,
                payload: {
                  field: "outgoing",
                  maskedValue,
                  isValid,
                  e164Number,
                  initialValue: worker?.attributes?.did || null
                }
              });

              if(isValid) {
                setAutoUpdateOutgoing(false);
              } else {
                setAutoUpdateOutgoing(true);
              }
            }}
          />
          {form.triton.didUser && (
            <PhoneNumberInput
              disabled={
                !worker?.alternateDid ||
              form.formMode === formModes.INSERT ? false : true ||
              form.formMode === formModes.DELETE
              }
              allowSevenDigitVdn={false}
              id="skype-teams-did"
              number={form.triton.alternateDid.value}
              label="Skype/Teams DID *"
              showError={form.triton.alternateDid.blurred}
              onBlur={() => handleOnBlur("alternateDid", "triton")}
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
          )}
        </FormControlsPane>
        <Tooltip
          title={
            form.formMode === formModes.UPDATE && worker?.directDialNum ?
              "Twilio DID can not be removed" : ""
          }
          placement={"bottom-start"}
        >
          <ToggleContainer>
            <Switch
              disabled={form.formMode === formModes.UPDATE && worker?.directDialNum ? true : false || form.formMode === formModes.DELETE}
              checked={form.triton.didUser}
              onChange={() => {
                setForm({ type: userFormActions.INITIATE_DID_FIELDS });
                if (form.triton.extension.value) {
                  setForm({ type: userFormActions.CLEAR_EXTENSION });
                }
                if (form.triton.userPreviouslyAdded) {
                  setForm({ type: userFormActions.CLEAR_OUTGOING_NUMBER });
                }
              }}
              inputProps={{ "aria-label": "toggle-did-user" }}
            />
            <ToggleLabel>DID User</ToggleLabel>
          </ToggleContainer>
        </Tooltip>
        {form.triton.didUser ? (
          <Tooltip
            title={getOverflowSkillFromProfile(profiles, form.triton.profileId.value) !== undefined ?
              "" : "No overflow skill exists for this team"}
            placement={"bottom-start"}
          >
            <ToggleContainer>
              <Switch
                checked={form.triton.zeroOutEnabled.value}
                value={form.triton.zeroOutEnabled.value}
                disabled={getOverflowSkillFromProfile(profiles, form.triton.profileId.value) === undefined || form.formMode === formModes.DELETE}
                onChange={() => setForm({ type: userFormActions.INITIATE_ZERO_OUT_FIELDS })}
                inputProps={{ "aria-label": "toggle-zero-out" }}
              />
              <ToggleLabel>Overflow Skill</ToggleLabel>
            </ToggleContainer>
          </Tooltip>
        ): null
        }
        {form.triton.didUser ? (
          <ExtensionInput
            disabled={form.formMode === formModes.DELETE}
            extension={form.triton.extension.value}
            message={form.triton.extension.status.message}
            isError={form.triton.extension.status.isError}
          />
        ) : null
        }
        {form.triton.didUser ? (
          <Tooltip title={"enable to add self service indicator attribute to worker - needs to be DID user and profile 39 or above"} placement={"bottom-start"}>
            <ToggleContainer>
              <Switch
                disabled={form.triton.profileId.value < 39 ? true : false}
                checked={form.triton.selfServiceInd.value}
                onChange={() => {
                  setForm({ type: userFormActions.UPDATE_SELF_SERVICE_INDICATOR });
                }}
                inputProps={{ "aria-label": "toggle-did-user" }}
              />
              <ToggleLabel>Self Service Indicator</ToggleLabel>
            </ToggleContainer>
          </Tooltip>) : null}
        <RoutingAttributes />
      </RightColumn>
    </FormControlsContainer>
  );
};

export default BasicFormInfo;
