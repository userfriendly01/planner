/* eslint-disable react/prop-types */

import React, {
  useState,
  useEffect
} from "react";
import {
  Modal,
  ModalHeader
} from "@lmig/lmds-react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {
  initRule,
  flowFields
} from "./FlowFieldsConfig";
import ComponentControl from "../../../../core/SharedComponents/ComponentControl";
import {
  FlowKeys,
  dropDownList
} from "../../AlohaFlow.Interfaces";
import { addFlowRule } from "services";
import {
  ModalBodyStyled,
  ModalFooterStyled,
  HeadingStyled
} from "../../AlohaFlow.Styles";
import CustomToast from "../../../../core/CustomToast/CustomToast";
import {
  getAccessToken,
  getGraphQLEndpoint
} from "utils";
import { retrieveFlowData } from "services";
import { CctSharedCallFlowDb } from "../../AlohaFlow.Interfaces";
import { getGridMasterData } from "../../DataGridFlow/GridMaster";
interface AddFlowProps{
  isOpen: boolean;
  newId: number;
  onClose: (flag: boolean) => void;
  openModal: (flag: boolean, ruleType?:number|string) => void;
}
export default (props: AddFlowProps):JSX.Element => {
  const {
    onClose, isOpen = false, newId, openModal
  } = props;
  const accessToken: string = getAccessToken();
  const graphQlApiUrl: string = getGraphQLEndpoint();
  const languageOffer = ["English", "Spanish"];
  const userDestination = ["Avaya", "Twilio"];
  const [flowRule, setFlowRule] = useState({ ...initRule });
  const [dropDownValues, setDropDownValues] = useState({
    "brand": [],
    "languageOffer": [],
    "channel": [],
    "userDestination": []
  });
  const [alertBar, setAlertBar] = useState({
    "open": false,
    "msg": "",
    "severityType": ""
  });

  let dropDownOptions;
  useEffect(() => {
    async function fetchData() {
      const masterData = localStorage.getItem("FLOW_MASTER_DATA");
      let masterDataObject: any;
      if (masterData !== undefined && masterData !== null) {
        masterDataObject = JSON.parse(masterData);
      } else {
        const result: CctSharedCallFlowDb[] = await retrieveFlowData(accessToken, graphQlApiUrl);
        masterDataObject = await getGridMasterData(result);
      }
      setDropDownValues(dropDownValuesProps => ({
        ...dropDownValuesProps,
        "brand": masterDataObject.brand,
        "channel": masterDataObject.channel,
        "languageOffer": languageOffer,
        "userDestination": userDestination
      }));
    }
    fetchData();

  }, []);

  const handleClose = (flag: boolean) => {
    setAlertBar(alertBarProps => ({
      ...alertBarProps,
      "open": flag
    }));
  };

  function handleInputChange(event: any) {
    const key = event.target.name;
    let { value } = event.target;
    value = (key === "pkey" && !value.startsWith("+")) ? `+1${value}` : value;
    const newFlowRule = {
      [key]: { value },
      id: newId
    };

    setFlowRule((rule: any) => ({
      ...rule,
      ...newFlowRule
    }));
  }

  function validateRoute() {
    let isValidForm = true;
    Object.keys(flowRule).map(key => {
      if (flowRule[key as keyof FlowKeys].required && [undefined, "", null].includes(flowRule[key].value)) {
        const newFlowRule = {
          [key]: {
            ...flowRule[key],
            error: true
          }
        };
        isValidForm = false;
        setFlowRule((rule: any) => ({
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
    onClose(false);
  }

  function handleOnCreateRoute() {
    const isValidForm = validateRoute();
    if (isValidForm) {
      addFlowRule(flowRule, accessToken, graphQlApiUrl).then(apiResponse => {
        if (!apiResponse.errors) {
          openModal(true, "ADD_ROUTE_RULE");
          setAlertBar(alertBarProps => ({
            ...alertBarProps,
            "open": true,
            "severityType": "success",
            "msg": "New flow has been successfully added!!"
          }));
          setFlowRule({ ...initRule });
          return true;
        }
        setAlertBar(alertBarProps => ({
          ...alertBarProps,
          "open": true,
          "severityType": "error",
          "msg": apiResponse.errors[0].message
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
                label, key, control, required = false
              }) => {
                if (control === "select") {
                  dropDownOptions = dropDownValues[key as keyof dropDownList];
                } else {
                  dropDownOptions = [];
                }
                return (
                  <Grid key={key} item xs={4}>
                    <ComponentControl
                      control={control}
                      name={key}
                      label={label}
                      type="text"
                      value={flowRule[key as keyof FlowKeys].value}
                      error={flowRule[key as keyof FlowKeys].error}
                      dropDownOptions={dropDownOptions}
                      onChange={(event: any) => handleInputChange(event)}
                      required={required}
                    />
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
            onClick={() => handleOnCreateRoute()}
          >
            Create Rule
          </Button>
          <Button
            value="Cancel"
            variant="outlined"
            color="primary"
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



