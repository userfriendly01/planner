
import React, {
  useState, useEffect, useMemo
} from "react";
import {
  Modal, ModalHeader
} from "@lmig/lmds-react-modal";
import {
  FloatingHeader
} from "@lmig/lmds-react-floating-header";
import {
  Button,
  Grid
} from "@mui/material";
import { AddOrView } from "../CustomActionsCommon/AddOrView";
import {
  HeadingStyled, ModalBodyStyled, ModalFooterStyled
} from "../../AlohaFlow.Styles";
import {
  AddFlowFieldsConfigProps,
  CctSharedCallFlowDb,
  FlowDropDownList,
  FlowKeys,
  FlowMasterData,
  ViewOrAddProps
} from "../../AlohaFlow.Interfaces";
import {
  flowFields, initRule
} from "../FlowFieldsConfig";
import {
  CustomToast
} from "components";
import {
  flowDropDownList,
  FLOW_MASTER_DATA,
  initializedAlertBar,
  languageOffer,
  userDestination,
  flowType,
  checkGreetingMessageRegExp,
  readWriteAccess,
  tfnRoutingGroup,
  BrandName
} from "utils";
import ComponentControl from "components/core/SharedComponents/ComponentControl";
import {
  AlertBarProps, FormValidationRule
} from "utils/interfaces";
import {
  deleteFlowRule, updateFlowDB
} from "services";
import {
  AzureSPA, DuplicateCheck
} from "globals";

interface EditFlowComponentProps {
    isOpen: boolean;
    selectedRow: CctSharedCallFlowDb;
    openEditModal: (flag: boolean, isSubmitted?: boolean, row?: CctSharedCallFlowDb, message?: string, deleteRow?: boolean, isClonedFlowRule?: boolean) => void;
    duplicateCheck: (params: CctSharedCallFlowDb) => DuplicateCheck
}

export const EditFlow = ({
  accessToken, matchedGroups, isOpen, selectedRow, openEditModal, duplicateCheck
}: EditFlowComponentProps & AzureSPA): JSX.Element => {


  const [selectedRowLocal, setSelectedRowLocal] = useState({} as CctSharedCallFlowDb);
  const [displayRecords, setDisplayRecords] = useState({
    callerType: false,
    dataRequests: false,
    callFlowRoute: false
  });
  const [flowRule, setFlowRule] = useState({ ...initRule });
  const [dropDownValues, setDropDownValues] = useState(flowDropDownList);
  const [alertBar, setAlertBar] = useState(initializedAlertBar);
  const enableFlow = useMemo<boolean>(() => readWriteAccess(matchedGroups,"aloha-flow"), []);

  useEffect(() => {
    setSelectedRowLocal(selectedRow);
    setDisplayRecords({
      callerType: false,
      dataRequests: false,
      callFlowRoute: false
    });
    const masterDataStorage: string = localStorage.getItem(FLOW_MASTER_DATA);
    const masterData: FlowMasterData = JSON.parse(masterDataStorage);
    setDropDownValues((dropDownOptions: FlowDropDownList) => (
      {
        ...dropDownOptions,
        brand: masterData?.brand,
        channel: masterData?.channel,
        languageOffer: languageOffer,
        userDestination: userDestination,
        callFlowRoute: masterData?.callFlowRoute,
        callerType: masterData?.callerType,
        dataRequests: masterData?.dataRequests,
        tfnRoutingGroup: tfnRoutingGroup,
        type: flowType
      })
    );
    if(isOpen){
      initializeFlowRule(selectedRow);
    }

  }, [selectedRow]);

  const isInvalidField =(key: string, value: string): boolean =>{
    if(key === "greetingMessages"){
      return checkGreetingMessageRegExp(value);
    }
    return flowRule[key].required && [undefined, "", null, "null"].includes(value);
  };

  const initializeFlowRule = (data: CctSharedCallFlowDb) =>{
    const flowInitRule: FormValidationRule = flowFields.reduce((a: FormValidationRule, v: AddFlowFieldsConfigProps) => ({
      ...a,
      [v.key]: {
        error: false,
        value: v.valueGetter(data),
        required: v.required || false
      }
    }), {});
    setFlowRule({ ...flowInitRule });
  };

  const validateFlow = async (): Promise<boolean> => {
    let isValidForm = true;
    Object.keys(flowRule).map(key => {
      const fieldValue: {value: string, condition: boolean} = findFieldValue(key);
      if (isInvalidField(key, fieldValue.value) && fieldValue.condition) {
        const newFlowRule: FormValidationRule = {
          [key]: {
            ...flowRule[key],
            error: true
          }
        };
        isValidForm = false;
        setFlowRule(flowRule => ({
          ...flowRule,
          ...newFlowRule
        }));
      }
      return true;
    });
    return isValidForm;
  };

  const findFieldValue = (key: string): {value: string, condition: boolean} => {
    let fieldValue = "";
    let fieldCondition = true;
    flowFields.map((value: AddFlowFieldsConfigProps) => {
      if (value.key === key) {
        fieldValue = value.valueGetter(selectedRowLocal);
        fieldCondition = value.dynamicFieldConditionCheck? value.dynamicFieldConditionCheck(flowRule): true;
      }
    });
    return {
      value: fieldValue,
      condition: fieldCondition
    };
  };

  const handleOnSave = async () => {
    const isValidForm = await validateFlow();
    if (isValidForm) {
      const {
        isDuplicate, message
      } = duplicateCheck(selectedRowLocal);
      if(isDuplicate){
        setAlertBar((alertBarProps: AlertBarProps) => ({
          ...alertBarProps,
          "open": true,
          "severityType": "error",
          "msg": message
        }));
        return;
      }
      const response = await updateFlowDB(selectedRowLocal, accessToken);
      let isSubmitted = true;
      if (response?.errors) {
        isSubmitted = false;
        setAlertBar((alertBarProps: AlertBarProps) => ({
          ...alertBarProps,
          open: true,
          msg: response.errors[0]?.message,
          severityType: "error"
        }));
        return;
      }
      setFlowRule({ ...initRule });
      openEditModal(false, isSubmitted, selectedRowLocal, `Phone Number ${selectedRow.pkey} has been successfully updated.`, false);
    }
  };

  const handleClone = () =>{
    openEditModal(false,false,selectedRowLocal,"",false,true);
  };

  const handleOnDelete = async () => {
    const response = await deleteFlowRule(selectedRowLocal, accessToken);
    if (response) {
      openEditModal(false, true, selectedRowLocal, `Phone Number ${selectedRow.pkey} has been successfully deleted.`, true);
    }
    setFlowRule({ ...initRule });
  };

  function navigateBtns(display:boolean,key:string) {
    setDisplayRecords((records:ViewOrAddProps) => ({
      ...records,
      [key]: display
    }));
  }

  const handleCancel = () => {
    setFlowRule({ ...initRule });
    openEditModal(false);
  };

  const handleClose = (flag: boolean) => {
    setAlertBar((alertBarProps: AlertBarProps) => ({
      ...alertBarProps,
      "open": flag
    }));
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => CctSharedCallFlowDb,
    valuePassed?:string, keyPassed?:string
  ) => {
    let value: string;
    let key : string;
    if(valuePassed && typeof valuePassed === "string" && !displayRecords[key as keyof ViewOrAddProps]){
      value = valuePassed;
      key = keyPassed;
    } else{
      value = event.target.value;
      key = event.target.name;
    }
    const updatedSelectedValue: CctSharedCallFlowDb = valueSetter(selectedRowLocal, { [key]: value });
    setSelectedRowLocal(updatedSelectedValue);
    const newFlowRule: FormValidationRule = {
      [key]: {
        ...flowRule[key],
        value: value,
        error: isInvalidField(key, value)
      }
    };

    setFlowRule((rule: FormValidationRule) => ({
      ...rule,
      ...newFlowRule
    }));
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
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
                <HeadingStyled type="h4-light">{`Update Flow Rule ${selectedRow && selectedRow.pkey}`}
                </HeadingStyled>
              </FloatingHeader>):
              (
                <HeadingStyled type="h4-light">{`Update Flow Rule ${selectedRow && selectedRow.pkey}`}
                </HeadingStyled>
              )
          }
        </ModalHeader>
        <ModalBodyStyled>
          <Grid container rowSpacing={3}>
            {
              flowFields.map(({
                label, key, control, required = false, disableEdit, valueGetter, valueSetter, dynamicFieldConditionCheck,fieldType, gridSize = 12
              }) => {
                if(dynamicFieldConditionCheck && !dynamicFieldConditionCheck(flowRule)){
                  return;
                }
                if(fieldType &&displayRecords[key as keyof ViewOrAddProps] ) {
                  control = "input";
                }
                return (
                  <Grid container key = {key} item xs = {4}>
                    <Grid key = {key} item xs = {gridSize}>
                      <ComponentControl
                        control={control}
                        name={key}
                        label={label}
                        type="text"
                        value={valueGetter(selectedRowLocal)}
                        error={flowRule[key as keyof FlowKeys].error}
                        dropDownOptions={dropDownValues[key as keyof FlowDropDownList] || []}
                        onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value?:string) => handleInputChange(event,valueSetter,value,key)}
                        required={required}
                        disabled={disableEdit}
                      />
                    </Grid>
                    {(fieldType === "viewAndAdd")?(<Grid item xs={1}>
                      <AddOrView navigateViewOrAdd = {navigateBtns} keys = {key}></AddOrView>
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
        open={alertBar.open}
        onClose={handleClose}
        msg={alertBar.msg}
        severityType={alertBar.severityType}
      />
    </div>
  );
};
