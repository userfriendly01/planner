import React, {
  useState, useEffect
} from "react";
import {
  Modal, ModalHeader
} from "@lmig/lmds-react-modal";
import {
  Button,Grid
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
  FlowMasterData
} from "../../AlohaFlow.Interfaces";
import {
  flowFields, initRule
} from "../FlowFieldsConfig";
import { CustomToast } from "components";
import {
  flowDropDownList,
  FLOW_MASTER_DATA,
  getGraphQLEndpoint,
  initializedAlertBar,
  languageOffer,
  userDestination
} from "utils";
import ComponentControl from "components/core/SharedComponents/ComponentControl";
import {
  AlertBarProps, FormValidationRule
} from "utils/interfaces";
import {
  deleteFlowRule, updateFlowDB
} from "services";
import { AzureSPA } from "globals";

interface EditFlowComponentProps {
    isOpen: boolean;
    selectedRow: CctSharedCallFlowDb;
    openEditModal: (flag: boolean, isSubmitted?: boolean, row?: CctSharedCallFlowDb, message?: string, deleteRow?: boolean) => void;
}
export const EditFlow = ({
  accessToken, matchedGroups, isOpen, selectedRow, openEditModal
}: EditFlowComponentProps & AzureSPA): JSX.Element => {

  const graphQLEndPoint: string = getGraphQLEndpoint();

  const [selectedRowLocal, setSelectedRowLocal] = useState({} as CctSharedCallFlowDb);
  const [displayRecords, setDisplayRecords] = useState(false);
  const [flowRule, setFlowRule] = useState({ ...initRule });
  const [dropDownValues, setDropDownValues] = useState(flowDropDownList);
  const [alertBar, setAlertBar] = useState(initializedAlertBar);


  useEffect(() => {
    setSelectedRowLocal(selectedRow);
    setDisplayRecords(false);
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
        dataRequests: masterData?.dataRequests
      })
    );
  }, [selectedRow]);

  const isInvalidField =(key: string, value: string): boolean =>{
    return flowRule[key].required && [undefined, "", null].includes(value);
  };

  const validateFlow = async (): Promise<boolean> => {
    let isValidForm = true;
    Object.keys(flowRule).map(key => {
      const fieldValue: string = findFieldValue(key);
      if (isInvalidField(key, fieldValue)) {
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

  const findFieldValue = (key: string): string => {
    let fieldValue = "";
    flowFields.map((value: AddFlowFieldsConfigProps) => {
      if (value.key === key) {
        fieldValue = value.valueGetter(selectedRowLocal);
      }
    });
    return fieldValue;
  };

  const handleOnSave = async () => {
    const isValidForm = await validateFlow();
    if (isValidForm) {
      const response = await updateFlowDB(selectedRowLocal, accessToken, graphQLEndPoint);
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
      openEditModal(false, isSubmitted, selectedRowLocal, `Phone Number ${selectedRow.pkey} has been successfully updated!!`, false);
      setFlowRule({ ...initRule });
    }
  };

  const handleOnDelete = async () => {
    const response = await deleteFlowRule(selectedRowLocal, accessToken, graphQLEndPoint);
    if (response) {
      openEditModal(false, true, selectedRowLocal, `Phone Number ${selectedRow.pkey} has been successfully deleted!!`, true);
    }
    setFlowRule({ ...initRule });
  };

  function navigateBtns(display:boolean) {
    setDisplayRecords(display);
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
    let key: string;
    if(valuePassed && typeof(valuePassed) === "string"){
      value = valuePassed;
      key = keyPassed;
    }
    else{
      key = event.target.name;
      value = event.target.value;
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
        <ModalHeader><HeadingStyled type="h4-light">{`Update Flow Rule ${selectedRow && selectedRow.pkey}`}</HeadingStyled></ModalHeader>
        <ModalBodyStyled>
          <Grid container rowSpacing={3}>
            {
              flowFields.map(({
                label, key, control, required = false, flowType = "", gridSize = 12,
                valueGetter, disableEdit, valueSetter
              }) => {
                if(flowType &&displayRecords){
                  control = "input";
                }
                else if (flowType && !displayRecords){
                  control = "AutoComplete";
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

                    {(flowType === "viewAndAdd")?(<Grid item xs={1}>
                      <AddOrView navigateViewOrAdd = {navigateBtns}></AddOrView>
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
            sx={{ marginRight: 2 }}
            aria-label="saveFlowRuleButton"
            onClick={() => handleOnSave()}
          >
                        Save Rule
          </Button>
          <Button
            variant="contained"
            color="error"
            value="Delete"
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
