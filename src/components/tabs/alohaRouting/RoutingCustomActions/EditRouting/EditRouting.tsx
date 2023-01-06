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
  convertTime12to24, getAccessToken, getGraphQLEndpoint, routingFields, routingInitRule, initializedAlertBar, routingDropDownList, dayOfWeek
} from "utils";
import {
  CctSharedCallRoutingDb, RoutingDropDownList
} from "../../AlohaRouting.Interfaces";
import {
  CustomToast, ComponentControl
} from "components";
import {
  Button, Grid
} from "@mui/material";
import { AlertBarProps } from "utils/interfaces";
import {
  deleteRoutingRule, updateRoutingDB
} from "services";

interface EditRoutingComponentProps {
    isOpen: boolean;
    selectedRow: CctSharedCallRoutingDb;
    openEditModal: (flag: boolean, isSubmitted?: boolean, row?: CctSharedCallRoutingDb, message?: string) => void;
}


export const EditRouting = ({
  isOpen, selectedRow, openEditModal
}: EditRoutingComponentProps): JSX.Element => {
  const accessToken: string = getAccessToken();
  const graphQLEndPoint: string = getGraphQLEndpoint();
  const [selectedRowLocal, setSelectedRowLocal] = useState({} as CctSharedCallRoutingDb);
  const startTime: React.MutableRefObject<string> = useRef();
  const endTime: React.MutableRefObject<string> = useRef();
  const [routingRule, setRoutingRule] = useState({ ...routingInitRule });
  const [dropDownValues, setDropDownValues] = useState(routingDropDownList);
  const [alertBar, setAlertBar] = useState(initializedAlertBar);
  const defaultValue: { [key: string]: any } = {};

  useEffect(() => {
    setDropDownValues((dropDownOptions: RoutingDropDownList) => ({
      ...dropDownOptions,
      dayOfWeek
    }));
    setSelectedRowLocal(selectedRow);
    if (selectedRow && selectedRow.startTime) {
      const flagStartTime = !Date.parse(selectedRow.startTime);
      const flagEndTime = !Date.parse(selectedRow.endTime);
      const todayDate = new Date().toISOString().split("T")[0];
      if (flagStartTime) {
        const hmsStartTime: string = convertTime12to24(selectedRow.startTime);
        const targetStartTime: Date = new Date(`${todayDate}T${hmsStartTime}`);
        startTime.current = targetStartTime.toISOString();
        defaultValue["startTime"] = startTime.current;
      }
      if (flagEndTime) {
        const hmsEndTime = convertTime12to24(selectedRow.endTime);
        const targetEndTime = new Date(`${todayDate}T${hmsEndTime}`);
        endTime.current = targetEndTime.toISOString();
        defaultValue["endTime"] = endTime.current;
      }
    }
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
      openEditModal(false, true, selectedRowLocal, `Routing Rule ID ${selectedRow.id} has been successfully deleted!! `);
      return true;
    }
    setRoutingRule({ ...routingInitRule });
    setAlertBar((alertBarProps: AlertBarProps) => ({
      ...alertBarProps,
      open: true,
      severityType: "error",
      msg: `Failed to Save Routing ID ${selectedRow.id}`
    }));
  };

  const handleOnSave = async () => {
    const response = await updateRoutingDB(selectedRowLocal, accessToken, graphQLEndPoint);
    if (response) {
      openEditModal(false, true, selectedRowLocal, `Routing Rule ID ${selectedRow.id} has been successfully updated!! `);
      return true;
    }
    setAlertBar((alertBarProps: AlertBarProps) => ({
      ...alertBarProps,
      open: true,
      severityType: "error",
      msg: `Failed to Delete Routing ID ${selectedRow.id}`
    }));
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
    return timePicked.toISOString();
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
                label, key, control, required = false, disableEdit = false, valueGetter, valueSetter
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