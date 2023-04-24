import React, {
  useState, useEffect
} from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {
  Modal, ModalHeader
} from "@lmig/lmds-react-modal";
import {
  routingDropDownList, routingInitRule, routingFields, initializedAlertBar, getGraphQLEndpoint, convertTime24to12
} from "utils";
import { getGridMasterData } from "../../DataGridRouting/GridMaster";
import {
  retrieveRoutingData, addRoutingRule
} from "services";
import {
  CctSharedCallRoutingDb, RoutingMasterData, RoutingDropDownList, AddRoutingModalProps
} from "../../AlohaRouting.Interfaces";
import {
  RoutingModalBodyStyled, RoutingModalFooterStyled, RoutingHeadingStyled
} from "../../AlohaRouting.Styles";
import {
  CustomToast, ComponentControl
} from "components";
import { FormValidationRule } from "utils/interfaces";
import { AzureSPA } from "globals";


export const AddRouting = (props: AddRoutingModalProps & AzureSPA): JSX.Element => {
  const {
    accessToken,
    isOpen = false,
    matchedGroups,
    newId,
    openModal,
    cloneRouteRule,
    routeRule
  } = props;

  const [routingRule, setRoutingRule] = useState({ ...routingInitRule });
  const [dropDownValues, setDropDownValues] = useState(routingDropDownList);
  const [alertBar, setAlertBar] = useState(initializedAlertBar);

  const graphQlApiUrl: string = getGraphQLEndpoint();

  const masterDataValues = async (): Promise<RoutingDropDownList> => {
    let masterData: RoutingMasterData;
    const cachedMasterData: string | undefined = localStorage.getItem("ROUTING_MASTER_DATA");
    if (cachedMasterData !== undefined && cachedMasterData !== null) {
      masterData = JSON.parse(cachedMasterData);
    } else {
      const result: CctSharedCallRoutingDb[] = await retrieveRoutingData(accessToken, graphQlApiUrl);
      masterData = getGridMasterData(result);
    }
    routingDropDownList.brand = masterData.brand;
    routingDropDownList.channel = masterData.channel;
    routingDropDownList.policyType = masterData.policyType;
    return routingDropDownList;
  };

  const resetRoutingRule = () => {
    setRoutingRule({ ...routingInitRule });
    openModal(false,false);
  };

  useEffect(() => {
    masterDataValues().then((masterData: RoutingDropDownList) => {
      setDropDownValues(masterData);
    });
  }, []);
  useEffect(()=>{
    if(cloneRouteRule) {
      setRoutingRule({ ...routeRule });
    } else{
      const newRoutingRule :FormValidationRule= {
        "id": {
          value: newId.toString()
        }
      };
      setRoutingRule(rule => ({
        ...rule,
        ...newRoutingRule
      }));
    }
  },[openModal]);

  const isInvalidField = (key: string, value: string):boolean =>{
    return routingRule[key].required && [undefined, "", null].includes(value);
  };
  const validateRoute = () => {
    let isValidForm = true;
    Object.keys(routingRule).map(key => {
      if (isInvalidField(key, routingRule[key].value)) {
        const newRoutingRule = {
          [key]: {
            ...routingRule[key],
            error: true
          }
        };
        isValidForm = false;
        setRoutingRule(rule => ({
          ...rule,
          ...newRoutingRule
        }));
      }
      return true;
    });
    return isValidForm;
  };

  const handleOnCreateRoute = () => {
    const isValidForm = validateRoute();
    if (isValidForm) {
      routingRule["startTime"].value = convertTime24to12(routingRule["startTime"].value);
      routingRule["endTime"].value = convertTime24to12(routingRule["endTime"].value);
      addRoutingRule(routingRule, accessToken, graphQlApiUrl).then(apiResponse => {
        if (!apiResponse.errors) {
          const newRoutingRule: CctSharedCallRoutingDb = {
            id: Number(routingRule.id.value),
            pkey: routingRule.pkey.value,
            skey: routingRule.skey.value,
            all: "ALL",
            brand: routingRule.brand.value,
            callerState: routingRule.callerState.value,
            callerType: routingRule.callerType.value,
            callIntent: routingRule.callIntent.value,
            channel: routingRule.channel.value,
            crcSkill: routingRule.crcSkill.value,
            dayOfWeek: routingRule.dayOfWeek.value,
            endTime: routingRule.endTime.value,
            occupancyCheck: routingRule.occupancyCheck.value,
            percentOfCallers: routingRule.percentOfCallers.value,
            policyType: routingRule.policyType.value,
            priority: routingRule.priority.value,
            routingSteps: routingRule.routingSteps.value,
            startTime: routingRule.startTime.value,
            transferDestination: routingRule.transferDestination.value,
            transferMessage: routingRule.transferMessage.value,
            twilioSkill: routingRule.twilioSkill.value
          };
          openModal(false,false, newRoutingRule);
          setRoutingRule({ ...routingInitRule });
          setAlertBar(alertBarProps => ({
            ...alertBarProps,
            "open": true,
            "severityType": "success",
            "msg": "New Routing Rule has been successfully added!!"
          }));
          return true;
        }
        setAlertBar(alertBarProps => ({
          ...alertBarProps,
          "open": true,
          "severityType": "error",
          "msg": apiResponse.errors[0].message
        }));
      });
    }
    return false;
  };

  const TimeEvaluator = (event: any, keyType: string): string => {
    const timePicked = new Date(event.$d.toString());
    timePicked.setSeconds(0);
    if (keyType === "endTime") {
      timePicked.setSeconds(timePicked.getSeconds() - 1);
    }
    return timePicked.toLocaleString();
  };

  const removeAllWhiteSpace = (value: string): string => {
    return value.split(" ").join("");
  };

  const handleInputChange = (event: any, key: string, disableEdit: boolean) => {
    let value: string;
    let skey: string;
    if (disableEdit) { return; }

    if (key === "startTime" || key === "endTime") {
      value = TimeEvaluator(event, key);
    } else {
      value = event.target.value;
    }
    if (key === "channel" && value) {
      skey = routingRule.brand.value ? `${routingRule.brand.value}__` : "__";
      skey += `${value}__${newId}`;
    }

    if (key === "brand" && value) {
      skey = `${value}__`;
      skey += routingRule.channel.value ? `${routingRule.channel.value}__${newId}` : `__${newId}`;
    }
    const newRoutingRule: FormValidationRule = {
      [key]: {
        ...routingRule[key],
        value,
        error: isInvalidField(key, value)
      }
    };

    if (skey) {
      newRoutingRule["skey"] = { value: removeAllWhiteSpace(skey).toLocaleLowerCase() };
    }

    if (key === "callIntent" && value) {
      newRoutingRule["pkey"] = { value: removeAllWhiteSpace(value).toLocaleLowerCase() };
    }

    setRoutingRule((rule: FormValidationRule) => ({
      ...rule,
      ...newRoutingRule
    }));
  };

  const handleClose = (flag: boolean) => {
    setAlertBar(alertBarProps => ({
      ...alertBarProps,
      "open": flag
    }));
  };

  return (
    <div>
      <Modal
        size="large"
        className="route-table-modal-wrapper"
        takeover={["base", "sm", "md", "lg"]}
        isOpen={isOpen}
        onClose={() => {
          resetRoutingRule();
        }}
      >
        <ModalHeader><RoutingHeadingStyled type="h4-light">{`Add Routing Rule (Rule ID #${newId})`}</RoutingHeadingStyled></ModalHeader>
        <RoutingModalBodyStyled>
          <Grid container rowSpacing={3}>
            {
              routingFields.map(({
                label, key, control, required = false, disableAdd = false, isBlankFirstValue = false, formFields,
                dynamicFieldConditionCheck
              }) => {
                if(dynamicFieldConditionCheck && !dynamicFieldConditionCheck(routingRule)){
                  return;
                }
                return (
                  <Grid key={key} item xs={4}>
                    <ComponentControl
                      control={control}
                      name={key}
                      label={label}
                      type="text"
                      value={routingRule[key].value}
                      error={routingRule[key].error}
                      disabled={disableAdd}
                      dropDownOptions={dropDownValues[key as keyof RoutingDropDownList] || []}
                      onChange={(event: any) => handleInputChange(event, key, disableAdd)}
                      required={required}
                      isBlankFirstValue={isBlankFirstValue}
                      formFields={formFields}
                    />
                  </Grid>
                );
              })
            }
          </Grid>
        </RoutingModalBodyStyled>
        <RoutingModalFooterStyled>
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
            onClick={() => resetRoutingRule()}
          >
            Cancel
          </Button>
        </RoutingModalFooterStyled>
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