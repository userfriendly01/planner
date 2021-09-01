import React from "react";
import {
  Switch,
  Tooltip
} from "@material-ui/core";
import {
  FormControlsContainer,
  FormControlsPane,
  ToggleContainer,
  ToggleLabel
} from "./UserEntryFormStyles";
import {
  DefaultSkillSelector,
  ForwardToEntryForm,
  ModalPhoneNumber
} from "components";
import { userFormActions } from "context";
import { getOverflowSkill } from "utils";
import {
  formModes,
  DidFormInfoProps
} from "globals";

const DidFormInfo = (props: DidFormInfoProps) => {

  const {
    form,
    setForm,
    skills,
    worker,
    workers,
    profiles,
    forwardToToggle,
    profileHasZeroOutEnabled
  } = props;


  return(
    <FormControlsContainer>
      <FormControlsPane>
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
              onChange={() => setForm({ type: userFormActions.INITIATE_DID_FIELDS })}
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
                  disabled={getOverflowSkill(form, profiles) === null}
                  onChange={() => setForm({ type: userFormActions.INITIATE_ZERO_OUT_FIELDS })}
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
              onBlur={() =>
                setForm({
                  type: userFormActions.SET_BLUR_ON_FIELD,
                  payload: "directDialNum"
                })
              }
              label="Internal Routing Number *"
              showError={form.directDialNum.blurred}
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
              onBlur={() =>
                setForm({
                  type: userFormActions.SET_BLUR_ON_FIELD,
                  payload: "alternateDid"
                })
              }
              label="Skype/Teams DID *"
              showError={form.alternateDid.blurred}
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

export default DidFormInfo;