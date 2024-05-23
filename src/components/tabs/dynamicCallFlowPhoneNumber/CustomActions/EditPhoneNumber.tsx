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
import {
  HeadingStyled, ModalBodyStyled, ModalFooterStyled
} from "../DynamicCallFlowPhoneNumber.Styles";
import {
  DynamicCallFlowPhoneNumberDropDownList,
  DynamicCallFlowPhoneNumberMasterData
} from "../DynamicCallFlowPhoneNumber.Interfaces";
import {
  PhoneNumberFormFieldConfigs
} from "../Field/LegacyPhoneNumberFieldsConfig";
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
import { FormFieldViewListIconVisibilityState } from "./FormFieldViewListIconVisibility.Manager";
import { SingleCallFlowRecord } from "../GraphQL/Util/SinglePhoneNumberRecord.Util";
import { GREETING_MESSAGES } from "../Field/DynamicPhoneNumberFields";
import { ObjectState } from "../../../../common/StateManager/ObjectState.Manager";
import {
  ControlEnum, FormFieldConfig,
  FormFields
} from "../../../../common/FormField/FormField.Interfaces";
import { FormFieldsState } from "../../../../common/FormField/FormFieldsState.Manager";
import { PhoneNumberDataGridManager } from "../DataGrid/PhoneNumberDataGrid.Manager";
import { deleteOppositeRows } from "../../alohaFlow/Utils/FlowTableServiceUtil";
import {
  FormFieldViewListIconVisibility,
  ToggleAddOrViewListIcon
} from "./ToggleAddOrViewListIcon";

interface EditFlowComponentProps {
  phoneNumberDataGridManager: PhoneNumberDataGridManager,
  openEditModal: (flag: boolean, isSubmitted?: boolean, phoneNumberRecord?: PhoneNumberRecordType, message?: string, deleteRow?: boolean, isClonedFlowRule?: boolean) => void;
  dataGridStateCallFlowRecords?: Array<PhoneNumberRecordType>;
}

const initialControlToggleFormFieldsState = {
  callerType: false,
  dataRequests: false,
  callFlowRoute: false
};

//TODO: JSX is deprecated, need to research other option
export const EditPhoneNumber = ({
  phoneNumberDataGridManager, accessToken, matchedGroups, openEditModal, dataGridStateCallFlowRecords
}: EditFlowComponentProps & AzureSPA): JSX.Element => {

  const formFieldViewListIconVisibility = new FormFieldViewListIconVisibilityState(initialControlToggleFormFieldsState);
  const formFields = new FormFieldsState(PhoneNumberFormFieldConfigs);
  const selectedRowLocal = new ObjectState<PhoneNumberRecordType>();

  const [dropDownValues, setDropDownValues] = useState(flowDropDownList);
  const enableFlow = useMemo<boolean>(() => readWriteAccess(matchedGroups,"dynamic-call-flow"), []);
  const originalRow = phoneNumberDataGridManager.dataGrid.state.selectedRow ? JSON.parse(JSON.stringify(phoneNumberDataGridManager.dataGrid.state.selectedRow)) : undefined;

  useEffect(() => {
    selectedRowLocal.state = phoneNumberDataGridManager.dataGrid.state.selectedRow;

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
      formFields.reset();
    }

  }, [phoneNumberDataGridManager.dataGrid.state.selectedRow]);

  const isInvalidField =(key: string, value: string): boolean =>{
    if(key === GREETING_MESSAGES){
      return checkGreetingMessageRegExp(value);
    }
    return formFields.state[key].required && [undefined, "", null, "null"].includes(value);
  };

  // const isInvalid = (formValidation: FormValidationProps): boolean => {
  //
  // }

  const validateFlow = async (): Promise<boolean> => {
    let isValidForm = true;

    Object.keys(formFields.state).forEach(key => {
      const fieldValue = PhoneNumberRecordUtil.getPropertyValue(selectedRowLocal.state, key) as string;
      const conditionMet = PhoneNumberFormFieldConfigs[key]?.dynamicFieldConditionCheck ? PhoneNumberFormFieldConfigs[key]?.dynamicFieldConditionCheck(formFields.state): true;

      //TODO: What to do if condition is not met? Shouldn't that be invalid?
      if (isInvalidField(key, fieldValue) && conditionMet) {
        formFields.setProperty("error", true);
        isValidForm = false;
      }
    });

    return isValidForm;
  };

  const findFieldValue = (key: string): {value: string, conditionMet: boolean} => {
    return {
      value: PhoneNumberRecordUtil.getPropertyValue(selectedRowLocal.state, key) as string,
      conditionMet: PhoneNumberFormFieldConfigs[key]?.dynamicFieldConditionCheck ? PhoneNumberFormFieldConfigs[key]?.dynamicFieldConditionCheck(formFields.state): true
    };
  };

  const handleOnSave = async () => {
    if (!await validateFlow()) {
      return;
    }

    if (hasDuplicateCallFlowRecord(dataGridStateCallFlowRecords, selectedRowLocal.state, phoneNumberDataGridManager.alertBar)) {
      return;
    }

    const updateResults = await SingleCallFlowRecord.update(accessToken, selectedRowLocal.state);

    if (isErrorDisplayed(updateResults)) {
      return;
    }

    // TODO: Research this further.
    deleteOppositeRows([originalRow], accessToken);
    formFields.reset();
    openEditModal(false, true, selectedRowLocal.state, `Phone Number ${PhoneNumberRecordUtil.getPhoneNumber(phoneNumberDataGridManager.dataGrid.state.selectedRow)} has been successfully updated.`, false);
  };

  const isErrorDisplayed = (singleRecordResults: SingleRecordResults<PhoneNumberRecordType>) => {
    if (singleRecordResults?.errors) {
      phoneNumberDataGridManager.alertBar.error(singleRecordResults.errors.map<string>(error => (error.message)).join("; "));

      return true;
    }

    return false;
  };

  const handleClone = () =>{
    openEditModal(false,false,selectedRowLocal.state,"",false,true);
  };

  const handleOnDelete = async () => {
    const singleRecordResults = await SingleCallFlowRecord.deleteCallFlowRecord(accessToken, selectedRowLocal.state);
    if (isErrorDisplayed(singleRecordResults)) {
      return;
    }
    if (singleRecordResults) {
      openEditModal(false, true, selectedRowLocal.state, `Phone Number ${PhoneNumberRecordUtil.getPhoneNumber(phoneNumberDataGridManager.dataGrid.state.selectedRow)} has been successfully deleted.`, true);
    }

    formFields.reset();
  };

  function setFormFieldViewListIconVisibility(key: string, visible: boolean) {
    formFieldViewListIconVisibility.setProperty(key, visible);
  }

  const handleCancel = () => {
    formFields.reset();
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

    if(((valuePassed && typeof valuePassed === "string") || valuePassed === null) && !formFieldViewListIconVisibility.state[keyPassed]){
      value = valuePassed ?? "";
      key = keyPassed;
    } else{
      value = event.target.value;
      key = event.target.name;
    }

    selectedRowLocal.state = PhoneNumberRecordUtil.setPropertyValue(selectedRowLocal.state, key, value);

    formFields.state = {
      [key]: {
        ...formFields.state[key as keyof FormFields],
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
            ["Liberty Mutual", "Safeco"].includes(selectedRowLocal.state?.brand)?
              (<FloatingHeader brand={BrandName[selectedRowLocal.state?.brand]} overlayIsOpen>
                <HeadingStyled type="h4-light">{`Update Flow Rule ${phoneNumberDataGridManager.dataGrid.selectedRow && PhoneNumberRecordUtil.getPhoneNumber(phoneNumberDataGridManager.dataGrid.selectedRow)}`}
                </HeadingStyled>
              </FloatingHeader>):
              (
                <HeadingStyled type="h4-light">{`Update Flow Rule ${phoneNumberDataGridManager.dataGrid.selectedRow && PhoneNumberRecordUtil.getPhoneNumber(phoneNumberDataGridManager.dataGrid.selectedRow)}`}
                </HeadingStyled>
              )
          }
        </ModalHeader>
        <ModalBodyStyled>
          <Grid container rowSpacing={3}>
            {
              Array.from<string>(Object.keys(PhoneNumberFormFieldConfigs)).map((key: string) => {
                const {
                  label, control, required = false, disableEdit, dynamicFieldConditionCheck, isUserAbleToSwitchToInputControl, gridSize = 12
                }: FormFieldConfig = PhoneNumberFormFieldConfigs[key];

                if (dynamicFieldConditionCheck && !dynamicFieldConditionCheck(formFields.state)) {
                  return;
                }

                return (
                  <Grid container key = {key} item xs = {4}>
                    <Grid key = {key} item xs = {gridSize}>
                      <ComponentControl
                        control={isUserAbleToSwitchToInputControl && formFieldViewListIconVisibility.state[key] ? ControlEnum.Input : control}
                        name={key}
                        label={label}
                        type="text"
                        value={PhoneNumberRecordUtil.getPropertyValue(selectedRowLocal.state, key)}
                        error={formFields.state[key as keyof FormFields].error}
                        dropDownOptions={dropDownValues[key as keyof DynamicCallFlowPhoneNumberDropDownList] || []}
                        onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value?:string) => handleInputChange(event,value,key)}
                        required={required}
                        disabled={disableEdit}
                      />
                    </Grid>
                    {(isUserAbleToSwitchToInputControl)?(<Grid item xs={1}>
                      <ToggleAddOrViewListIcon key = {key} setFormFieldViewListIconVisibility = {setFormFieldViewListIconVisibility} ></ToggleAddOrViewListIcon>
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
