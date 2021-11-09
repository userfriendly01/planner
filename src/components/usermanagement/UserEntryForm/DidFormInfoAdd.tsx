import { DidFormInfoProps } from "./UserEntryForm.Interfaces";
import {
  FormControlsPane,
  StyledIcon
} from "./UserEntryForm.Styles";
import { InputAdornment } from "@material-ui/core";
import {
  ForwardToEntryForm,
  ModalPhoneNumber
} from "components";
import {
  useFormDispatch,
  useFormState,
  userFormActions
} from "context";
import { formModes } from "globals";
import React from "react";

const BasicFormInfo = (props: DidFormInfoProps) => {

  const {
    skills,
    worker,
    workers,
    forwardToToggle,
    setForwardToToggle
  } = props;

  const form = useFormState();
  const setForm = useFormDispatch();

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
    <FormControlsPane>
      <ModalPhoneNumber
        disabled={form.editDisabled}
        allowSevenDigitVdn={false}
        id="direct-dial-number"
        number={form.directDialNum.value}
        label="Direct Dial Number *"
        showError={form.directDialNum.blurred}
        onBlur={() => handleOnBlur("directDialNum")}
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
      <ModalPhoneNumber
        disabled={!worker?.alternateDid || form.formMode === formModes.INSERT ? false : true}
        allowSevenDigitVdn={false}
        id="skype-teams-did"
        number={form.alternateDid.value}
        label="Skype/Teams DID *"
        showError={form.alternateDid.blurred}
        onBlur={() => handleOnBlur("alternateDid")}
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

export default BasicFormInfo;