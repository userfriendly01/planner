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
} from "../FlowFieldsConfig";
import ComponentControl from "../../../../core/SharedComponents/ComponentControl";
import {
  FlowKeys,
  FlowDropDownList
} from "../../AlohaFlow.Interfaces";
import { addFlowRule } from "services";
import {
  ModalBodyStyled,
  ModalFooterStyled,
  HeadingStyled
} from "../../AlohaFlow.Styles";
import CustomToast from "../../../../core/CustomToast/CustomToast";
import {
  flowDropDownList,
  FLOW_MASTER_DATA,
  getAccessToken,
  getGraphQLEndpoint,
  initializedAlertBar,
  languageOffer,
  userDestination
} from "utils";
import { retrieveFlowData } from "services";
import {
  CctSharedCallFlowDb, FlowMasterData
} from "../../AlohaFlow.Interfaces";
import { getGridMasterData } from "../../DataGridFlow/GridMaster";
import {
  AlertBarProps, FormValidationRule
} from "utils/interfaces";

export interface AddFlowModalProps {
  isOpen: boolean;
  newId: number;
  openAddModal: (flag: boolean, isSubmitted?: boolean) => void;
}

export const AddFlow = ({
  isOpen = false, newId, openAddModal
}: AddFlowModalProps):JSX.Element => {

  const accessToken: string = getAccessToken();
  const graphQlApiUrl: string = getGraphQLEndpoint();
  const [flowRule, setFlowRule] = useState({ ...initRule });
  const [dropDownValues, setDropDownValues] = useState(flowDropDownList);
  const [alertBar, setAlertBar] = useState(initializedAlertBar);


  useEffect(() => {
    async function fetchData() {
      const masterData: string = localStorage.getItem(FLOW_MASTER_DATA);
      let masterDataObject: FlowMasterData;
      if (masterData !== undefined && masterData !== null) {
        masterDataObject = JSON.parse(masterData);
      } else {
        const result: CctSharedCallFlowDb[] = await retrieveFlowData(accessToken, graphQlApiUrl);
        masterDataObject = await getGridMasterData(result);
      }
      setDropDownValues((dropDownValuesProps: FlowDropDownList) => ({
        ...dropDownValuesProps,
        brand: masterDataObject.brand,
        channel: masterDataObject.channel,
        languageOffer: languageOffer,
        userDestination: userDestination
      }));
    }
    fetchData();

  }, []);

  const handleClose = (flag: boolean) => {
    setAlertBar((alertBarProps: AlertBarProps) => ({
      ...alertBarProps,
      "open": flag
    }));
  };

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const key: string = event.target.name;
    let value: string = event.target.value;
    value = (key === "pkey" && !value.startsWith("+")) ? `+1${value}` : value;
    const newFlowRule: FormValidationRule = {
      [key]: { value }
    };

    setFlowRule((rule: FormValidationRule) => ({
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

  function handleOnCreateRoute() {
    const isValidForm: boolean = validateRoute();
    if (isValidForm) {
      addFlowRule(flowRule, accessToken, graphQlApiUrl).then(apiResponse => {
        if (!apiResponse.errors) {
          openAddModal(false, true);
          setAlertBar((alertBarProps: AlertBarProps) => ({
            ...alertBarProps,
            open: true,
            severityType: "success",
            msg: "New flow has been successfully added!! "
          }));
          setFlowRule({ ...initRule });
          return true;
        }
        setAlertBar((alertBarProps: AlertBarProps) => ({
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
                return (
                  <Grid key={key} item xs={4}>
                    <ComponentControl
                      control={control}
                      name={key}
                      label={label}
                      type="text"
                      value={flowRule[key as keyof FlowKeys].value}
                      error={flowRule[key as keyof FlowKeys].error}
                      dropDownOptions={dropDownValues[key as keyof FlowDropDownList] || []}
                      onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleInputChange(event)}
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



