import React, {
  useState, useEffect
} from "react";
import {
  Modal, ModalHeader
} from "@lmig/lmds-react-modal";
import {
  Button, FormControl, Grid, IconButton, InputLabel, ListItemText, MenuItem, Select
} from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
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
  getAccessToken,
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

interface EditFlowComponentProps {
    isOpen: boolean;
    selectedRow: CctSharedCallFlowDb;
    openEditModal: (flag: boolean, isSubmitted?: boolean, row?: CctSharedCallFlowDb, message?: string) => void;
}
export const EditFlow = ({
  isOpen = false, selectedRow, openEditModal
}: EditFlowComponentProps): JSX.Element => {

  const accessToken: string = getAccessToken();
  const graphQLEndPoint: string = getGraphQLEndpoint();

  const [selectedRowLocal, setSelectedRowLocal] = useState({} as CctSharedCallFlowDb);
  const [updateDataReq, setUpdateDataReq] = useState("");
  const [displayRecords, setDisplayRecords] = useState(false);
  const [flowRule, setFlowRule] = useState({ ...initRule });
  const [dropDownValues, setDropDownValues] = useState(flowDropDownList);
  const [alertBar, setAlertBar] = useState(initializedAlertBar);


  useEffect(() => {
    setSelectedRowLocal(selectedRow);
    setUpdateDataReq("");
    setDisplayRecords(false);
    const masterDataStorage: string = localStorage.getItem(FLOW_MASTER_DATA);
    const masterData: FlowMasterData = JSON.parse(masterDataStorage);
    setDropDownValues((dropDownOptions: FlowDropDownList) => (
      {
        ...dropDownOptions,
        brand: masterData.brand,
        channel: masterData.channel,
        languageOffer: languageOffer,
        userDestination: userDestination
      })
    );
  }, [selectedRow]);

  const validateFlow = async (): Promise<boolean> => {
    let isValidForm = true;
    Object.keys(flowRule).map(key => {
      const fieldValue: string = findFieldValue(key);
      if (flowRule[key].required && [undefined, "", null].includes(fieldValue)) {
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
      openEditModal(false, isSubmitted, selectedRowLocal, `Phone Number ${selectedRow.pkey} has been successfully updated!! `);
      setFlowRule({ ...initRule });
    }
  };

  const handleOnDelete = async () => {
    const response = await deleteFlowRule(selectedRowLocal, accessToken, graphQLEndPoint);
    if (response) {
      openEditModal(false, true, selectedRowLocal, `Phone Number ${selectedRow.pkey} has been successfully deleted!! `);
    }
    setFlowRule({ ...initRule });
  };

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
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => CctSharedCallFlowDb
  ) => {
    const updatedSelectedValue: CctSharedCallFlowDb = valueSetter(selectedRowLocal, { [event.target.name]: event.target.value });
    setSelectedRowLocal(updatedSelectedValue);
  };

  const removeItem = (index: number) => {
    setSelectedRowLocal((selectRowLocal: CctSharedCallFlowDb) => ({
      ...selectRowLocal,
      content: {
        ...selectRowLocal.content,
        dataRequests: [
          ...selectRowLocal.content.dataRequests.filter((_, i) => i !== index)
        ]
      }
    }));
  };

  const addItem = () => {
    setDisplayRecords(true);
    if (updateDataReq && updateDataReq !== "") {
      setSelectedRowLocal((selectRowLocal: CctSharedCallFlowDb) => ({
        ...selectRowLocal,
        content: {
          ...selectRowLocal.content,
          dataRequests: [
            ...selectRowLocal.content.dataRequests,
            updateDataReq
          ]
        }
      }));
    }
    setUpdateDataReq("");
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
                label, key, control, required = false, disableEdit = false, valueGetter, valueSetter
              }) => {
                return (
                  <Grid key={key} item xs={4}>
                    {(key === "dataRequests") ? (
                      <Grid container>
                        {displayRecords ? (
                          <Grid item xs={10}>
                            <ComponentControl
                              label="Data Request"
                              name="dataRequests"
                              type="text"
                              control="input"
                              value={updateDataReq || ""}
                              onChange={event => { setUpdateDataReq(event.target.value); }}
                              dropDownOptions={dropDownValues[key as keyof FlowDropDownList] || []}
                              required
                              error={flowRule.dataRequests.error}
                            />
                          </Grid>
                        ) : (
                          <Grid item xs={10}>
                            <FormControl required error={flowRule.dataRequests.error}>
                              <InputLabel id="data-request-select-input">View Data Requests</InputLabel>
                              <Select
                                inputProps={{
                                  "aria-label": "Without label",
                                  sx: {
                                    width: 270,
                                    maxHeight: 15
                                  }
                                }}
                                size="medium"
                                labelId="data-request-select-input"
                                label="View Data Requests"
                              >
                                {selectedRowLocal?.content?.dataRequests?.map((option: string, index: number) => (
                                  <MenuItem sx={{ maxHeight: 35 }} key={option}>
                                    <ListItemText primary={option} key={option} />
                                    <IconButton onClick={() => { removeItem(index); }} aria-label="removeDataRequest" edge="end">
                                      <RemoveIcon> </RemoveIcon>
                                    </IconButton>
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        )}
                        <Grid item xs={2}>
                          {!displayRecords && (<IconButton onClick={addItem} aria-label="addDataRequestButton" edge="end">

                            <AddIcon> </AddIcon>
                          </IconButton>)}
                          {displayRecords && (<IconButton onClick={() => { setDisplayRecords(false); }} aria-label="displayDataRequestButton" edge="end">
                            <ViewListIcon />
                          </IconButton>)}
                        </Grid>
                      </Grid>
                    ) :
                      (<ComponentControl
                        control={control}
                        name={key}
                        label={label}
                        type="text"
                        value={valueGetter(selectedRowLocal)}
                        error={flowRule[key as keyof FlowKeys].error}
                        dropDownOptions={dropDownValues[key as keyof FlowDropDownList] || []}
                        onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleInputChange(event, valueSetter)}
                        required={required}
                        disabled={disableEdit}
                      />)
                    }
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
