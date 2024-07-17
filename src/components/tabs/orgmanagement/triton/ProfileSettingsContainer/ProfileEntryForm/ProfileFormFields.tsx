import React from "react";
import {
  formModes, numMatcher
} from "globals";
import {
  FlexColumn,
  FlexRow
} from "globals/interfaces";
import {
  FormControlsContainer,
  FormControlsPane,
  ToggleContainer
} from "./ProfileEntryForm.Styles";
import {
  FormControlLabel,
  Switch,
  Tooltip
} from "@mui/material";
import {
  profileEntryFormDispatch,
  profileEntryFormState,
  useAdminState,
  useSkillState
} from "context/appContext";
import { profileEntryFormActions } from "context/profileEntryFormReducer";
import { PhoneNumberInput } from "components/PhoneNumberInput";
import { CallTagFields } from "orgmanagement/CallTagFields";
import { toggleControls } from "utils/profileUtils";
import { formatDropdownOptions } from "utils/_formatUtils";
import { Dropdown } from "components/Dropdown";
import { CustomInput } from "components/CustomInput";
import { logger } from "utils/logger";

export const ProfileFormFields = () => {

  const form = profileEntryFormState();
  const setForm = profileEntryFormDispatch();

  const {
    operatingUnits,
    taskQueues,
    skills
  } = useSkillState();

  const {
    activities,
    screenpops,
    accessGroups
  } = useAdminState().profileContext;

  logger.log("PROFILE FORM", form);

  React.useEffect(() => {
    if(!form.updated){
      setForm({
        type: profileEntryFormActions.SET_FORM_FIELD,
        payload: {
          key: "updated",
          value: true
        }
      });
    }
  }, [form]);

  const styles = {
    width: "385px",
    margin: "5px 0"
  };

  const subStyles = {
    width: "300px",
    margin: "5px 0",
    alignSelf: "center"
  };
  const AccessGroupOption = ({ option }: any) => {
    return (
      <Tooltip title={option.viewable_profiles?.map((s: string) => <div key={s}>{s}</div>)}>
        <div style={{ width: "100%" }}>{option.label}</div>
      </Tooltip>
    );
  };

  return (
    <FormControlsContainer>
      <FlexColumn>
        <FlexRow>
          <FlexColumn style={{ alignItems: "center" }}>
            <FormControlsPane>
              <CustomInput
                disabled={form.formMode === formModes.UPDATE}
                label={"Profile Id *"}
                maxLength="3"
                styles={styles}
                name={form.profileId?.toString()}
                value={form.profileId?.toString()}
                updateValue={(value: any) => {
                  if(value?.match(numMatcher)){
                    setForm({
                      type: profileEntryFormActions.SET_FORM_FIELD,
                      payload: {
                        key: "profileId",
                        value: parseInt(value)
                      }
                    });
                  } }
                }
              />
              <CustomInput
                label={"Profile Name *"}
                maxLength="80"
                name={form.profileName}
                value={form.profileName}
                updateValue={(value: any) => setForm({
                  type: profileEntryFormActions.SET_FORM_FIELD,
                  payload: {
                    key: "profileName",
                    value
                  }
                })}
              />
              {
                <Dropdown
                  label="Operating Unit *"
                  disabled={form.formMode === formModes.UPDATE}
                  styles={styles}
                  value={formatDropdownOptions([form.operatingUnit], "ou_name", "ou_sid")[0]}
                  options={formatDropdownOptions(operatingUnits, "ou_name", "ou_sid")}
                  updateValue={(e:any, value: any) => setForm({
                    type: profileEntryFormActions.SET_FORM_FIELD,
                    payload: {
                      key: "operatingUnit",
                      value
                    }
                  })}
                />
              }
              <Dropdown
                label="Activities *"
                value={formatDropdownOptions(form.activitiesList, "activity_name", "activity_sid")}
                options={formatDropdownOptions(activities, "activity_name", "activity_sid")}
                multiple={true}
                updateValue={(e:any, values: any) => setForm({
                  type: profileEntryFormActions.SET_FORM_FIELD,
                  payload: {
                    key: "activitiesList",
                    value: values
                  }
                })}
                styles={styles}
              />
              <Dropdown
                label="Overflow Skill"
                value={formatDropdownOptions([form.overflowSkill], "name", "name")[0]}
                error={form.overflowSkill?.error}
                options={formatDropdownOptions(skills, "name", "name")}
                updateValue={(e:any, value: any) => setForm({
                  type: profileEntryFormActions.SET_FORM_FIELD,
                  payload: {
                    key: "overflowSkill",
                    value: value
                  }
                })}
                styles={styles}
              />
              <Dropdown
                label="Transfer Queues"
                value={formatDropdownOptions(form.transferQueues, "friendly_name", "sid")}
                options={formatDropdownOptions(taskQueues, "friendly_name", "sid")}
                multiple={true}
                updateValue={(e:any, values: any) => setForm({
                  type: profileEntryFormActions.SET_FORM_FIELD,
                  payload: {
                    key: "transferQueues",
                    value: values
                  }
                })}
                styles={styles}
              />
              <Dropdown
                label="Screenpops"
                styles={styles}
                value={formatDropdownOptions(form.screenpops, "display_name", "id")}
                options={formatDropdownOptions(screenpops, "display_name", "id")}
                multiple={true}
                updateValue={(e:any, values: any) => setForm({
                  type: profileEntryFormActions.SET_FORM_FIELD,
                  payload: {
                    key: "screenpops",
                    value: values
                  }
                })}
              />
              <Dropdown
                label="Access Group"
                styles={styles}
                CustomRender={AccessGroupOption}
                options={[
                  {
                    label: "Create New Access Group",
                    value: "create-new"
                  },
                  {
                    label: "divider",
                    value: "divider"
                  },
                  ...formatDropdownOptions(accessGroups, "access_group_name", "id")
                ]}
                value={formatDropdownOptions([form.accessGroup], "access_group_name", "id")[0] || ""}
                updateValue={(e:any, value: any) => {
                  if(value?.value === "create-new"){
                    setForm({
                      type: profileEntryFormActions.SET_FORM_FIELD,
                      payload: {
                        key: "accessGroup",
                        value: {
                          isNew: true,
                          access_group_name: "",
                          id: "create-new"
                        }
                      }
                    });
                  } else {
                    setForm({
                      type: profileEntryFormActions.SET_FORM_FIELD,
                      payload: {
                        key: "accessGroup",
                        value: value
                      }
                    });
                  }
                }}
              />
              {form.accessGroup?.isNew &&
                <>
                  <CustomInput
                    label={"New Access Group Name *"}
                    name={"New Access Group Name *"}
                    error={!form.accessGroup?.access_group_name}
                    maxLength="80"
                    styles={subStyles}
                    value={form.accessGroup?.access_group_name}
                    updateValue={value => {
                      setForm({
                        type: profileEntryFormActions.SET_FORM_FIELD,
                        payload: {
                          key: "accessGroup",
                          value: {
                            ...form.accessGroup,
                            access_group_name: value
                          }
                        }
                      });
                    }}
                  />
                  <CustomInput
                    styles={subStyles}
                    label={"Twilio Dashboard Url *"}
                    name={"Twilio Dashboard Url *"}
                    error={!form.accessGroup?.twilio_dashboard_url}
                    value={form.accessGroup?.twilio_dashboard_url}
                    updateValue={value => {
                      setForm({
                        type: profileEntryFormActions.SET_FORM_FIELD,
                        payload: {
                          key: "accessGroup",
                          value: {
                            ...form.accessGroup,
                            twilio_dashboard_url: value
                          }
                        }
                      });
                    }}
                  />
                </>
              }
              <PhoneNumberInput
                allowSevenDigitVdn={false}
                id="forward-to-num"
                style={styles}
                number={form.forwardToNum?.value}
                label="Forward To Number"
                updateValue={(maskedValue: string, unmaskedValue: string, isValid: boolean, e164Number: string) => {
                  setForm({
                    type: profileEntryFormActions.SET_FORM_FIELD,
                    payload: {
                      key: "forwardToNum",
                      value: {
                        value: maskedValue,
                        unmaskedValue,
                        valid: isValid,
                        e164Number
                      }
                    }
                  });
                }}
              />
            </FormControlsPane>
          </FlexColumn>
          <FlexColumn>
            {
              toggleControls.map((control, index) => (
                <ToggleContainer key={index}>
                  <FormControlLabel
                    label={control.label}
                    labelPlacement="end"
                    control={<Switch
                      inputProps={{ "aria-label": "toggle-zero-out" }}
                      checked={form[control.fieldKey]}
                      onChange={() => setForm({
                        type: profileEntryFormActions.SET_FORM_FIELD,
                        payload: {
                          key: control.fieldKey,
                          value: !form[control.fieldKey]
                        }
                      })}
                    />} />
                </ToggleContainer>
              ))
            }
            <Tooltip title={"Self service indicator is applicable to profiles with an id of 39 and above, but is actually set at the worker attribute level"}>
              <ToggleContainer>
                <FormControlLabel
                  label={"Self Service Indicator"}
                  labelPlacement="end"
                  control={<Switch
                    inputProps={{ "aria-label": "toggle-zero-out" }}
                    checked={form.profileId >= 39}
                    disabled={true} />} />
              </ToggleContainer>
            </Tooltip>
          </FlexColumn>
        </FlexRow>
        { form.acwDataEntry &&
          <CallTagFields/>
        }
      </FlexColumn>
    </FormControlsContainer>
  );
};