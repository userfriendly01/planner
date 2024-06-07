import React from "react";
import { ProfileActivitiesSelectFieldProps } from "./ProfileEntryForm.Interfaces";
import {
  IconButtonWrapper,
  ProfileDropdownControlWrapper,
  ProfileDropdownRow,
  ProfileDropdownRowItem,
  ProfileDropdownRowSeperator,
  Label,
  ProfileDropdownWrapper
} from "./ProfileEntryForm.Styles";
import { Dropdown } from "components/Dropdown";
import {
  Add,
  Delete
} from "@mui/icons-material";
import { apiPaths } from "globals/index";
import { Activity } from "globals/interfaces";
import { Tooltip } from "@mui/material";
import { logger } from "utils/logger";
import { myAxios } from "utils/myAxios";
import { sortActivityByName } from "utils/_sortUtils";

const getActivities = () => new Promise((resolve, reject) => myAxios.get(apiPaths.GET_ACTIVITIES)
  .then(res => {
    resolve(res.data);
  })
  .catch(error => {
    reject({
      msg: "Failed to fetch activities from service",
      error
    });
  })
);

export const ProfileActivitiesSelectField = (props: ProfileActivitiesSelectFieldProps) => {
  const {
    activitiesList,
    setActivitiesList
  } = props;

  const defaultNewActivity: Activity[] = [];
  const [newProfileActivity, setNewProfileActivity] = React.useState<Activity[]>(defaultNewActivity);
  const [activities, setActivities] = React.useState([]);

  React.useEffect(() => {
    if(!activities.length) {
      getActivities()
        .then((allActivities: Activity[]) => {
          setActivities(allActivities);
        })
        .catch(error => logger.error(error.msg, { error }, false));
    }
  }, []);

  const profileActivitiesForDropDown = activities.filter(activity => {
    return !activitiesList.find(item => {
      return item.activity_id === activity.activity_id;
    });
  });

  const newProfileActivityChanged = (profileActivity: Array<{[index: string]: any, value: number}>) => {
    const selectedActivities = profileActivity.map(selectedActivity => activities.find(activity => selectedActivity.value === activity.activity_id));
    setNewProfileActivity(selectedActivities);
  };

  const addProfileActivityClicked = () => {
    const updatedActivitiesList = [ ...activitiesList, ...newProfileActivity ];
    setActivitiesList(updatedActivitiesList);
    setNewProfileActivity(defaultNewActivity);
  };

  const removeProfileActivityClicked = (activityToBeRemoved: Activity) => {
    const updatedActivitiesList = activitiesList.filter(activity => activity.activity_id !== activityToBeRemoved.activity_id);
    setActivitiesList(updatedActivitiesList);
  };

  const getDropDownOptions = (optionsList: Activity[]) => {
    return optionsList.sort(sortActivityByName).map(option => ({
      value: option.activity_id,
      label: option.activity_nme
    }));
  };

  return (
    <ProfileDropdownControlWrapper>
      <Label>Add Activities *</Label>
      <ProfileDropdownRow>
        <ProfileDropdownRowItem>
          <Dropdown
            styles={{
              "max-width": "380px"
            }}
            options={getDropDownOptions(profileActivitiesForDropDown)}
            multiple={true}
            value={getDropDownOptions(newProfileActivity)}
            updateValue={(event: any, newInputValue: Array<{ [index: string]: any; value: number; }>) => newProfileActivityChanged(newInputValue)}
          />
        </ProfileDropdownRowItem>
        <ProfileDropdownRowItem>
          <IconButtonWrapper disabled={!newProfileActivity.length} onClick={addProfileActivityClicked} data-testid="add-profileActivity-button">
            <Add fontSize={"inherit"}/>
          </IconButtonWrapper>
        </ProfileDropdownRowItem>
      </ProfileDropdownRow>
      <ProfileDropdownRowSeperator/>
      <ProfileDropdownWrapper>
        {activitiesList.map((activity: Activity, index: number) => {
          return (
            // @ts-ignore
            <ProfileDropdownRow highlightOnHover={true} key={`activity-row-${index}`}>
              <Tooltip
                title={activity.available_i.data[0]? "Available": "Unavailable"}
                placement={"bottom"}
              >
                <ProfileDropdownRowItem>{activity.activity_nme}</ProfileDropdownRowItem>
              </Tooltip>
              <ProfileDropdownRowItem>
                <IconButtonWrapper onClick={() => removeProfileActivityClicked(activity)} data-testid="delete-activity-button">
                  <Delete fontSize="inherit"/>
                </IconButtonWrapper>
              </ProfileDropdownRowItem>
            </ProfileDropdownRow>
          );
        })}
      </ProfileDropdownWrapper>
    </ProfileDropdownControlWrapper>
  );
};