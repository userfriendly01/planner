import { DidFormInfoProps } from "./UserEntryForm.Interfaces";
import {
  FormControlsContainer,
  FormControlsPane,
  SipDisclaimer,
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
  const isSipUser = worker.attributes.sip ? true : false;

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
        <>
          <ModalPhoneNumber
            disabled={isOutgoingDisabled() || isSipUser}
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
            icon={worker?.directDialNum && form.formMode === formModes.UPDATE && !isSipUser ? (
              <InputAdornment position="end">
                <StyledIcon
                  fontSize="large"
                  onClick={() => editPenClick()}
                />
              </InputAdornment>
            ) : null
            }
          />
          {forwardToToggle && form.formMode === formModes.UPDATE && (
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
          )}
          <ModalPhoneNumber
            disabled={form.editDisabled || isSipUser}
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
        </>
        <ModalPhoneNumber
          disabled={worker?.alternateDid ? true : false}
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
        {isSipUser &&
          <SipDisclaimer>Phone numbers for SIP users cannot be edited at this time.</SipDisclaimer>
        }
      </FormControlsPane>
    </FormControlsContainer>
  );
};

export default BasicFormInfo;