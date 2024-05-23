import React, {
  useEffect, useMemo, useState
} from "react";
import {
  Modal, ModalHeader
} from "@lmig/lmds-react-modal";
import { FloatingHeader } from "@lmig/lmds-react-floating-header";
import {
  Button, Grid
} from "@mui/material";
import { AddOrViewPhoneNumber } from "./AddOrViewPhoneNumber";
import {
  HeadingStyled, ModalBodyStyled, ModalFooterStyled
} from "../DynamicCallFlowPhoneNumber.Styles";
import {
  DynamicCallFlowPhoneNumberDropDownList,
  DynamicCallFlowPhoneNumberMasterData,
  ViewOrAddBooleanProps
} from "../DynamicCallFlowPhoneNumber.Interfaces";
import {
  PhoneNumberFormFieldConfigs
} from "../Field/PhoneNumberFieldsConfig";
import { CustomToast } from "components";
import {
  BrandName, callFlowName, callFlowType, checkGreetingMessageRegExp,
  FLOW_MASTER_DATA,
  flowDropDownList, flowType, languageOffer, nextActionType,
  readWriteAccess, tfnRoutingGroup, userDestination
} from "utils";
import ComponentControl from "../../../core/SharedComponents/ComponentControl";
import { AzureSPA } from "../../../../globals";
import { PhoneNumberRecordType } from "../GraphQL/DynamicPhoneNumber.Interfaces";
import { SingleRecordResults } from "../../../../common/GraphQL/AbstractSingleRecordQuery";
import { PhoneNumberRecordUtil } from "../GraphQL/Util/PhoneNumberRecordUtil";
import { hasDuplicateCallFlowRecord } from "../DataGrid/Util/MatchCallFlowRecords.Util";
import { DisplayState } from "../StateManager/DisplayState.Manager";
import { SingleCallFlowRecord } from "../GraphQL/Util/SinglePhoneNumberRecord.Util";
import { GREETING_MESSAGES } from "../Field/DynamicPhoneNumberFields";
import { ObjectState } from "../../../../common/StateManager/ObjectState.Manager";
import {
  ControlEnum, FormFieldConfig,
  FormFields
} from "../../../../common/FormField/FormField.Interfaces";
import { FormFieldsState } from "../../../../common/FormField/FormFieldsState.Manager";
import { PhoneNumberDataGridManager } from "../DataGrid/PhoneNumberDataGrid.Manager";

interface EditFlowComponentProps {
  phoneNumberDataGridManager: PhoneNumberDataGridManager,
  selectedRow: PhoneNumberRecordType;
  openEditModal: (flag: boolean, isSubmitted?: boolean, phoneNumberRecord?: PhoneNumberRecordType, message?: string, deleteRow?: boolean, isClonedFlowRule?: boolean) => void;
  dataGridStateCallFlowRecords?: Array<PhoneNumberRecordType>;
}

//TODO: JSX is deprecated, need to research other option
export const EditPhoneNumber = ({
  phoneNumberDataGridManager, accessToken, matchedGroups, selectedRow, openEditModal, dataGridStateCallFlowRecords
}: EditFlowComponentProps & AzureSPA): JSX.Element => {

  // const selectedRowLocal = new DataGridState<PhoneNumberRecordType>();
  const displayState = new DisplayState();
  const formFieldsState = new FormFieldsState(PhoneNumberFormFieldConfigs);
  const selectedRowState = new ObjectState<PhoneNumberRecordType>();

  const [selectedRowLocal, setSelectedRowLocal] = useState<PhoneNumberRecordType>({} as PhoneNumberRecordType);
  const [dropDownValues, setDropDownValues] = useState(flowDropDownList);
  const enableFlow = useMemo<boolean>(() => readWriteAccess(matchedGroups,"dynamic-call-flow"), []);
  // const isValidGreetingMessages = selectedRow ? JSON.parse(JSON.stringify(selectedRow)) : undefined;

  useEffect(() => {
    selectedRowState.state = selectedRow;
    displayState.state = {
      callerType: false,
      dataRequests: false,
      callFlowRoute: false
    };

    const masterDataStorage: string = localStorage.getItem(FLOW_MASTER_DATA);
    const masterData: DynamicCallFlowPhoneNumberMasterData = JSON.parse(masterDataStorage);
    setDropDownValues((dropDownOptions: DynamicCallFlowPhoneNumberDropDownList) => (
      {
        ...dropDownOptions,
        brand: masterData?.brand,
        channel: masterData?.channel,
        languageOffer: languageOffer,
        userDestination: userDestination,
        callFlowName: callFlowName,
        callFlowRoute: masterData?.callFlowRoute,
        callFlowType: callFlowType,
        callerType: masterData?.callerType,
        dataRequests: masterData?.dataRequests,
        nextActionType: nextActionType,
        tfnRoutingGroup: tfnRoutingGroup,
        phoneNumberType: flowType
      })
    );

    if (phoneNumberDataGridManager.dataGrid.isEditModalOpen) {
      formFieldsState.reset();
    }

  }, [selectedRow]);

  const isInvalidField =(key: string, value: string): boolean =>{
    if(key === GREETING_MESSAGES){
      return checkGreetingMessageRegExp(value);
    }
    return formFieldsState.state[key].required && [undefined, "", null, "null"].includes(value);
  };

  // const isInvalid = (formValidation: FormValidationProps): boolean => {
  //
  // }

  const validateFlow = async (): Promise<boolean> => {
    let isValidForm = true;

    Object.keys(formFieldsState.state).forEach(key => {
      const fieldValue = PhoneNumberRecordUtil.getPropertyValue(selectedRowLocal, key) as string;
      const conditionMet = PhoneNumberFormFieldConfigs[key]?.dynamicFieldConditionCheck ? PhoneNumberFormFieldConfigs[key]?.dynamicFieldConditionCheck(formFieldsState.state): true;

      //TODO: What to do if condition is not met? Shouldn't that be invalid?
      if (isInvalidField(key, fieldValue) && conditionMet) {
        formFieldsState.setProperty("error", true);
        isValidForm = false;
      }
    });

    return isValidForm;
  };

  const findFieldValue = (key: string): {value: string, conditionMet: boolean} => {
    return {
      value: PhoneNumberRecordUtil.getPropertyValue(selectedRowLocal, key) as string,
      conditionMet: PhoneNumberFormFieldConfigs[key]?.dynamicFieldConditionCheck ? PhoneNumberFormFieldConfigs[key]?.dynamicFieldConditionCheck(formFieldsState.state): true
    };
  };

  const handleOnSave = async () => {
    if (!await validateFlow()) {
      return;
    }

    if (hasDuplicateCallFlowRecord(dataGridStateCallFlowRecords, selectedRowLocal, phoneNumberDataGridManager.alertBar)) {
      return;
    }

    const updateResults = await SingleCallFlowRecord.update(accessToken, selectedRowLocal);

    if (isErrorDisplayed(updateResults)) {
      return;
    }

    //TODO: Research this further.
    // deleteOppositeRows([originalRow], accessToken);
    formFieldsState.reset();
    openEditModal(false, true, selectedRowLocal, `Phone Number ${PhoneNumberRecordUtil.getPhoneNumber(selectedRow)} has been successfully updated.`, false);
  };

  const isErrorDisplayed = (singleRecordResults: SingleRecordResults<PhoneNumberRecordType>) => {
    if (singleRecordResults?.errors) {
      phoneNumberDataGridManager.alertBar.error(singleRecordResults.errors.map<string>(error => (error.message)).join("; "));

      return true;
    }

    return false;
  };

  const handleClone = () =>{
    openEditModal(false,false,selectedRowLocal,"",false,true);
  };

  const handleOnDelete = async () => {
    const singleRecordResults = await SingleCallFlowRecord.deleteCallFlowRecord(accessToken, selectedRowLocal);
    if (isErrorDisplayed(singleRecordResults)) {
      return;
    }
    if (singleRecordResults) {
      openEditModal(false, true, selectedRowLocal, `Phone Number ${PhoneNumberRecordUtil.getPhoneNumber(selectedRow)} has been successfully deleted.`, true);
    }

    formFieldsState.reset();
  };

  function navigateButtons(display:boolean,key:string) {
    displayState.setProperty(key, display);
  }

  const handleCancel = () => {
    formFieldsState.reset();
    openEditModal(false);
  };

  const handleClose = (flag: boolean) => {
    phoneNumberDataGridManager.alertBar.open = flag;
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    valuePassed?:string,
    keyPassed?:string
  ) => {
    let value: string;
    let key : string;

    if(((valuePassed && typeof valuePassed === "string") || valuePassed === null) && !displayState.state[keyPassed as keyof ViewOrAddBooleanProps]){
      value = valuePassed ?? "";
      key = keyPassed;
    } else{
      value = event.target.value;
      key = event.target.name;
    }

    selectedRowState.state = PhoneNumberRecordUtil.setPropertyValue(selectedRowState.state, key, value);

    formFieldsState.state = {
      [key]: {
        ...formFieldsState.state[key as keyof FormFields],
        value: value,
        error: isInvalidField(key, value)
      }
    } as FormFields;
  };

  return (
    <div>
      <Modal
        isOpen={phoneNumberDataGridManager.dataGrid.isEditModalOpen}
        size="large"
        takeover={["base", "sm", "md", "lg"]}
        className="route-table-modal-wrapper"
        onClose={() => {
          openEditModal(false);
        }}
        id ="modalId"
      >
        <ModalHeader>
          {
            ["Liberty Mutual", "Safeco"].includes(selectedRowLocal?.brand)?
              (<FloatingHeader brand={BrandName[selectedRowLocal?.brand]} overlayIsOpen>
                <HeadingStyled type="h4-light">{`Update Flow Rule ${selectedRow && PhoneNumberRecordUtil.getPhoneNumber(selectedRow)}`}
                </HeadingStyled>
              </FloatingHeader>):
              (
                <HeadingStyled type="h4-light">{`Update Flow Rule ${selectedRow && PhoneNumberRecordUtil.getPhoneNumber(selectedRow)}`}
                </HeadingStyled>
              )
          }
        </ModalHeader>
        <ModalBodyStyled>
          <Grid container rowSpacing={3}>
            {
              Array.from<string>(Object.keys(PhoneNumberFormFieldConfigs)).map((key: string) => {
                const {
                  label, control, required = false, disableEdit, dynamicFieldConditionCheck, fieldType, gridSize = 12
                }: FormFieldConfig = PhoneNumberFormFieldConfigs[key];

                if (dynamicFieldConditionCheck && !dynamicFieldConditionCheck(formFieldsState.state)) {
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
                        value={PhoneNumberRecordUtil.getPropertyValue(selectedRowLocal, key)}
                        error={formFieldsState.state[key as keyof FormFields].error}
                        dropDownOptions={dropDownValues[key as keyof DynamicCallFlowPhoneNumberDropDownList] || []}
                        onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value?:string) => handleInputChange(event,value,key)}
                        required={required}
                        disabled={disableEdit}
                      />
                    </Grid>
                    {(fieldType === "viewAndAdd")?(<Grid item xs={1}>
                      <AddOrViewPhoneNumber navigateViewOrAdd = {navigateButtons} keys = {key}></AddOrViewPhoneNumber>
                    </Grid>):(<div></div>)}
                  </Grid>
                );
              })
            }
          </Grid>
        </ModalBodyStyled>
        <ModalFooterStyled>
          <Button
            variant="contained"
            value="Save"
            color="primary"
            disabled = {enableFlow}
            sx={{ marginRight: 2 }}
            aria-label="saveFlowRuleButton"
            onClick={() => handleOnSave()}
          >
                        Save Rule
          </Button>
          <Button
            variant="contained"
            value="Clone"
            color="primary"
            disabled = {enableFlow}
            sx={{ marginRight: 2 }}
            aria-label="cloneFlowRuleButton"
            onClick={() => handleClone()}
          >
                        Clone Rule
          </Button>
          <Button
            variant="contained"
            color="error"
            value="Delete"
            disabled = {enableFlow }
            sx={{ marginRight: 2 }}
            aria-label="deleteFlowRuleButton"
            onClick={() => handleOnDelete()}
          >
                        Delete Rule
          </Button>
          <Button
            value="Cancel"
            variant="outlined"
            color="primary"
            aria-label="cancelEditFlowButton"
            onClick={() => handleCancel()}
          >
                        Cancel
          </Button>
        </ModalFooterStyled>
      </Modal>
      <CustomToast
        open={phoneNumberDataGridManager.alertBar.open}
        onClose={handleClose}
        msg={phoneNumberDataGridManager.alertBar.msg}
        severityType={phoneNumberDataGridManager.alertBar.severityType}
      />
    </div>
  );
};
