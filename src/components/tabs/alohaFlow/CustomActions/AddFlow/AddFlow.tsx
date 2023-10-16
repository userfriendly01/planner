/* eslint-disable react/prop-types */

import React, {
  useState,
  useEffect
} from "react";
import {
  Modal,
  ModalHeader
} from "@lmig/lmds-react-modal";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {
  initRule,
  flowFields
} from "../FlowFieldsConfig";
import {
  ComponentControl, CustomToast
} from "components";
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
} from "services";
import {
  ModalBodyStyled,
  ModalFooterStyled,
  HeadingStyled
} from "../../AlohaFlow.Styles";
import {
  cleanErrorMessage,
  flowDropDownList,
  FLOW_MASTER_DATA,
  getGraphQLEndpoint,
  initializedAlertBar,
  languageOffer,
  userDestination,
  flowType,
  checkGreetingMessageRegExp
} from "utils";
import { getGridMasterData } from "../../DataGridFlow/GridMaster";
import {
  AlertBarProps, FormValidationRule
} from "utils/interfaces";
import {
  AzureSPA, DuplicateCheck
} from "globals";
import { AddOrView } from "../CustomActionsCommon/AddOrView";
export interface AddFlowModalProps {
  isOpen: boolean;
  newId: number;
  openAddModal: (flag: boolean, isSubmitted?: boolean, row?:CctSharedCallFlowDb) => void;
  cloneType?: boolean;
  flowRuleCloned?: FormValidationRule;
  duplicateCheck?: (params: FormValidationRule) => DuplicateCheck
}

export const AddFlow = ({
  accessToken, matchedGroups, isOpen = false, newId, openAddModal, cloneType, flowRuleCloned, duplicateCheck
}: AddFlowModalProps & AzureSPA):JSX.Element => {

  const graphQlApiUrl: string = getGraphQLEndpoint();
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
        const result: CctSharedCallFlowDb[] = await retrieveFlowData(accessToken, graphQlApiUrl,{});
        masterDataObject = getGridMasterData(result);
      }
      setDropDownValues((dropDownValuesProps: FlowDropDownList) => ({
        ...dropDownValuesProps,
        brand: masterDataObject.brand,
        channel: masterDataObject.channel,
        languageOffer: languageOffer,
        userDestination: userDestination,
        callFlowRoute: masterDataObject?.callFlowRoute,
        callerType: masterDataObject?.callerType,
        dataRequests: masterDataObject?.dataRequests,
        type: flowType
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
      addFlowRule(flowRule, accessToken, graphQlApiUrl, curTime, dataRequests).then(apiResponse => {
        if (!apiResponse.errors) {
          const newFlowRule: CctSharedCallFlowDb = {
            pkey: flowRule.pkey.value,
            content: {
              callIntent: stringValue(flowRule, "callIntent", ""),
              callFlowRoute: stringValue(flowRule,"callFlowRoute", ""),
              callerType: stringValue(flowRule,"callerType", ""),
              greetingMessages: stringValue(flowRule,"greetingMessages", ""),
              transferNumber: stringValue(flowRule,"transferNumber", ""),
              languageOffer: stringValue(flowRule,"languageOffer", ""),
              dataRequests: dataRequests,
              officeNumbers: stringValue(flowRule,"officeNumbers", "")
            },
            createTime: curTime,
            agentId: stringValue(flowRule,"agentId", ""),
            brand: flowRule.brand.value,
            callFlowTemplate: stringValue(flowRule,"callFlowTemplate", ""),
            channel: flowRule.channel.value,
            dialedDescription: flowRule.dialedDescription.value,
            employeeId: stringValue(flowRule,"employeeId", ""),
            accountManager: stringValue(flowRule,"accountManager", ""),
            affinityVDN: stringValue(flowRule,"affinityVDN", ""),
            callTypeDescription: stringValue(flowRule,"callTypeDescription", ""),
            transferCode: stringValue(flowRule,"transferCode", ""),
            internetPlacement: stringValue(flowRule,"internetPlacement", ""),
            callDetails1: stringValue(flowRule,"callDetails1", ""),
            callDetails2: stringValue(flowRule,"callDetails2", ""),
            lineOfBusiness: stringValue(flowRule,"lineOfBusiness", ""),
            marketingChannel: stringValue(flowRule,"marketingChannel", ""),
            tollFreeNumber: stringValue(flowRule,"tollFreeNumber", ""),
            whisper: stringValue(flowRule,"whisper", ""),
            requestID: stringValue(flowRule,"requestID", ""),
            userDestination: flowRule.userDestination.value || "",
            rangeIndicator: stringValue(flowRule,"rangeIndicator", ""),
            type: flowRule.type.value || ""
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
      >
        <ModalHeader><HeadingStyled type="h4-light">Add Flow Rule</HeadingStyled></ModalHeader>
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



