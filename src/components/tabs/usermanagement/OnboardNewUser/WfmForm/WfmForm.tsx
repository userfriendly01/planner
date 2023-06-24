import React from "react";
import {
  OptionalColumnRow,
  Row,
  Wrapper
} from "./WfmForm.Styles";
import {
  Dropdown,
  ModalFetchingRing
} from "components";
import {
  userFormActions,
  useFormState,
  useFormDispatch,
  useAdminState,
  useAdminDispatch
} from "context";
import {
  InputAdornment,
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
  WfmBusinessUnit,
  formModes,
  ModalOverlayStatuses
} from "globals";
import {
  daysOfTheWeekOptions,
  getWfmBusinessUnits,
  getWfmTeams,
  getWfmOptions,
  isUnpopulatedField,
  getCalabrioWfmOrg
} from "utils";

interface WfmFormProps {
  missingFields: string[]
}

const WfmForm = (props: WfmFormProps) => {
  const state = useAdminState();
  const dispatch = useAdminDispatch();
  const form = useFormState();
  const setForm = useFormDispatch();
  const [ status, setStatus ] = React.useState(null);
  const {
    missingFields
  } = props;
  const isAdd = form.formMode === formModes.INSERT || form.calabrio_wfm.Id === null;
  const [ optionsByBusinessUnit, setOptionsByBusinessUnit ] = React.useState<any>({});
  
  const [ availabilityFields, setAvailabilityFields ] = React.useState({
    id: null,
    startDate: null
  });
  const [ teamFields, setTeamFields ] = React.useState({
    id: null,
    startDate: null
  });
  const [ skillFields, setSkillFields ] = React.useState({
    skills: [],
    startDate: null
  });
  const [ rotationFields, setRotationFields ] = React.useState({
    id: null,
    startDate: null,
    startWeek: null
  });
  const [ optionalColumns, setOptionalColumns ] = React.useState(form.calabrio_wfm.OptionalColumns);

  const scheduleFields = {
    personStartDate: form.calabrio_wfm.EmploymentStartDate,
    teamId: teamFields.id,
    teamStartDate: teamFields.startDate,
    contractId: form.calabrio_wfm.ContractId,
    contractScheduleId: form.calabrio_wfm.ContractScheduleId,
    partTimePercentageId: form.calabrio_wfm.PartTimePercentageId
  };

  React.useEffect(() => {
    if(!isAdd){
      setTeamFields({
        id: form.calabrio_wfm.TeamId,
        startDate: isUnpopulatedField(form.calabrio_wfm.TeamId) ? null : "NA"
      });
      setSkillFields({
        skills: form.calabrio_wfm.PersonSkills,
        startDate: isUnpopulatedField(form.calabrio_wfm.PersonSkills) ? null : "NA"
      });
      // Rotation & Availability fields arent returned from the get People endpoint
    }
  }, []);

  React.useEffect(() => {
    const trimmedOptions = getWfmOptions(state, form.calabrio_wfm.BusinessUnitId);
    setOptionsByBusinessUnit(trimmedOptions);
  }, [form.calabrio_wfm.BusinessUnitId]);

  React.useEffect(() => {
    let validOptionalColumns: any[] = [];

    optionalColumns.forEach((c:any) => {
      if(c.columnValue && c.columnValue.length > 0){
        validOptionalColumns.push(c);
      }
    });
    if(JSON.stringify(validOptionalColumns) !== JSON.stringify(form.calabrio_wfm.OptionalColumns)){
      setForm({
        type: userFormActions.SET_WFM_OPTIONAL_COLUMNS,
        payload: validOptionalColumns.map((o:any) => {
          return {
            Id: o.Id,
            Value: o.columnValue
          }
        })
      });
    }
  }, [optionalColumns]);

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
          id: "",
          startDate: null
        }
      });
    }
  }, [availabilityFields]);

  React.useEffect(() => {
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
        value: option.Id || option,
        label: option.Name || option.toString(),
        ...option
      }
    } else {
      return ""
    }
  };

  const requiredFieldMissing = (field: string, fields: any) => {
    let populatedFields = false;
    let fieldMissing = false;
    Object.keys(fields).forEach((key: any) => {
      if(key === field && (!fields[key] || fields[key].length === 0)){
        fieldMissing = true;
      } else if(typeof fields[key] === "number" || fields[key]?.length > 0){
        populatedFields = true
      }
    });
    return populatedFields && fieldMissing;
  };

  return (
    <Wrapper>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Row>
        <Dropdown
          disabled={!isAdd}
          error={missingFields.some((f:string) => f === "BusinessUnitId") && isUnpopulatedField(form.calabrio_wfm.BusinessUnitId)}
          label={"Business Unit *"}
          styles={{
            width: "250px",
            margin: "0px 5px"
          }}
          options={generateDropdownOptionArray(getWfmBusinessUnits(state))}
          updateValue={async (event: any, newValue: any) => {
            try {
              setStatus(ModalOverlayStatuses.SAVING)
              setForm({
                type: userFormActions.SET_WFM_BUSINESS_UNIT,
                payload: newValue?.value || null
              })
              await getCalabrioWfmOrg(newValue.value, state, dispatch);
              setStatus(ModalOverlayStatuses.SUCCESS)
            } catch(err) {
              setStatus(ModalOverlayStatuses.FAIL)
            }
          }}
          value={generateDropdownOption(getWfmBusinessUnits(state)?.find((bu: any) => bu.Id === form.calabrio_wfm.BusinessUnitId))}
        />
      </Row>
      { status === ModalOverlayStatuses.SAVING && <ModalFetchingRing/> }
      { status === ModalOverlayStatuses.FAIL || state.calabrioContext.wfmOptions.length === 0 && <>Business Unit Data failed to load</>}
      { form.calabrio_wfm.BusinessUnitId && 
        status === ModalOverlayStatuses.SUCCESS && 
        state.calabrioContext.wfmOptions.length > 0 &&
      <>
        <Row>
          <Dropdown
            disabled={!isAdd}
            error={requiredFieldMissing("id", teamFields) || (missingFields.some((f:string) => f === "TeamId") && isUnpopulatedField(form.calabrio_wfm.TeamId))}
            label={"Team"}
            styles={{
              width: "250px"
            }}
            options={generateDropdownOptionArray(getWfmTeams(state, form.calabrio_wfm.BusinessUnitId))}
            updateValue={(event: any, newValue: any) => setTeamFields({
              ...teamFields,
              id: newValue?.value || null
            })}
            value={generateDropdownOption(getWfmTeams(state, form.calabrio_wfm.BusinessUnitId).find((t: any) => t.Id === teamFields.id))}
          />
          { isAdd && 
            <DatePicker
              label="Team Start Date"
              disabled={!isAdd}
              value={teamFields.startDate}
              onChange={(newValue) => {
                setTeamFields({
                  ...teamFields,
                  startDate: newValue ? new Date(newValue).toISOString().split('T')[0] : newValue
                })}
              } 
              renderInput={props => <TextField {...props}
                error={requiredFieldMissing("startDate", teamFields) || (missingFields.some((f:string) => f === "TeamStartDate") && isUnpopulatedField(form.calabrio_wfm.TeamStartDate))}
              />}
            />
          }
        </Row>
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
                  edge="end"
                  onClick={() => 
                    setForm({
                      type: userFormActions.SET_WFM_IDENTITY,
                      payload: form.nNumber.nNumberFetchedUser?.email
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
            error={missingFields.some((f:string) => f === "FirstDayOfWeek") && isUnpopulatedField(form.calabrio_wfm.FirstDayOfWeek)}
            label={"First Day of the Week *"}
            styles={{
              width: "250px",
              margin: "0px 5px"
            }}
            options={daysOfTheWeekOptions}
            updateValue={(event: any, newValue: any) => setForm({
              type: userFormActions.SET_WFM_FIRST_DAY_OF_WEEK,
              payload: newValue?.value || null
            })}
            value={daysOfTheWeekOptions.find((op: any) => op.value === form.calabrio_wfm.FirstDayOfWeek)}
          />
          <DatePicker
            label="Person Start Date"
            disabled={!isAdd}
            value={form.calabrio_wfm.EmploymentStartDate || ""}
            onChange={(newValue) => {
              setForm({
                type: userFormActions.SET_WFM_EMP_START_DATE,
                payload: newValue ? new Date(newValue).toISOString().split('T')[0] : newValue
              })}
            } 
            renderInput={props => <TextField {...props}
              error={requiredFieldMissing("personStartDate", scheduleFields) || (missingFields.some((f:string) => f === "EmploymentStartDate") && isUnpopulatedField(form.calabrio_wfm.EmploymentStartDate))}
            />}
          />
        </Row>
        <Row>
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
          <Dropdown
            disabled={!isAdd}
            multiple={true}
            error={requiredFieldMissing("skills", skillFields) || (missingFields.some((f:string) => f === "PersonSkills") && isUnpopulatedField(form.calabrio_wfm.PersonSkills))}
            label="Skills"
            options={generateDropdownOptionArray(optionsByBusinessUnit["Skills"])}
            value={generateDropdownOptionArray(skillFields.skills)}
            updateValue={(event: any, options: any) => setSkillFields({
              ...skillFields,
              skills: options
            })}
            styles={{ width: "250px" }}
          />
          { isAdd &&
            <DatePicker
              disabled={!isAdd}
              label="Skills Start Date"
              value={skillFields.startDate || ""}
              onChange={(newValue) => {
                setSkillFields({
                  ...skillFields,
                  startDate: newValue ? new Date(newValue).toISOString().split('T')[0] : newValue
                })}
              } 
              renderInput={props => <TextField {...props}
                error={requiredFieldMissing("startDate", skillFields) || (missingFields.some((f:string) => f === "SkillsStartDate") && isUnpopulatedField(form.calabrio_wfm.SkillsStartDate))}
              />}
            />
          }
        </Row>
        <Row>
        <Dropdown
            disabled={!isAdd}
            label="Workflow Control Set"
            options={generateDropdownOptionArray(optionsByBusinessUnit["Workflow_Control_Sets"])}
            value={generateDropdownOption(optionsByBusinessUnit["Workflow_Control_Sets"]?.find((wcs: any) => wcs.Id === form.calabrio_wfm.WorkflowControlSetId))}
            updateValue={(event: any, newValue: any) => setForm({
              type: userFormActions.SET_WFM_CONTROL_SET,
              payload: newValue?.value || null
            })}
            styles={{ width: "250px" }}
          />
          <Dropdown
            disabled={!isAdd}
            multiple={true}
            label="Optional Columns"
            options={generateDropdownOptionArray(optionsByBusinessUnit["Optional_Columns"])}
            value={generateDropdownOptionArray(optionalColumns)}
            updateValue={(event: any, options: any) => {
              const newOptionalColumns = options.map((o:any) => {
                const columnExists = optionalColumns.find((c:any) => c.value === o.value);
                if(columnExists){
                  return o;
                } else {
                  return {
                    ...o,
                    columnValue: ""
                  }
                }
              });
              setOptionalColumns(newOptionalColumns);
            }}
            styles={{ width: "500px" }}
          />
        </Row>
        <OptionalColumnRow>
          { optionalColumns.map(c => (
              <TextField
                disabled={!isAdd}
                error={!c.columnValue || c.columnValue === ""}
                label={`${c.Name} value *`}
                value={c.columnValue || ""}
                onChange={(event: any) => {
                  const newOptionalColumns = optionalColumns.map((o: any) => {
                    if(o.Id === c.Id){
                      return {
                        ...o,
                        columnValue: event.target.value
                      }
                    } else { return o; }
                  });
                  setOptionalColumns(newOptionalColumns);
                }}
                sx={{
                  width: "250px",
                  margin: "5px 5px"
                }}
              />
            ))}
        </OptionalColumnRow>
        <Row>
          Schedule Fields
        </Row>
        <Row>
          <Dropdown
            disabled={!isAdd}
            label="Budget Group"
            options={generateDropdownOptionArray(optionsByBusinessUnit["Budget_Groups"])}
            value={generateDropdownOption(optionsByBusinessUnit["Budget_Groups"]?.find((bg: any) => bg.Id === form.calabrio_wfm.BudgetGroupId))}
            updateValue={(event: any, newValue: any) => setForm({
              type: userFormActions.SET_WFM_BUDGET_GROUP,
              payload: newValue?.value || null
            })}
            styles={{ width: "375px" }}
          />
          <Dropdown
            disabled={!isAdd}
            label="Part Time Percentage"
            error={requiredFieldMissing("partTimePercentageId", scheduleFields) || (missingFields.some((f:string) => f === "PartTimePercentageId") && isUnpopulatedField(form.calabrio_wfm.PartTimePercentageId))}
            options={generateDropdownOptionArray(optionsByBusinessUnit["Part_Time_Percentages"])}
            value={generateDropdownOption(optionsByBusinessUnit["Part_Time_Percentages"]?.find((ptp: any) => ptp.Id === form.calabrio_wfm.PartTimePercentageId))}
            updateValue={(event: any, newValue: any) => setForm({
              type: userFormActions.SET_WFM_PART_TIME_PERCENTAGE,
              payload: newValue?.value || null
            })}
            styles={{ width: "375px" }}
          />
        </Row>
        <Row>
          <Dropdown
            disabled={!isAdd}
            label="Contract Schedule"
            error={requiredFieldMissing("contractScheduleId", scheduleFields) || (missingFields.some((f:string) => f === "ContractScheduleId") && isUnpopulatedField(form.calabrio_wfm.ContractScheduleId))}
            options={generateDropdownOptionArray(optionsByBusinessUnit["Contract_Schedules"])}
            value={generateDropdownOption(optionsByBusinessUnit["Contract_Schedules"]?.find((cs: any) => cs.Id === form.calabrio_wfm.ContractScheduleId))}
            updateValue={(event: any, newValue: any) => setForm({
              type: userFormActions.SET_WFM_CONTRACT_SCHEDULE,
              payload: newValue?.value || null
            })}
            styles={{ width: "250px" }}
          />
          <Dropdown
            disabled={!isAdd}
            error={requiredFieldMissing("contractId", scheduleFields) || (missingFields.some((f:string) => f === "ContractId") && isUnpopulatedField(form.calabrio_wfm.ContractId))}
            label="Contract"
            options={generateDropdownOptionArray(optionsByBusinessUnit["Contracts"])}
            value={generateDropdownOption(optionsByBusinessUnit["Contracts"]?.find((c: any) => c.Id === form.calabrio_wfm.ContractId))}
            updateValue={(event: any, newValue: any) => setForm({
              type: userFormActions.SET_WFM_CONTRACT,
              payload: newValue?.value || null
            })}
            styles={{ width: "250px" }}
          />
          <Dropdown
            disabled={!isAdd}
            label="Shift Bag"
            options={generateDropdownOptionArray(optionsByBusinessUnit["Shift_Bags"])}
            value={generateDropdownOption(optionsByBusinessUnit["Shift_Bags"]?.find((sb: any) => sb.Id === form.calabrio_wfm.ShiftBagId))}
            updateValue={(event: any, newValue: any) => setForm({
              type: userFormActions.SET_WFM_SHIFT_BAG,
              payload: newValue?.value || null
            })}
            styles={{ width: "250px" }}
          />
        </Row>
        { isAdd && 
          <>
            <Row>
            <Dropdown
                disabled={!isAdd}
                label="Rotation"
                error={requiredFieldMissing("id", rotationFields) || (missingFields.some((f:string) => f === "RotationId") && isUnpopulatedField(form.calabrio_wfm.RotationId))}
                options={generateDropdownOptionArray(optionsByBusinessUnit["Rotations"])}
                value={generateDropdownOption(optionsByBusinessUnit["Rotations"]?.find((r: any) => r.Id === rotationFields.id))}
                updateValue={(event: any, newValue: any) => setRotationFields({
                  ...rotationFields,
                  id: newValue?.value || null
                })}
                styles={{ width: "250px" }}
              />
              <DatePicker
                disabled={!isAdd}
                label="Rotation Start Date"
                value={rotationFields.startDate}
                onChange={(newValue) => {
                  setRotationFields({
                    ...rotationFields,
                    startDate: newValue ? new Date(newValue).toISOString().split('T')[0] : newValue
                  })}
                } 
                renderInput={props => <TextField {...props}
                  error={requiredFieldMissing("startDate", rotationFields) || (missingFields.some((f:string) => f === "RotationStartDate") && isUnpopulatedField(form.calabrio_wfm.RotationStartDate))}
                />}
              />
              <Dropdown
                disabled={!isAdd}
                error={requiredFieldMissing("startWeek", rotationFields) || (missingFields.some((f:string) => f === "RotationStartWeek") && isUnpopulatedField(form.calabrio_wfm.RotationStartWeek))}
                label={"Rotation Start Week"}
                styles={{
                  width: "250px",
                  margin: "0px 5px"
                }}
                options={generateDropdownOptionArray([1,2,3,4,5])}
                updateValue={(event: any, newValue: any) => setRotationFields({
                  ...rotationFields,
                  startWeek: newValue?.value
                })}
                value={generateDropdownOption(rotationFields.startWeek)}
              />
            </Row>
            <Row>
              <Dropdown
                disabled={!isAdd}
                label="Availability"
                error={requiredFieldMissing("id", availabilityFields) || (missingFields.some((f:string) => f === "AvailabilityId") && isUnpopulatedField(form.calabrio_wfm.AvailabilityId))}
                options={generateDropdownOptionArray(optionsByBusinessUnit["Availabilities"])}
                value={generateDropdownOption(optionsByBusinessUnit["Availabilities"]?.find((a: any) => a.Id === availabilityFields.id))}
                updateValue={(event: any, newValue: any) => setAvailabilityFields({
                  ...availabilityFields,
                  id: newValue?.value || null
                })}
                styles={{ width: "250px" }}
              />
              <DatePicker
                disabled={!isAdd}
                label="Availability Start Date"
                value={availabilityFields.startDate}
                onChange={(newValue) => setAvailabilityFields({
                    ...availabilityFields,
                    startDate: newValue ? new Date(newValue).toISOString().split('T')[0] : newValue
                  })
                }
                renderInput={props => <TextField {...props}
                  error={requiredFieldMissing("startDate", availabilityFields) || (missingFields.some((f:string) => f === "AvailabilityStartDate") && isUnpopulatedField(form.calabrio_wfm.AvailabilityStartDate))}
                />}
              />
            </Row>
          </>
        }
      </>
      }
      </LocalizationProvider>
    </Wrapper>
  )
}

export default WfmForm;