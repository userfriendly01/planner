import {
  Modal, ModalHeader
} from "@lmig/lmds-react-modal";
import {
  RoutingHeadingStyled, RoutingModalBodyStyled, RoutingModalFooterStyled
} from "../../AlohaRouting.Styles";
import React, {
  useState, useRef, useEffect
} from "react";
import {
  convertTime12to24,convertTime24to12, getGraphQLEndpoint, routingFields, routingInitRule, initializedAlertBar, routingDropDownList, dayOfWeek
} from "utils";
import {
  CctSharedCallRoutingDb, RoutingDropDownList, AddPageFieldConfigProps
} from "../../AlohaRouting.Interfaces";
import {
  CustomToast, ComponentControl
} from "components";
import {
  Button, Grid
} from "@mui/material";
import {
  AlertBarProps, FormValidationRule
} from "utils/interfaces";
import {
  deleteRoutingRule, updateRoutingDB
} from "services";
import { AzureSPA } from "globals";

interface EditRoutingComponentProps {
    isOpen: boolean;
    selectedRow: CctSharedCallRoutingDb;
    openEditModal: (flag: boolean, isSubmitted?: boolean, row?: CctSharedCallRoutingDb, message?: string, deleteRow?: boolean) => void;
}


export const EditRouting = ({
  accessToken, matchedGroups, isOpen, selectedRow, openEditModal
}: EditRoutingComponentProps & AzureSPA): JSX.Element => {
  const graphQLEndPoint: string = getGraphQLEndpoint();
  const [selectedRowLocal, setSelectedRowLocal] = useState({} as CctSharedCallRoutingDb);
  const [routingRule, setRoutingRule] = useState({ ...routingInitRule });
  const [dropDownValues, setDropDownValues] = useState(routingDropDownList);
  const [alertBar, setAlertBar] = useState(initializedAlertBar);
  const defaultValue: { [key: string]: any } = {};

  useEffect(() => {
    setDropDownValues((dropDownOptions: RoutingDropDownList) => ({
      ...dropDownOptions,
      dayOfWeek
    }));
    let startTime: string;
    let endTime: string;
    if (selectedRow && selectedRow.startTime) {
      const flagStartTime = !Date.parse(selectedRow.startTime);
      const flagEndTime = !Date.parse(selectedRow.endTime);

      if (flagStartTime) {
        startTime = convertTime12to24(selectedRow.startTime);
        defaultValue["startTime"] = startTime;
      }
      if (flagEndTime) {
        endTime = convertTime12to24(selectedRow.endTime);
        defaultValue["endTime"] = endTime;
      }
    }
    setSelectedRowLocal({
      ...selectedRow,
      startTime,
      endTime
    });
  }, [selectedRow]);

  const handleCancel = () => {
    setRoutingRule({ ...routingInitRule });
    openEditModal(false);
  };

  const handleClose = (flag: boolean) => {
    setAlertBar((alertBarProps: AlertBarProps) => ({
      ...alertBarProps,
      open: flag
    }));
  };

  const handleOnDelete = async () => {
    const response = await deleteRoutingRule(selectedRowLocal, accessToken, graphQLEndPoint);
    if (response) {
      openEditModal(false, true, selectedRowLocal, `Routing Rule ID ${selectedRow.id} has been successfully deleted!! `, true);
      return true;
    }
    setRoutingRule({ ...routingInitRule });
    setAlertBar((alertBarProps: AlertBarProps) => ({
      ...alertBarProps,
      open: true,
      severityType: "error",
      msg: `Failed to delete Routing ID ${selectedRow.id}`
    }));
  };

  const isInvalidField = (key: string, value: string):boolean =>{
    return routingRule[key].required && [undefined, "", null].includes(value);
  };
  const findFieldValue = (key: string): string => {
    let fieldValue = "";
    routingFields.map((value: AddPageFieldConfigProps) => {
      if (value.key === key) {
        fieldValue = value.valueGetter(selectedRowLocal);
      }
    });
    return fieldValue;
  };

  const validateRoute = () => {
    let isValidForm = true;
    Object.keys(routingRule).map(key => {
      const fieldValue: string = findFieldValue(key);
      if (isInvalidField(key, fieldValue)) {
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

  const handleOnSave = async () => {
    const isValidForm = await validateRoute();
    if(isValidForm){
      const updatedRow: CctSharedCallRoutingDb = {
        ...selectedRowLocal,
        startTime: convertTime24to12(selectedRowLocal.startTime),
        endTime: convertTime24to12(selectedRowLocal.endTime)
      };
      const response = await updateRoutingDB(updatedRow, accessToken, graphQLEndPoint);
      if (response) {
        openEditModal(false, true, updatedRow, `Routing Rule ID ${selectedRow.id} has been successfully updated!! `, false);
        return true;
      }
      setAlertBar((alertBarProps: AlertBarProps) => ({
        ...alertBarProps,
        open: true,
        severityType: "error",
        msg: `Failed to save Routing ID ${selectedRow.id}`
      }));
    }
  };

  const handleTimeEvalChange = async (
    event: any,
    key: string
  ) => {
    const timePicked = new Date(event.$d.toString());
    timePicked.setSeconds(0);
    if (key === "endTime") {
      timePicked.setSeconds(timePicked.getSeconds() - 1);
    }
    return timePicked.toLocaleString();
  };

  const handleInputChange = async (
    event: any,
    key?: string,
    valueSetter?: (currentValue: CctSharedCallRoutingDb, newValue: any) => CctSharedCallRoutingDb
  ) => {
    let value: string;
    if (["startTime", "endTime"].includes(key)) {
      value = await handleTimeEvalChange(event, key);
    } else {
      value = event.target.value;
    }
    const updatedSelectedValue: CctSharedCallRoutingDb = valueSetter(selectedRowLocal, { [key]: value });
    setSelectedRowLocal(updatedSelectedValue);
    const newFlowRule: FormValidationRule = {
      [key]: {
        ...routingRule[key],
        value: value,
        error: isInvalidField(key, value)
      }
    };

    setRoutingRule((rule: FormValidationRule) => ({
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
      >
        <ModalHeader><RoutingHeadingStyled type="h4-light">{`Update Routing Rule (Rule ID#${selectedRow && selectedRow.id})`}</RoutingHeadingStyled></ModalHeader>
        <RoutingModalBodyStyled>
          <Grid container rowSpacing={3}>
            {
              routingFields.map(({
                label, key, control, required = false, disableEdit = false, valueGetter, valueSetter, isBlankFirstValue = false,formFields
              }) => {
                return (
                  // eslint-disable-next-line react/jsx-key
                  <Grid key={key} item xs={4}>
                    <ComponentControl
                      control={control}
                      name={key}
                      label={label}
                      type="text"
                      value={valueGetter(selectedRowLocal, defaultValue[key])}
                      error={routingRule[key].error}
                      dropDownOptions={dropDownValues[key as keyof RoutingDropDownList] || []}
                      onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleInputChange(event, key, valueSetter)}
                      required={required}
                      disabled={disableEdit}
                      isBlankFirstValue = {isBlankFirstValue}
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
            variant="contained"
            value="Save"
            color="primary"
            sx={{ marginRight: 2 }}
            onClick={() => handleOnSave()}
          >
                        Save Rule
          </Button>
          <Button
            variant="contained"
            color="error"
            value="Delete"
            sx={{ marginRight: 2 }}
            onClick={() => handleOnDelete()}
          >
                        Delete Rule
          </Button>
          <Button
            value="Cancel"
            variant="outlined"
            color="primary"
            onClick={() => handleCancel()}
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