import React from "react";
import { useAdminState } from "context";
import {
  Dropdown,
  NNumberInput
} from "components";
import {
  userFormActions,
  useFormState,
  useFormDispatch
} from "context";
import {
  Switch,
  TextField
} from "@mui/material";
import {
  getWfmBusinessUnits,
  getWfmTeams,
  getWfmOptions
} from "utils";
import WFMLoadRetryModal from "../../BulkChanges/WFMLoadRetryModal";

const WfmForm = (props: any) => {
  const state = useAdminState();
  const form = useFormState();
  const setForm = useFormDispatch();
  const [ optionsByBusinessUnit, setOptionsByBusinessUnit ] = React.useState([]);

  React.useEffect(() => {
    setOptionsByBusinessUnit(getWfmOptions(state, form.calabrio_wfm.BusinessUnitId));
  }, [form.calabrio_wfm.BusinessUnitId]);

  const handleOnBlur = (field: string, system: string) => {
    const isFieldValid = system ? form[system][field].valid : form[field].valid;
    if(!isFieldValid){
      setForm({
        type: userFormActions.SET_BLUR_ON_FIELD,
        payload: {
          field,
          system
        }
      });
    }
  };
/*
    OptionalColumns: Dropdown, multi-select,
    Id: text field,
    Identity: text field with auto populate button
    FirstName: string, autopopulated
    LastName: string, autopopulated
    EmploymentNumber: autopopulated - if Triton is not checked, add in NNumber input
    Email: string, autopopulated
    DisplayName: autopopulated
    TerminationDate: date picker
    EmploymentStartDate: date picker,
    TimeZoneId: dropdown,
    BusinessUnitId: dropdown,
    SiteId: dropdown,
    TeamId: dropdown,
    PersonSkills: dropdown multiselect,
    WorkflowControlSetId: dropdown,
    ContractId: dropdown,
    ContractScheduleId: dropdown,
    BudgetGroupId: dropdown,
    PartTimePercentageId: dropdown,
    ShiftBagId: dropdown,
    Note: open text field,
    Roles: any[],
    FirstDayOfWeek: number,
  */
 
    //options have to be in the applicable BU/team and if the BU/Team changes it has to validate the existing selections

  const generateDropdownOption = (optionsArray: any[]) => {
    return optionsArray.map((o: any) => {
      return {
        value: o.Id,
        label: o.Name,
        ...o
      }
    })
  };

  return (
    <>
      { state.calabrioContext.wfmOptions ?
        <div>
          <Dropdown
            disabled={false}
            error={false}
            label={"Business Unit *"}
            styles={{
              width: "384px",
              margin: "10px 0px"
            }}
            onBlur={() => handleOnBlur("TBD", "calabrio_wfm")}
            options={generateDropdownOption(getWfmBusinessUnits(state))}
            updateValue={(event: any, newValue: any) => setForm({
              type: "SET_UPDATE_WFM_FORM_STATE",
              payload: calabrioWfmUser
            })}
            value={null}
          />
        </div>
    : <WFMLoadRetryModal handleClose={() => {}}/>}
    </>
  )
}

export default WfmForm;