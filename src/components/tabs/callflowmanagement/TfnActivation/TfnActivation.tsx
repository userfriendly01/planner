import {
  AdditionalFieldsWrapper,
  DisplayNameField,
  EntryMessageField,
  TfnWrapper,
  SubmitButton
} from "./TfnActivation.Styles";
import {
  ConfirmationModalOptsProps,
  SaveResultProps
} from "../CallFlowConfirmationModal/CallFlowConfirmationModal.Interfaces";
import React from "react";
import {
  Dropdown,
  PhoneNumberInput
} from "components";
import {
  useAdminState
} from "context";
import {
  getTfn,
  updateTfn
} from "services";
import {
  ModalOverlayStatuses,
  timeouts
} from "globals";

interface TnfActivationProps {
  confirmationModalOpts: ConfirmationModalOptsProps,
  setSaveResult: (props: SaveResultProps) => void,
  setConfirmationModalOpts: (props: ConfirmationModalOptsProps) => void
}

export const TfnActivation = (props: TnfActivationProps) => {
  const {
    confirmationModalOpts,
    setConfirmationModalOpts,
    setSaveResult
  } = props;
  const state = useAdminState();
  const nNumber = state.userContext.pingIdentity.sub;
  const [ showFields, setShowFields ] = React.useState(false);
  const defaultEntryMessage = "Thank you for calling Liberty Mutual Insurance";
  const defaultTfnState: any = {
    number: {
      value: "",
      blurred: false,
      e164: undefined,
      valid: false
    },
    group: null,
    displayName: "",
    entryMessage: defaultEntryMessage
  };
  const [ tfnState, setTfnState ] = React.useState(defaultTfnState);

  React.useEffect(() => {
    if(tfnState.number.valid){
      getTfn(tfnState.number.e164).then((res: any) => {
        const group = tfnActivationGroups.find(g => g.callflowId = res.data.callflow_id);
        const fetchedTfnState = {
          ...tfnState,
          group: group ? {
            ...group,
            label: group.name,
            value: group.callflowId
          }: null,
          displayName: res.data.display_nme || "",
          entryMessage: res.data.entry_msg || defaultEntryMessage
        };
        setTfnState(fetchedTfnState);
      }).catch((err: any) => {
        console.error("TFN GET RESPONSE: ", err);
      });
      setShowFields(true);
    }
  }, [tfnState.number.valid]);

  const tfnActivationGroups = [
    {
      name: "SBSC",
      callflowId: 9,
      defaultSkill: "sbscCertificates",
      voiceWebhookUrl: "https://cicct-app-gateway.libertymutual.com/sbsc/entry/jc"
    },
    {
      name: "BL Sales",
      callflowId: 3,
      defaultSkill: "blSalesL1",
      voiceWebhookUrl: "https://cicct-app-gateway.libertymutual.com/blsales/welcome/jc"
    },
    {
      name: "Claims Intake Vanity",
      callflowId: 20,
      defaultSkill: "ccGeneralSkill12",
      voiceWebhookUrl: "https://cicct-app-gateway.libertymutual.com/claimsintake/vanity/entry/jc"
    }
  ];

  const onConfirm = () => {
    setSaveResult({
      message: "Processing...",
      status: ModalOverlayStatuses.SAVING
    });
    updateTfn(tfnState.number.e164, tfnState, nNumber).then(() => {
      setSaveResult({
        message: "Request Successfully Processed",
        status: ModalOverlayStatuses.SUCCESS
      });
      setTimeout(() => {
        setSaveResult({
          message: "",
          status: null
        });
        setTfnState(defaultTfnState);
        setShowFields(false);
        setConfirmationModalOpts({
          ...confirmationModalOpts,
          open: false
        });
      }, timeouts.MODAL_OVERLAY);
    }).catch((err: any) => {
      console.error("Update TFN Failed: ", err);
      setSaveResult({
        message: "Request Failed",
        status: ModalOverlayStatuses.FAIL
      });
    });
  };

  const onClose = () => {
    setConfirmationModalOpts({
      ...confirmationModalOpts,
      open: false
    });
  };

  const handleOnSubmit = () => {
    setConfirmationModalOpts({
      open: true,
      confirmationText: "Are you sure you want to update this TFN?",
      exportButton: false,
      callbackMethods: {
        onConfirm: onConfirm,
        handleClose: onClose
      }
    });
  };

  const isFormValid = tfnState.number.valid && tfnState.group && tfnState.displayName && tfnState.entryMessage ? true : false;

  return (
    <TfnWrapper>
      <PhoneNumberInput
        id="Toll Free Number"
        label="Toll Free Number"
        number={tfnState.number.value}
        showError={tfnState.number.blurred && !tfnState.number.valid}
        onBlur={() => setTfnState({
          ...tfnState,
          number: {
            ...tfnState.number,
            blurred: true
          }
        })}
        updateValue={(maskedValue: string, unmaskedValue: string, isValid: boolean, e164Number: string) => {
          console.log(`maskedValue: ${maskedValue} - "unmaskedValue: ${unmaskedValue} - isValid: ${isValid} - e164Number: ${e164Number}`);
          setTfnState({
            ...tfnState,
            number: {
              ...tfnState.number,
              value: unmaskedValue,
              valid: isValid,
              e164: e164Number
            }
          });
        }}
      />
      {showFields &&
        <AdditionalFieldsWrapper>
          <Dropdown
            label="Group"
            value={tfnState.group}
            options={tfnActivationGroups.map(g => {
              return {
                ...g,
                label: g.name,
                value: g.callflowId
              };
            })}
            updateValue={(event: any, group: any) => {
              console.log("hm", tfnActivationGroups[1].name, group.label);
              setTfnState({
                ...tfnState,
                entryMessage: group.value === tfnActivationGroups[1].callflowId ? defaultEntryMessage : tfnState.entryMessage,
                group
              }); }
            }
            styles={{
              width: "300px",
              margin: "30 0 0 0"
            }}
          />
          <DisplayNameField
            label= "Display Name"
            value={tfnState.displayName}
            onChange={e => setTfnState({
              ...tfnState,
              displayName: e.target.value
            })}
          />
          <EntryMessageField
            disabled={tfnState.group && tfnState.group.name === "BL Sales"}
            label="Entry Message"
            multiline={true}
            minRows={4}
            value={tfnState.entryMessage}
            onChange={e => setTfnState({
              ...tfnState,
              entryMessage: e.target.value
            })}
          />
          <SubmitButton
            disabled={!isFormValid}
            onClick={handleOnSubmit}
          >Submit Changes</SubmitButton>
        </AdditionalFieldsWrapper>
      }
    </TfnWrapper>
  );
};

export default TfnActivation;