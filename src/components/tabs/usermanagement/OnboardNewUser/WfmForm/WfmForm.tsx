import React from "react";
import {
  Button,
  Row,
  Wrapper
} from "./WfmForm.Styles";
import {
  Dropdown,
  NNumberInput
} from "components";
import {
  userFormActions,
  useFormState,
  useFormDispatch,
  useAdminState
} from "context";
import {
  FormGroup,
  FormControlLabel,
  InputAdornment,
  Switch,
  TextareaAutosize,
  TextField,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  AutoFixHigh
} from "@mui/icons-material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  formModes
} from "globals";
import {
  getWfmBusinessUnits,
  getWfmTeams,
  getWfmOptions,
  calabrioTimeZones,
  isArrayOptionAdded
} from "utils";
import WFMLoadRetryModal from "../../BulkChanges/WFMLoadRetryModal";

const WfmForm = (props: any) => {
  const state = useAdminState();
  const form = useFormState();
  const setForm = useFormDispatch();
  const isAdd = form.formMode === formModes.INSERT;
  const [ availabilityFields, setAvailabilityFields ] = React.useState({
    id: null,
    startDate: null
  });
  const [ teamFields, setTeamFields ] = React.useState({
    id: null,
    startDate: null
  });
  const [ skillFields, setSkillFields ] = React.useState({
    skills: form.calabrio_wfm.PersonSkills || [],
    startDate: null
  });
  const [ rotationFields, setRotationFields ] = React.useState({
    id: [],
    startDate: null,
    startWeek: null
  });
  const [ optionsByBusinessUnit, setOptionsByBusinessUnit ] = React.useState<any>({});
  const [ scheduling, setScheduling ] = React.useState(false);

  console.log("FAITH optionsByBusinessUnit", optionsByBusinessUnit);
  console.log("FAITH form", form);

  React.useEffect(() => {
    const trimmedOptions = getWfmOptions(state, form.calabrio_wfm.BusinessUnitId);
    setOptionsByBusinessUnit(trimmedOptions);
  }, [form.calabrio_wfm.BusinessUnitId]);

  React.useEffect(() => {
    if(teamFields.id && teamFields.startDate){
      setForm({
        type: userFormActions.SET_WFM_TEAM,
        payload: teamFields
      });
    } else {
      setForm({
        type: userFormActions.SET_WFM_TEAM,
        payload: {
          id: null,
          startDate: null
        }
      });
    }
  }, [teamFields]);

  React.useEffect(() => {
    if(skillFields.skills && skillFields.startDate){
      setForm({
        type: userFormActions.SET_WFM_SKILLS,
        payload: skillFields
      })
    } else {
      setForm({
        type: userFormActions.SET_WFM_SKILLS,
        payload: {
          skills: [],
          startDate: null
        }
      });
    }
  }, [skillFields]);

  React.useEffect(() => {
    if(rotationFields.id && rotationFields.startDate && rotationFields.startWeek){
      setForm({
        type: userFormActions.SET_WFM_ROTATION,
        payload: rotationFields
      })
    } else {
      setForm({
        type: userFormActions.SET_WFM_ROTATION,
        payload: {
          id: [],
          startDate: null,
          startWeek: null
        }
      });
    }
  }, [rotationFields]);

  React.useEffect(() => {
    if(availabilityFields.id && availabilityFields.startDate){
      setForm({
        type: userFormActions.SET_WFM_AVAILABILITY,
        payload: availabilityFields
      })
    } else {
      setForm({
        type: userFormActions.SET_WFM_AVAILABILITY,
        payload: {
          id: [],  // FAITH LOOK HERE: why is this an array??? - Kaleigh
          startDate: null
        }
      });
    }
  }, [availabilityFields]);

  React.useEffect(() => {
    console.log("FAITH Fetched User!");
    const worker = form.nNumber.nNumberFetchedUser;
    if(worker){
      setForm({
        type: userFormActions.SET_WFM_USER_DATA,
        payload: {
          firstName: worker.firstName,
          lastName: worker.lastName,
          nNumber: form.nNumber.value,
          email: form.nNumber.nNumberFetchedUser.email,
          fullName: `${worker.firstName} ${worker.lastName}`
        }
      });
    } else {
      setForm({
        type: userFormActions.SET_WFM_USER_DATA,
        payload: {
          firstName: null,
          lastName: null,
          nNumber: null,
          email: null,
          fullName: null
        }
      });
    }
  }, [form.nNumber.nNumberFetchedUser]);
 
    //Site isnt needed for Create User but its part of a users payload
    //Is Team Start Date different from Person Start date?
    //options have to be in the applicable BU/team and if the BU/Team changes it has to validate the existing selections

  const generateDropdownOptionArray = (optionsArray: any[]) => {
    if(optionsArray){
      return optionsArray?.map((o: any) => {
        return generateDropdownOption(o);
      });
    } else {
      return [];
    }
  };

  const generateDropdownOption = (option: any) => {
    if(option){
      return {
        value: option.Id,
        label: option.Name,
        ...option
      }
    } else {
      return ""
    }
  };

  return (
    <Wrapper>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Row>
          {!form.triton.userFound &&
            <NNumberInput
              disabled={(form.formMode === formModes.UPDATE) || (form.nNumber.nNumberFetchedUser ? true : false) || form.formMode === formModes.DELETE}
              fetchedUser={form.nNumber.nNumberFetchedUser}
              label="N Number *"
              onClear={() => setForm({ type: userFormActions.CLEAR_N_NUMBER })}
              onComplete={(fetchedUser: any, nNumber: any) => setForm({
                type: userFormActions.COMPLETE_N_NUMBER,
                payload: {
                  nNumber,
                  fetchedUser
                }
              })}
              onUpdate={(nNumber: string) => {
                setForm({
                  type: userFormActions.UPDATE_N_NUMBER,
                  payload: nNumber
                });
              }}
              value={form.nNumber.value}
            />
          }
          <Dropdown
            disabled={!isAdd}
            error={false}
            label={"Business Unit *"}
            styles={{
              width: "250px",
              margin: "0px 5px"
            }}
            options={generateDropdownOptionArray(getWfmBusinessUnits(state))}
            updateValue={(event: any, newValue: any) => setForm({
              type: userFormActions.SET_WFM_BUSINESS_UNIT,
              payload: newValue.value
            })}
            value={generateDropdownOption(getWfmBusinessUnits(state).find((bu: any) => bu.Id === form.calabrio_wfm.BusinessUnitId))}
          />
        </Row>
        {/* FAITH LOOK HERE!  I added the .length here because I assumed you only wanted to show these if we have the options and org loaded.  Test was failing without the .length - KALEIGH*/}
      { state.calabrioContext.wfmOptions?.length && state.calabrioContext.wfmOrg?.length ?
      <>
        <Row>
          <TextField
            disabled={!isAdd}
            label={"Identity"}
            value={form.calabrio_wfm.Identity || ""}
            onChange={(event: any) => setForm({
              type: userFormActions.SET_WFM_IDENTITY,
              payload: event.target.value
            })}
            sx={{
              width: "250px",
              margin: "0px 5px"
            }}
            InputProps={{
              endAdornment:
              <InputAdornment
                position="end"
              >
              <Tooltip
                placement="right"
                title="Use HR Email">
                <IconButton
                  data-testid="clearButton"
                  edge="end"
                  aria-label="clear the search field"
                  onClick={() => 
                    setForm({
                      type: userFormActions.SET_WFM_IDENTITY,
                      payload: form.nNumber.nNumberFetchedUser.email
                    })}
                >
                  <AutoFixHigh/>
                </IconButton>
              </Tooltip>
              </InputAdornment>
            }}
          />
          <Dropdown
            disabled={!isAdd}
            error={false}
            label={"First Day of the Week *"}
            styles={{
              width: "250px",
              margin: "0px 5px"
            }}
            options={[0,1,2,3,4,5,6]}  //FAITH LOOD HERE!  In Bulk wfm these are 0-6... 0=sunday, I've changed this from 1-7 to 0-6 - KALEIGH
            updateValue={(event: any, newValue: any) => setForm({
              type: userFormActions.SET_WFM_FIRST_DAY_OF_WEEK,
              payload: newValue
            })}
            value={form.calabrio_wfm.FirstDayOfWeek}
          />
          <Dropdown
            disabled={!isAdd}
            label="Time Zone"
            options={calabrioTimeZones}
            value={calabrioTimeZones.find((t: any) => t.value === form.calabrio_qm.timezone)}
            updateValue={(event: any, timezone: any) => setForm({
              type: userFormActions.SET_WFM_TIME_ZONE,
              payload: timezone.value
            })}
            styles={{ width: "250px" }}
          />
        </Row>
        <Row>
          <Dropdown
            disabled={!isAdd}
            label="Availability"
            options={generateDropdownOptionArray(optionsByBusinessUnit["Availabilities"])}
            value={generateDropdownOptionArray(optionsByBusinessUnit["Availabilities"]).find((a: any) => a.value === form.calabrio_wfm.AvailabilityId)}
            updateValue={(event: any, newValue: any) => setAvailabilityFields({
              ...availabilityFields,
              id: newValue
            })}
            styles={{ width: "250px" }}
          />
          <DatePicker
            disabled={!isAdd}
            label="Availability Start Date"
            value={availabilityFields.startDate || ""}
            onChange={(newValue) => {
              setAvailabilityFields({
                ...availabilityFields,
                startDate: new Date(newValue).toLocaleDateString()
              })}
            } 
            renderInput={props => <TextField {...props} error={false} />}
          />
          <Dropdown
            disabled={!isAdd}
            multiple={true}
            label="Roles"
            options={generateDropdownOptionArray(optionsByBusinessUnit["Roles"])}
            value={generateDropdownOptionArray(form.calabrio_wfm.Roles)}
            updateValue={(event: any, options: any) => setForm({
              type: userFormActions.SET_WFM_ROLES,
              payload: options
            })}
            styles={{ width: "250px" }}
          />
        </Row>
        <Row>
          <Dropdown
            disabled={!isAdd}
            multiple={true}
            label="Skills"
            options={generateDropdownOptionArray(optionsByBusinessUnit["Skills"])}
            value={generateDropdownOptionArray(skillFields.skills)}
            updateValue={(event: any, options: any) => setSkillFields({
              ...skillFields,
              skills: options
            })}
            styles={{ width: "250px" }}
          />
          { isArrayOptionAdded(form.calabrio_wfm.PersonSkills, skillFields.skills) &&
            <DatePicker
              disabled={!isAdd}
              label="Skills Start Date"
              value={skillFields.startDate || ""}
              onChange={(newValue) => {
                setSkillFields({
                  ...skillFields,
                  startDate: new Date(newValue).toLocaleDateString()
                })}
              } 
              renderInput={props => <TextField {...props} error={false} />}
            />
          }
          <Dropdown
            disabled={!isAdd}
            label="Workflow Control Set"
            options={generateDropdownOptionArray(optionsByBusinessUnit["Workflow_Control_Sets"])}
            value={optionsByBusinessUnit["Workflow_Control_Sets"]?.find((wcs: any) => wcs.value === form.calabrio_wfm.WorkflowControlSetId) || ""}
            updateValue={(event: any, newValue: any) => setForm({
              type: userFormActions.SET_WFM_CONTROL_SET,
              payload: newValue.value
            })}
            styles={{ width: "250px" }}
          />
        </Row>
        <Row>
        <Dropdown
            disabled={!isAdd}
            label="Rotation"
            options={generateDropdownOptionArray(optionsByBusinessUnit["Rotations"])}
            value={rotationFields.id || ""}
            updateValue={(event: any, newValue: any) => setRotationFields({
              ...rotationFields,
              id: newValue
            })}
            styles={{ width: "250px" }}
          />
          <DatePicker
            disabled={!isAdd}
            label="Rotation Start Date"
            value={rotationFields.startDate || ""}
            onChange={(newValue) => {
              setAvailabilityFields({
                ...rotationFields,
                startDate: new Date(newValue).toLocaleDateString()
              })}
            } 
            renderInput={props => <TextField {...props} error={false} />}
          />
          <Dropdown
            disabled={!isAdd}
            error={false}
            label={"Rotation Start Week"}
            styles={{
              width: "250px",
              margin: "0px 5px"
            }}
            options={[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56]}
            updateValue={(event: any, newValue: any) => setRotationFields({
              ...rotationFields,
              startWeek: newValue
            })}
            value={form.calabrio_wfm.FirstDayOfWeek}
          />
        </Row>
        <Row>
          <Dropdown
            disabled={!isAdd}
            multiple={true}
            label="Optional Columns"
            options={generateDropdownOptionArray(optionsByBusinessUnit["Optional_Columns"])}
            value={generateDropdownOptionArray(form.calabrio_wfm.OptionalColumns)}
            updateValue={(event: any, options: any) => setForm({
              type: userFormActions.SET_WFM_OPTIONAL_COLUMNS,
              payload: options
            })}
            styles={{ width: "250px" }}
          />
          <TextareaAutosize 
            disabled={!isAdd}
            minRows={4}
            placeholder="Notes"
            style={{ width: "522px" }}
            />
        </Row>
        <Row>
          <FormGroup>
            <FormControlLabel control={<Switch
              disabled={!isAdd}
              checked={isAdd ? scheduling : true}
              onChange={() => setScheduling(!scheduling)}
            />} label="Create Schedule" />
          </FormGroup>
        </Row>
      { !isAdd || scheduling &&
      <>
        <Row>
          <DatePicker
            label="Person Start Date"
            disabled={!isAdd}
            value={form.calabrio_wfm.EmploymentStartDate || ""}
            onChange={(newValue) => {
              setForm({
                type: userFormActions.SET_WFM_EMP_START_DATE,
                payload: new Date(newValue).toLocaleDateString()
              })}
            } 
            renderInput={props => <TextField {...props} error={false} />}
          />
          <Dropdown
            disabled={!isAdd}
            error={false}
            label={"Team *"}
            styles={{
              width: "250px"
            }}
            options={generateDropdownOptionArray(getWfmTeams(state, form.calabrio_wfm.BusinessUnitId))}
            updateValue={(event: any, newValue: any) => setTeamFields({
              ...teamFields,
              id: newValue.value
            })}
            value={generateDropdownOption(getWfmTeams(state, form.calabrio_wfm.BusinessUnitId).find((t: any) => t.Id === teamFields.id))}
          />
          <DatePicker
            label="Team Start Date"
            disabled={!isAdd}
            value={teamFields.startDate}
            onChange={(newValue) => {
              setTeamFields({
                ...teamFields,
                startDate: new Date(newValue).toLocaleDateString()
              })}
            } 
            renderInput={props => <TextField {...props} error={false} />}
          />
        </Row>
        <Row>
          <Dropdown
            disabled={!isAdd}
            label="Absence"
            options={generateDropdownOptionArray(optionsByBusinessUnit["Absences"])}
            value={optionsByBusinessUnit["Absences"].find((a: any) => a.value === form.calabrio_wfm.AbsenceId)}
            updateValue={(event: any, newValue: any) => setForm({
              type: userFormActions.SET_WFM_ABSENCE,
              payload: newValue
            })}
            styles={{ width: "250px" }}
          />
          <Dropdown
            disabled={!isAdd}
            label="Budget Group"
            options={generateDropdownOptionArray(optionsByBusinessUnit["Budget_Groups"])}
            value={generateDropdownOptionArray(optionsByBusinessUnit["Budget_Groups"]?.find((bg: any) => bg.value === form.calabrio_qm.timezone))}
            updateValue={(event: any, newValue: any) => setForm({
              type: userFormActions.SET_WFM_BUDGET_GROUP,
              payload: newValue
            })}
            styles={{ width: "250px" }}
          />
          <Dropdown
            disabled={!isAdd}
            label="Part Time Percentage"
            options={generateDropdownOptionArray(optionsByBusinessUnit["Part_Time_Percentages"])}
            value={optionsByBusinessUnit["Part_Time_Percentages"].find((ptp: any) => ptp.value === form.calabrio_wfm.PartTimePercentageId)}
            updateValue={(event: any, newValue: any) => setForm({
              type: userFormActions.SET_WFM_PART_TIME_PERCENTAGE,
              payload: newValue
            })}
            styles={{ width: "250px" }}
          />
        </Row>
        <Row>
          <Dropdown
            disabled={!isAdd}
            label="Contract Schedule"
            options={generateDropdownOptionArray(optionsByBusinessUnit["Contract_Schedules"])}
            value={optionsByBusinessUnit["Contract_Schedules"].find((cs: any) => cs.value === form.calabrio_wfm.ContractScheduleId)}
            updateValue={(event: any, newValue: any) => setForm({
              type: userFormActions.SET_WFM_CONTRACT_SCHEDULE,
              payload: newValue
            })}
            styles={{ width: "250px" }}
          />
          <Dropdown
            disabled={!isAdd}
            label="Contract"
            options={generateDropdownOptionArray(optionsByBusinessUnit["Contracts"])}
            value={optionsByBusinessUnit["Contracts"].find((c: any) => c.value === form.calabrio_wfm.ContractId)}
            updateValue={(event: any, newValue: any) => setForm({
              type: userFormActions.SET_WFM_CONTRACT,
              payload: newValue
            })}
            styles={{ width: "250px" }}
          />
          <Dropdown
            disabled={!isAdd}
            label="Shift Bag"
            options={generateDropdownOptionArray(optionsByBusinessUnit["Shift_Bags"])}
            value={optionsByBusinessUnit["Shift_Bags"].find((sb: any) => sb.value === form.calabrio_wfm.ShiftBagId)}
            updateValue={(event: any, newValue: any) => setForm({
              type: userFormActions.SET_WFM_SHIFT_BAG,
              payload: newValue
            })}
            styles={{ width: "250px" }}
          />
        </Row>
      </>
      }
      </>
      : <WFMLoadRetryModal handleClose={() => {}}/>}
      </LocalizationProvider>
    </Wrapper>
  )
}

export default WfmForm;