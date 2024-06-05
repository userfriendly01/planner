import {
  AdditionalFieldsWrapper,
  ClearIcon,
  DisplayNameField,
  EntryMessageField,
  TfnWrapper,
  SubmitButton
} from "./TfnActivation.Styles";
import { TfnActivationProps } from "./TfnActivation.Interfaces";
import React from "react";
import { Dropdown } from "components/Dropdown";
import { PhoneNumberInput } from "components/PhoneNumberInput";
import { useAdminState } from "context/appContext";
import {
  getTfn,
  updateTfn
} from "services/tfnActivation";
import { ModalOverlayStatuses } from "globals/interfaces";
import { timeouts } from "globals";
import { InputAdornment } from "@mui/material";
import { logger } from "utils/logger";

export const TfnActivation = (props: TfnActivationProps) => {
  const {
    confirmationModalOpts,
    setConfirmationModalOpts,
    setSaveResult
  } = props;
  const state = useAdminState();
  const { nNumber } = state.userContext;
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
        const matchingGroup = Object.values(tfnActivationGroups).find(g => g.callflowId === res.data?.callflow_id);
        const fetchedTfnState = {
          ...tfnState,
          group: matchingGroup ? {
            ...matchingGroup,
            label: matchingGroup.name,
            value: matchingGroup.callflowId
          }: null,
          displayName: res.data?.display_nme || "",
          entryMessage: res.data?.entry_msg || defaultEntryMessage
        };
        setTfnState(fetchedTfnState);
      }).catch(error => {
        logger.error("TFN GET RESPONSE: ", { error }, false);
      });
      setShowFields(true);
    } else {
      if(showFields) {
        setShowFields(false);
      }
    }
  }, [tfnState.number.valid]);

  const tfnActivationGroups = {
    SBSC: {
      name: "SBSC",
      callflowId: 9,
      defaultSkill: "sbscCertificates",
      voiceWebhookUrl: "https://cicct-app-gateway.libertymutual.com/sbsc/entry/jc",
      label: "SBSC",
      value: 9
    },
    BL_SALES: {
      name: "BL Sales",
      callflowId: 3,
      defaultSkill: "blSalesL1",
      voiceWebhookUrl: "https://cicct-app-gateway.libertymutual.com/blsales/welcome/jc",
      label: "BL Sales",
      value: 3
    },
    CLAIMS: {
      name: "Claims Intake Vanity",
      callflowId: 20,
      defaultSkill: "ccGeneralSkill12",
      voiceWebhookUrl: "https://cicct-app-gateway.libertymutual.com/claimsintake/vanity/entry/jc",
      label: "Claims Intake Vanity",
      value: 20
    },
    COMPARION_OFFICE: {
      name: "Comparion - Office",
      callflowId: 74,
      defaultSkill: "comparionOffice",
      voiceWebhookUrl: "https://cicct-app-gateway.libertymutual.com/comparion/general/enqueue/queue/comparionOffice",
      label: "Comparion Office",
      value: 74
    }
  };

  const onConfirm = () => {
    setSaveResult({
      message: "Processing...",
      status: ModalOverlayStatuses.SAVING
    });
    updateTfn(tfnState.number.e164, tfnState, nNumber).then(() => {
      logger.info(`Successfully updated TFN, ${tfnState.number.e164}`, {
        tfnState,
        nNumber
      });

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
    }).catch(error => {
      logger.error(`Failed to update TFN, ${tfnState.number.e164}`, {
        tfnState,
        nNumber,
        error
      });

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
        icon= {
          <InputAdornment position="end">
            <ClearIcon
              fontSize="large"
              onClick={() => setTfnState(defaultTfnState)}
            />
          </InputAdornment>
        }
      />
      {showFields &&
        <AdditionalFieldsWrapper>
          <Dropdown
            label="Group"
            value={tfnState.group}
            options={Object.values(tfnActivationGroups)}
            updateValue={(event: any, group: any) => {
              setTfnState({
                ...tfnState,
                entryMessage: group.value === tfnActivationGroups.BL_SALES.callflowId ? defaultEntryMessage : tfnState.entryMessage,
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
            disabled={tfnState.group && tfnState.group.name === tfnActivationGroups.BL_SALES.name || tfnState.group && tfnState.group.name === tfnActivationGroups.COMPARION_OFFICE.name}
            label="Entry Message"
            multiline={true}
            minRows={4}
            value={tfnState.group && tfnState.group.name === tfnActivationGroups.COMPARION_OFFICE.name ? "" : tfnState.entryMessage}
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