import React, {
  useState,
  useEffect
} from "react";
import {
  Modal, ModalHeader
} from "@lmig/lmds-react-modal";
import {
  Grid, Button
} from "@mui/material";
import {
  initRule,
  flowFields
} from "../FlowFieldsConfig";
import { ComponentControl } from "components/ComponentControl";
import { CustomToast } from "components/CustomToast";
import {
  AddFlowFieldsConfigProps,
  CctSharedCallFlowDb,
  FlowDropDownList,
  FlowKeys,
  FlowMasterData,
  ViewOrAddProps
} from "../../AlohaFlow.Interfaces";
import {
  addFlowRule,
  retrieveFlowData
} from "../../Utils/FlowTableServiceUtil";
import {
  ModalBodyStyled,
  ModalFooterStyled,
  HeadingStyled
} from "../../AlohaFlow.Styles";
import {
  FLOW_MASTER_DATA,
  callFlowName,
  callFlowType,
  checkGreetingMessageRegExp,
  flowDropDownList,
  flowType,
  languageOffer,
  nextActionType,
  tfnRoutingGroup,
  userDestination
} from "utils/flowUtils";
import {
  BrandName,
  cleanErrorMessage,
  initializedAlertBar
} from "utils/configUtils";
import { getGridMasterData } from "../../DataGridFlow/GridMaster";
import {
  AlertBarProps, FormValidationRule
} from "utils/interfaces";
import {
  AzureSPA, DuplicateCheck
} from "globals/interfaces";
import { AddOrView } from "../CustomActionsCommon/AddOrView";
import { FloatingHeader } from "@lmig/lmds-react-floating-header";

export interface AddFlowModalProps {
  isOpen: boolean;
  newId: number;
  openAddModal: (flag: boolean, isSubmitted?: boolean, row?:CctSharedCallFlowDb) => void;
  cloneType?: boolean;
  flowRuleCloned?: FormValidationRule;
  duplicateCheck?: (params: FormValidationRule) => DuplicateCheck
}

export const AddFlow = ({
  accessToken, isOpen = false, openAddModal, cloneType, flowRuleCloned, duplicateCheck
}: AddFlowModalProps & AzureSPA):JSX.Element => {

  const [flowRule, setFlowRule] = useState({ ...initRule });
  const [dropDownValues, setDropDownValues] = useState(flowDropDownList);
  const [alertBar, setAlertBar] = useState(initializedAlertBar);
  const [displayRecords, setDisplayRecords] = useState({
    callerType: false,
    dataRequests: false,
    callFlowRoute: false
  });
  useEffect(() => {
    async function fetchData() {
      const masterData: string = localStorage.getItem(FLOW_MASTER_DATA);
      let masterDataObject: FlowMasterData;
      if (masterData !== undefined && masterData !== null) {
        masterDataObject = JSON.parse(masterData);
      } else {
        await retrieveFlowData(accessToken,1, null, getGridMasterData);
        masterDataObject = getGridMasterData();
      }
      setDropDownValues((dropDownValuesProps: FlowDropDownList) => ({
        ...dropDownValuesProps,
        brand: masterDataObject.brand,
        channel: masterDataObject.channel,
        languageOffer,
        userDestination,
        callFlowName: callFlowName,
        callFlowRoute: masterDataObject?.callFlowRoute,
        callFlowType: callFlowType,
        callerType: masterDataObject?.callerType,
        nextActionType: nextActionType,
        dataRequests: masterDataObject?.dataRequests,
        tfnRoutingGroup,
        phoneNumberType: flowType
      }));
    }
    fetchData();
    setDisplayRecords({
      callerType: false,
      dataRequests: false,
      callFlowRoute: false
    });
  }, []);

  useEffect(()=>{
    setFlowRule((rule: FormValidationRule) => ({
      ...rule
    }));
    if(cloneType) {
      setFlowRule({ ...flowRuleCloned });
    }
  },[openAddModal]);

  const handleClose = (flag: boolean) => {
    setAlertBar((alertBarProps: AlertBarProps) => ({
      ...alertBarProps,
      "open": flag
    }));
  };

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,valuePassed?:string,key?:string) {
    let value: string;
    if(valuePassed && typeof(valuePassed) === "string" && !displayRecords[key as keyof ViewOrAddProps]){
      value = valuePassed;
    } else{
      value = event.target.value;
    }
    value = (key === "pkey" && !value.startsWith("+")) ? `+1${value}` : value;
    const newFlowRule: FormValidationRule = {
      [key]: {
        ...flowRule[key],
        value,
        error: isInvalidField(key, value)
      }
    };

    setFlowRule((rule: FormValidationRule) => ({
      ...rule,
      ...newFlowRule
    }));
  }

  const isInvalidField =(key: string, value: string): boolean =>{
    if(key === "greetingMessages"){
      return checkGreetingMessageRegExp(value);
    }
    return flowRule[key].required && [undefined, "", null].includes(value);
  };
  const findFieldValue = (key: string): boolean => {
    let fieldCondition = true;
    flowFields.map((value: AddFlowFieldsConfigProps) => {
      if (value.key === key && value.dynamicFieldConditionCheck) {
        fieldCondition = value.dynamicFieldConditionCheck(flowRule);
      }
    });
    return fieldCondition;
  };

  function validateRoute() {
    let isValidForm = true;
    Object.keys(flowRule).map((key: string) => {
      const condition = findFieldValue(key);
      if (isInvalidField(key, flowRule[key].value) && condition) {
        const newFlowRule = {
          [key]: {
            ...flowRule[key],
            error: true
          }
        };
        isValidForm = false;
        setFlowRule((rule: FormValidationRule) => ({
          ...rule,
          ...newFlowRule
        }));
      }
      return true;
    });
    return isValidForm;
  }

  function resetFlowRule() {
    setFlowRule({ ...initRule });
    openAddModal(false);
  }
  function stringValue(obj: {[index: string]:any}, prop: string, defaultValue: string) {
    if(obj[prop].value) {
      return obj[prop].value;
    }
    return defaultValue;
  }

  function navigateBtns(display:boolean,key:string) {
    setDisplayRecords((records:ViewOrAddProps) => ({
      ...records,
      [key]: display
    }));
  }

  function handleOnCreateRoute() {
    const isValidForm: boolean = validateRoute();
    if (isValidForm) {
      const curTime = new Date().toISOString();
      const dataRequests = (flowRule?.dataRequests?.value as string)
        ?.split(",")
        ?.map(a => a.trim())
        ?.filter(a => a.length > 0);
      const {
        isDuplicate, message
      } = duplicateCheck(flowRule);
      if(isDuplicate){
        setAlertBar((alertBarProps: AlertBarProps) => ({
          ...alertBarProps,
          "open": true,
          "severityType": "error",
          "msg": message
        }));
        return;
      }
      addFlowRule(flowRule, accessToken, curTime, dataRequests).then(apiResponse => {
        if (!apiResponse.errors) {
          const newFlowRule: CctSharedCallFlowDb = {
            pkey: flowRule.pkey.value,
            content: {
              callFlowRoute: stringValue(flowRule,"callFlowRoute", ""),
              callIntent: stringValue(flowRule, "callIntent", ""),
              callerType: stringValue(flowRule,"callerType", ""),
              dataRequests: dataRequests,
              greetingMessages: stringValue(flowRule,"greetingMessages", ""),
              languageOffer: stringValue(flowRule,"languageOffer", ""),
              officeNumbers: stringValue(flowRule,"officeNumbers", ""),
              transferDestination: stringValue(flowRule,"transferDestination", "")
            },
            accountManager: stringValue(flowRule,"accountManager", ""),
            affinityVDN: stringValue(flowRule,"affinityVDN", ""),
            brand: flowRule.brand.value,
            callDetails1: stringValue(flowRule,"callDetails1", ""),
            callDetails2: stringValue(flowRule,"callDetails2", ""),
            callFlowName: stringValue(flowRule,"callFlowName", ""),
            callFlowTemplate: stringValue(flowRule,"callFlowTemplate", ""),
            callFlowType: stringValue(flowRule,"callFlowType", ""),
            callTypeDescription: stringValue(flowRule,"callTypeDescription", ""),
            channel: flowRule.channel.value,
            createTime: curTime,
            dialedDescription: flowRule.dialedDescription.value,
            employeeId: stringValue(flowRule,"employeeId", ""),
            internetPlacement: stringValue(flowRule,"internetPlacement", ""),
            lineOfBusiness: stringValue(flowRule,"lineOfBusiness", ""),
            marketingChannel: stringValue(flowRule,"marketingChannel", ""),
            nextActionId: flowRule.nextActionId.value ?? "",
            nextActionType: flowRule.nextActionType.value ?? "",
            predictiveCaller: flowRule.predictiveCaller.value ?? false,
            rangeIndicator: stringValue(flowRule,"rangeIndicator", ""),
            requestID: stringValue(flowRule,"requestID", ""),
            tfnRoutingGroup: stringValue(flowRule,"tfnRoutingGroup", ""),
            transferCode: stringValue(flowRule,"transferCode", ""),
            phoneNumberType: flowRule?.phoneNumberType?.value ?? "",
            userDestination: flowRule.userDestination.value ?? "",
            whisper: stringValue(flowRule,"whisper", "")
          };
          openAddModal(false, true, newFlowRule);
          setAlertBar((alertBarProps: AlertBarProps) => ({
            ...alertBarProps,
            open: true,
            severityType: "success",
            msg: "New flow has been successfully added. "
          }));
          setFlowRule({ ...initRule });
          return true;
        }
        setAlertBar((alertBarProps: AlertBarProps) => ({
          ...alertBarProps,
          "open": true,
          "severityType": "error",
          "msg": cleanErrorMessage(apiResponse.errors)
        }));
        return false;
      });
    }
  }

  return (
    <div>
      <Modal
        size="large"
        className="route-table-modal-wrapper"
        takeover={["base", "sm", "md", "lg"]}
        isOpen={isOpen}
        onClose={() => {
          resetFlowRule();
        }}
      ><ModalHeader>
          {
            ["Liberty Mutual", "Safeco"].includes(flowRule?.brand?.value)?
              (<FloatingHeader brand={BrandName[flowRule?.brand?.value]} overlayIsOpen>
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
              flowFields.map(({
                label, key, control, required = false, fieldType, gridSize = 12, dynamicFieldConditionCheck
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
                        value={flowRule[key as keyof FlowKeys].value}
                        error={flowRule[key as keyof FlowKeys].error}
                        dropDownOptions={dropDownValues[key as keyof FlowDropDownList] || []}
                        onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value?:string) => handleInputChange(event,value,key)}
                        required={required}
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
        <ModalFooterStyled >
          <Button
            type="submit"
            value="Save"
            variant="contained"
            color="primary"
            sx={{ marginRight: 2 }}
            aria-label = "createRuleButton"
            onClick={() => handleOnCreateRoute()}
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
        open={alertBar.open}
        onClose={handleClose}
        msg={alertBar.msg}
        severityType={alertBar.severityType}
      />
    </div>
  );
};



