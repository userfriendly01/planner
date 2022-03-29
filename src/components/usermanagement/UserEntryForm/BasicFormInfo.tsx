import { BasicFormInfoProps } from "./UserEntryForm.Interfaces";
import {
  FormControlsContainer,
  FormControlsPane,
  RightColumn,
  ToggleContainer,
  ToggleLabel,
  UserFormButton
} from "./UserEntryForm.Styles";
import {
  Switch,
  Tooltip
} from "@material-ui/core";
import {
  DidFormInfoAdd,
  DidFormInfoUpdate,
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
import { checkExtension } from "services";
import {
  getOverflowSkillFromProfile,
  isExtensionValid,
  isProfileIdValid,
  isManagerValid,
  sortManagersByName,
  sortProfilesByName
} from "utils";
import { useState } from "react";
import styled from "styled-components";

import ReservedExtensions from "./ReservedExtensions";

const MIN_EXTENSION_NUM = 10000;
const EXTENSION_NUM_RANGE = 89995;
const MAX_EXTENSION_TRIES = 5;

enum ExtensionSearchStatuses {
  Idle,
  ExistingExtension,
  WaitingForResponse,
  NewExtension,
}
interface ExtensionStatusParams {
  searchStatus: ExtensionSearchStatuses,
  extensionNum: string,
  tryNumber: number,
}

const ExtensionWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

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

  const [extensionState, setExtensionState] = useState<ExtensionStatusParams>({
    searchStatus: ExtensionSearchStatuses.Idle,
    extensionNum: form.extension.value,
    tryNumber: 0
  });

  const isOutgoingDisabled = (): boolean => {
    if (form.formMode === formModes.INSERT) {
      return false;
    } else {
      return form.editDisabled && worker.directDialNum ? true : false;
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

  const assignExtension = () => {
    let extNum = "";
    while (extNum === "") {
      const oneNum = MIN_EXTENSION_NUM + Math.floor((Math.random() * EXTENSION_NUM_RANGE));
      console.log("wsx Random extension:", oneNum);
      if (ReservedExtensions.indexOf(oneNum) === -1) {
        extNum = oneNum.toString();
      } else {
        console.log("wsx Reserved extension skipped:", oneNum);
      }
    }
    if (extensionState.tryNumber < MAX_EXTENSION_TRIES) {
      console.log("wsx Verifying:", extNum);
      setExtensionState({
        searchStatus: ExtensionSearchStatuses.WaitingForResponse,
        extensionNum: extNum,
        tryNumber: extensionState.tryNumber + 1
      });
      checkExtension(extNum)
        .then(isExtensionAvailable => {
          if (isExtensionAvailable) {
            console.log("wsx Extension is available:", extNum);
            setExtensionState({
              searchStatus: ExtensionSearchStatuses.Idle,
              extensionNum: extNum,
              tryNumber: 0
            });
            setForm({
              type: userFormActions.UPDATE_EXTENSION,
              payload: {
                extension: extNum,
                isValid: true
              }
            });
          } else {
            console.log("wsx Number is taken");
            setExtensionState({
              searchStatus: ExtensionSearchStatuses.Idle,
              extensionNum: "",
              tryNumber: extensionState.tryNumber
            });
          }
        })
        .catch(err => {
          console.error("Failed to look up extension", {
            err,
            extNum
          });
        });
    } else {
      console.log("wsx Retries Exhausted");
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
        {form.didUser ? (
          <ExtensionWrapper>
            <ModalExtension
              error={form.extension.blurred && !isExtensionValid(form)}
              extension={form.extension.value}
              originalValue={(worker && worker.attributes) ? worker.attributes.extension : undefined}
              onClear={() => setForm({ type: userFormActions.CLEAR_EXTENSION })}
              onUpdate={(extension, extensionValid) => setForm({
                type: userFormActions.UPDATE_EXTENSION,
                payload: {
                  extension,
                  isValid: extensionValid
                }
              })}
            />
            <UserFormButton
              disabled={false}
              onClick={assignExtension}
            >
              {"Auto-Assign"}
            </UserFormButton>
          </ExtensionWrapper>
        ) : null
        }
      </FormControlsPane>
      <RightColumn>
        {!form.didUser &&
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
          />
        }
        {form.didUser && form.formMode === formModes.INSERT &&
          <DidFormInfoAdd
            skills={skills}
            worker={worker}
            workers={workers}
            forwardToToggle={forwardToToggle}
            setForwardToToggle={setForwardToToggle}
          />
        }
        {form.didUser && form.formMode === formModes.UPDATE &&
          <DidFormInfoUpdate
            skills={skills}
            worker={worker}
            workers={workers}
            forwardToToggle={forwardToToggle}
            setForwardToToggle={setForwardToToggle}
          />
        }
      </RightColumn>
    </FormControlsContainer>
  );
};

export default BasicFormInfo;