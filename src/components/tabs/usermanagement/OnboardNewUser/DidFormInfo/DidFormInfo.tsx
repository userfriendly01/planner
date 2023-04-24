import { FormControlsPane } from "../UserEntryFormWrapper/UserEntryFormWrapper.Styles";
import { DidFormInfoProps } from "../UserEntryFormWrapper/UserEntryFormWrapper.Interfaces";
import {
  ForwardToEntryForm,
  PhoneNumberInput
} from "components";
import {
  useFormDispatch,
  useFormState,
  userFormActions
} from "context";
import { formModes } from "globals";
import React from "react";

const DidFormInfo = (props: DidFormInfoProps) => {

  const {
    worker,
    // forwardToToggle,
    // setForwardToToggle
  } = props;

  const form = useFormState();
  const setForm = useFormDispatch();

  const handleOnBlur = (field: string, system: string) => {
    const isFieldValid = system ? form[system][field].valid: form[field].valid;
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
    <FormControlsPane>
      <PhoneNumberInput
        disabled={form.formMode === formModes.DELETE}
        allowSevenDigitVdn={false}
        id="direct-dial-number"
        number={form.triton.directDialNum.value}
        label="Direct Dial Number *"
        showError={form.triton.directDialNum.blurred}
        onBlur={() => handleOnBlur("directDialNum", "triton")}
        updateValue={(maskedValue, _unmaskedValue, isValid, e164Number) => {
          //FAITH - check if changed value is the same and mark it as not updated
          setForm({
            type: userFormActions.UPDATE_PHONE_NUMBER,
            payload: {
              field: "directDialNum",
              maskedValue,
              isValid,
              e164Number
            }
          });
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
      {form.formMode === formModes.UPDATE && form.triton.directDialNum.updated && (
        <ForwardToEntryForm
          label={"Please choose a forward to option for the existing direct dial number"}
          updateForwardTo={(value: string) => {
            setForm({
              type: userFormActions.UPDATE_INACTIVE_FORWARD_TO,
              payload: value
            });
          }}
        />
      )}
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
    </FormControlsPane>
  );
};

export default DidFormInfo;