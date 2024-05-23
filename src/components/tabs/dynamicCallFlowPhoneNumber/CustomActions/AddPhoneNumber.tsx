/* eslint-disable react/prop-types */

import React, {
  useEffect, useState
} from "react";
import {
  Modal, ModalHeader
} from "@lmig/lmds-react-modal";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {
  ComponentControl, CustomToast
} from "components";
import {
  DynamicCallFlowPhoneNumberDropDownList,
  DynamicCallFlowPhoneNumberMasterData,
  ViewOrAddBooleanProps
} from "../DynamicCallFlowPhoneNumber.Interfaces";
import {
  HeadingStyled, ModalBodyStyled, ModalFooterStyled
} from "../DynamicCallFlowPhoneNumber.Styles";
import {
  BrandName, checkGreetingMessageRegExp, FLOW_MASTER_DATA, flowDropDownList
} from "utils";
import { AzureSPA } from "../../../../globals";
import { AddOrViewPhoneNumber } from "./AddOrViewPhoneNumber";
import { FloatingHeader } from "@lmig/lmds-react-floating-header";
import { LegacyPhoneNumberTypeEnum } from "../GraphQL/LegacyPhoneNumber.Interfaces";
import { listPhoneNumberRecords } from "../GraphQL/Util/ListPhoneNumberRecordUtil";
import {
  CallFlowNameEnum,
  CallFlowTypeEnum,
  LanguageOfferEnum,
  NextActionTypeEnum, PhoneNumberRecordType,
  TfnRoutingGroupEnum,
  UserDestinationEnum
} from "../GraphQL/DynamicPhoneNumber.Interfaces";
import { convertFormFieldToPhoneNumberRecord } from "../Utils/FormValidationRuleUtil";
import { hasDuplicateCallFlowRecord } from "../DataGrid/Util/MatchCallFlowRecords.Util";
import { GREETING_MESSAGES } from "../Field/DynamicPhoneNumberFields";
import { SingleCallFlowRecord } from "../GraphQL/Util/SinglePhoneNumberRecord.Util";
import { AlertBarState } from "../../../../common/StateManager/AlertBarState.Manager";
import { DisplayState } from "../StateManager/DisplayState.Manager";
import { checkForDuplicateErrorMessage } from "../../../../common/GraphQL/GraphQLUtil";
import { AlertBarProps } from "../../../../common/StateManager/AlertBarState.Interfaces";
import {
  ControlEnum,
  FormFieldConfig,
  FormFields
} from "../../../../common/FormField/FormField.Interfaces";
import { PhoneNumberFormFieldConfigs } from "../Field/PhoneNumberFieldsConfig";
import { FormFieldsState } from "../../../../common/FormField/FormFieldsState.Manager";
import { PhoneNumberDataGridManager } from "../DataGrid/PhoneNumberDataGrid.Manager";

export type OpenAddModalType = (flag: boolean, isSubmitted?: boolean, phoneNumberRecord?: PhoneNumberRecordType) => void;

export interface AddPhoneNumberModalProps {
  phoneNumberDataGridManager: PhoneNumberDataGridManager,
  cloneType?: boolean;
  clonedFormFields?: FormFields;
}

//TODO: JSX is deprecated, need to research what to do.  import {JSX} from 'react'
export const AddPhoneNumber = ({
  phoneNumberDataGridManager, accessToken, cloneType, clonedFormFields
}: AddPhoneNumberModalProps & AzureSPA):JSX.Element => {

  // const [flowRule, setFlowRule] = useState<FormValidationRule>({ ...initRule });
  const [dropDownValues, setDropDownValues] = useState<DynamicCallFlowPhoneNumberDropDownList>(flowDropDownList);
  const formFields = new FormFieldsState(PhoneNumberFormFieldConfigs);
  const alertBarState: AlertBarState = new AlertBarState();
  const displayState = new DisplayState();

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const masterData: string = localStorage.getItem(FLOW_MASTER_DATA);
      let masterDataObject: DynamicCallFlowPhoneNumberMasterData;

      if (masterData !== undefined && masterData !== null) {
        masterDataObject = JSON.parse(masterData);
      } else {
        masterDataObject = phoneNumberDataGridManager.getGridMasterData(await listPhoneNumberRecords(accessToken));
      }

      setDropDownValues((dropDownValuesProps: DynamicCallFlowPhoneNumberDropDownList) => ({
        ...dropDownValuesProps,
        brand: masterDataObject.brand,
        channel: masterDataObject.channel,
        languageOffer: Object.values<string>(LanguageOfferEnum),
        userDestination: Object.values<string>(UserDestinationEnum),
        callFlowName: Object.values<string>(CallFlowNameEnum),
        callFlowRoute: masterDataObject?.callFlowRoute,
        callFlowType: Object.values<string>(CallFlowTypeEnum),
        callerType: masterDataObject?.callerType,
        nextActionType: Object.values<string>(NextActionTypeEnum),
        dataRequests: masterDataObject?.dataRequests,
        tfnRoutingGroup: Object.values<string>(TfnRoutingGroupEnum),
        phoneNumberType: Object.values<string>(LegacyPhoneNumberTypeEnum)
      } as DynamicCallFlowPhoneNumberDropDownList));
    }

    fetchData();

    displayState.reset();
  }, []);

  useEffect(()=> {
    //TODO: Not sure why it was setting itself to itself?  Is this supposed to reset to initial state?
    // setFlowRule((rule: FormValidationRule) => ({
    //   ...rule
    // }));

    if(cloneType) {
      formFields.state = clonedFormFields;
    }
  },[phoneNumberDataGridManager.openAddModal]);

  const handleClose = (flag: boolean) => {
    alertBarState.open = flag;
  };

  //TODO: Should valuePassed be a string?
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, valuePassed?:string, key?:string) {
    let value: string;

    if(valuePassed && typeof(valuePassed) === "string" && !displayState.state[key as keyof ViewOrAddBooleanProps]){
      value = valuePassed;
    } else{
      value = event.target.value;
    }

    value = (key === "pkey" && !value.startsWith("+")) ? `+1${value}` : value;

    formFields.state = {
      [key]: {
        ...formFields.state[key as keyof FormFields],
        value,
        error: isInvalidField(key, value)
      }
    };
  }

  function isInvalidField(key: string, value: string): boolean {
    if (GREETING_MESSAGES === key) {
      return checkGreetingMessageRegExp(value);
    }
    return formFields.state[key as keyof FormFields].required && [undefined, "", null].includes(value);
  }

  //TODO: Add validation
  function isFieldConditionMet(key: string): boolean {
    if (PhoneNumberFormFieldConfigs[key]?.dynamicFieldConditionCheck) {
      return PhoneNumberFormFieldConfigs[key].dynamicFieldConditionCheck(formFields.state);
    } else {
      // If there isn't a fieldConditionCheck, then the field condition is always valid
      return true;
    }
  }

  function isValidCallFlowRecord() {
    let isValidForm = true;

    Object.keys(formFields.state).forEach((key: string) => {
      if (isInvalidField(key, formFields.state[key].value) && isFieldConditionMet(key)) {
        isValidForm = false;
        formFields.state = {
          [key]: {
            ...formFields.state[key as keyof FormFields],
            error: true
          }
        };
      }
    });

    return isValidForm;
  }

  function resetFlowRule() {
    formFields.reset();
    phoneNumberDataGridManager.openAddModal(false);
  }

  function navigateButtons(display:boolean,key:string) {
    displayState.setProperty(key, display);
  }

  const handleOnAddCallFlowRecord = async (): Promise<void> => {
    if (isValidCallFlowRecord()) {
      const newCallFlowRecord = convertFormFieldToPhoneNumberRecord(formFields.state);

      if (hasDuplicateCallFlowRecord(phoneNumberDataGridManager.dataGrid.data, newCallFlowRecord, alertBarState)) {
        return;
      }

      const singleCallFlowResults = await SingleCallFlowRecord.create(accessToken, newCallFlowRecord);

      if (!singleCallFlowResults.errors) {
        phoneNumberDataGridManager.openAddModal(false, true, singleCallFlowResults.record);
        alertBarState.success("New call flow has been successfully added.");

        formFields.reset();
      } else {
        checkForDuplicateErrorMessage(singleCallFlowResults.errors);
        alertBarState.error(singleCallFlowResults.errors.join("\n"));
      }
    }
  };

  return (
    <div>
      <Modal
        size="large"
        className="route-table-modal-wrapper"
        takeover={["base", "sm", "md", "lg"]}
        isOpen={phoneNumberDataGridManager.dataGrid.isAddModalOpen}
        onClose={() => {
          resetFlowRule();
        }}
      ><ModalHeader>
          {
            ["Liberty Mutual", "Safeco"].includes(formFields.state?.brand?.value)?
              (<FloatingHeader brand={BrandName[formFields.state?.brand?.value]} overlayIsOpen>
                <HeadingStyled type="h4-light">Add Flow Rule</HeadingStyled>
              </FloatingHeader>):
              (
                <HeadingStyled type="h4-light">Add Flow Rule
                </HeadingStyled>
              )
          }
        </ModalHeader>
        <ModalBodyStyled >
          <Grid container rowSpacing={3}>
            {
              Array.from<string>(Object.keys(PhoneNumberFormFieldConfigs)).map((key: string) => {
                const {
                  label, control, required = false, dynamicFieldConditionCheck, fieldType, gridSize = 12
                }: FormFieldConfig = PhoneNumberFormFieldConfigs[key];

                if(dynamicFieldConditionCheck && !dynamicFieldConditionCheck(formFields.state)) {
                  return;
                }

                return (
                  <Grid container key = {key} item xs = {4}>
                    <Grid key = {key} item xs = {gridSize}>
                      <ComponentControl
                        control={fieldType && displayState.state[key as keyof ViewOrAddBooleanProps] ? ControlEnum.Input : control}
                        name={key}
                        label={label}
                        type="text"
                        value={formFields.state[key as keyof FormFields].value}
                        error={formFields.state[key as keyof FormFields].error}
                        dropDownOptions={dropDownValues[key as keyof DynamicCallFlowPhoneNumberDropDownList] || []}
                        onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value?:string) => handleInputChange(event,value,key)}
                        required={required}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <AddOrViewPhoneNumber navigateViewOrAdd = {navigateButtons} keys = {key}></AddOrViewPhoneNumber>
                    </Grid>
                  </Grid>
                );
              })
            }
          </Grid>
        </ModalBodyStyled>
        <ModalFooterStyled >
          <Button
            type="submit"
            value="Save"
            variant="contained"
            color="primary"
            sx={{ marginRight: 2 }}
            aria-label = "createRuleButton"
            onClick={() => handleOnAddCallFlowRecord()}
          >
            Create Rule
          </Button>
          <Button
            value="Cancel"
            variant="outlined"
            color="primary"
            aria-label = "resetRuleButton"
            onClick={() => resetFlowRule()}
          >
            Cancel
          </Button>
        </ModalFooterStyled>
      </Modal>
      <CustomToast
        open={alertBarState.open}
        onClose={handleClose}
        msg={alertBarState.msg}
        severityType={alertBarState.severityType}
      />
    </div>
  );
};



