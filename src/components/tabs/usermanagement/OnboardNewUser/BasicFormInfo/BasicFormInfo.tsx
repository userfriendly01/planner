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
  DidFormInfo,
  Dropdown,
  ExtensionInput,
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
import React from "react";
import {
  getOverflowSkillFromProfile,
  isProfileIdValid,
  isManagerValid,
  sortManagersByName,
  sortProfilesByName
} from "utils";

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

  const isOutgoingDisabled = (): boolean => {
    if (form.formMode === formModes.INSERT) {
      return false;
    } else {
      return form.editDisabled && worker?.directDialNum ? true : false;
    }
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
        <Dropdown
          disabled={form.formMode === formModes.DELETE}
          error={form.manager.blurred && !isManagerValid(form)}
          label={"Manager *"}
          styles={{
            width: "384px",
            margin: "8px 0px 5px 0px"
          }}
          onBlur={() => handleOnBlur("manager")}
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
          value={form.manager.value ? `${form.manager.value.manager_first_name} ${form.manager.value.manager_last_name} - ${form.manager.value.manager_n_number}`: ""}
        />
        <Dropdown
          disabled={form.formMode === formModes.DELETE}
          error={form.profileId.blurred && !isProfileIdValid(form)}
          label={"Team *"}
          styles={{
            width: "384px",
            margin: "10px 0px"
          }}
          onBlur={() => handleOnBlur("profileId")}
          options={profiles.sort(sortProfilesByName).map((profile: any) => formatDropdownOption(profile.profile_id, profile.profile_nme, profile))}
          updateValue={(event: any, newValue: any) => {
            setForm({
              type: userFormActions.UPDATE_TEAM,
              payload: {
                profileId: newValue.value,
                profiles
              }
            });
            // reset selfServiceInd value to false if set to true and then profile chnaged to value of 39 and below
            if(newValue.value < 39 && form.selfServiceInd){
              setForm({ type: userFormActions.UPDATE_SELF_SERVICE_INDICATOR });
            }
          }}
          value={profiles.find(p => p.profile_id === form.profileId.value)?.profile_nme || ""}
        />
        <NNumberInput
          disabled={
            (form.formMode === formModes.UPDATE) ||
            (form.nNumberFetchedUser ? true : false) ||
            form.formMode === formModes.DELETE
          }
          fetchedUser={form.nNumberFetchedUser}
          label="N Number *"
          onBlur={() => handleOnBlur("nNumber")}
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
              checked={form.didUser}
              onChange={() => {
                setForm({ type: userFormActions.INITIATE_DID_FIELDS });
                if (form.extension.value) {
                  setForm({ type: userFormActions.CLEAR_EXTENSION });
                }
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
                disabled={getOverflowSkillFromProfile(profiles, form.profileId.value) === undefined || form.formMode === formModes.DELETE}
                onChange={() => setForm({ type: userFormActions.INITIATE_ZERO_OUT_FIELDS })}
                inputProps={{ "aria-label": "toggle-zero-out" }}
              />
              <ToggleLabel>Overflow Skill</ToggleLabel>
            </ToggleContainer>
          </Tooltip>
        ): null
        }
        {form.didUser ? (
          <ExtensionInput
            disabled={form.formMode === formModes.DELETE}
            extension={form.extension.value}
            message={form.extensionStatus.message}
            isError={form.extensionStatus.isError}
          />
        ) : null
        }
        {form.didUser ? (
          <Tooltip title={"enable to add self service indicator attribute to worker - needs to be DID user and profile 39 or above"} placement={"bottom-start"}>
            <ToggleContainer>
              <Switch
                disabled={form.profileId.value < 39 ? true : false}
                checked={form.selfServiceInd}
                onChange={() => {
                  setForm({ type: userFormActions.UPDATE_SELF_SERVICE_INDICATOR });
                }}
                inputProps={{ "aria-label": "toggle-did-user" }}
              />
              <ToggleLabel>Self Service Indicator</ToggleLabel>
            </ToggleContainer>
          </Tooltip>) : null}
      </FormControlsPane>
      <RightColumn>
        {!form.didUser ?
          <PhoneNumberInput
            disabled={isOutgoingDisabled() || form.formMode === formModes.DELETE}
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
          /> :
          <DidFormInfo
            worker={worker}
            forwardToToggle={forwardToToggle}
            setForwardToToggle={setForwardToToggle}
          />
        }
        <SkillsFormInfo />
      </RightColumn>
    </FormControlsContainer>
  );
};

export default BasicFormInfo;
