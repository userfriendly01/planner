import React from "react";
import { ProfileActivitiesSelectFieldProps } from "./ProfileEntryForm.Interfaces";
import {
  IconButtonWrapper,
  ProfileControlWrapper,
  ProfileRow,
  ProfileRowItem,
  ProfileRowSeperator,
  Label,
  ProfileWrapper
} from "./ProfileEntryForm.Styles";
import { Dropdown } from "components";
import {
  Add,
  Delete
} from "@mui/icons-material";
import {
  Activity,
  apiPaths
} from "globals";
import { Tooltip } from "@mui/material";
import { myAxios } from "utils";

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

const ProfileActivitiesSelectField = (props: ProfileActivitiesSelectFieldProps) => {
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
        .catch(error => console.error(error.msg));
    }
  }, []);

  const profileActivitiesForDropDown = activities.filter(activity => {
    return !activitiesList.find(item => {
      return item.activity_id === activity.activity_id;
    });
  });

  const newProfileActivityChanged = (profileActivity: Array<{
    [index: string]: any,
    value: number
  }>) => {
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
    return optionsList.map(option => ({
      value: option.activity_id,
      label: option.activity_nme
    }));
  };

  return (
    <ProfileControlWrapper>
      <Label>Add Activities</Label>
      <ProfileRow>
        <ProfileRowItem>
          <Dropdown
            styles={{
              "max-width": "380px"
            }}
            options={getDropDownOptions(profileActivitiesForDropDown)}
            multiple={true}
            value={getDropDownOptions(newProfileActivity)}
            updateValue={(event: any, newInputValue: Array<{ [index: string]: any; value: number; }>) => newProfileActivityChanged(newInputValue)}
          />
        </ProfileRowItem>
        <ProfileRowItem>
          <IconButtonWrapper disabled={!newProfileActivity.length} onClick={addProfileActivityClicked} data-testid="add-profileActivity-button">
            <Add fontSize={"inherit"}/>
          </IconButtonWrapper>
        </ProfileRowItem>
      </ProfileRow>
      <ProfileRowSeperator/>
      <ProfileWrapper>
        {activitiesList.map((activity: Activity, index: number) => {
          return (
            // @ts-ignore
            <ProfileRow highlightOnHover={true} key={`activity-row-${index}`}>
              <Tooltip
                title={activity.available_i.data[0]? "Available": "Unavailable"}
                placement={"bottom"}
              >
                <ProfileRowItem>{activity.activity_nme}</ProfileRowItem>
              </Tooltip>
              <ProfileRowItem>
                <IconButtonWrapper onClick={() => removeProfileActivityClicked(activity)} data-testid="delete-activity-button">
                  <Delete fontSize="inherit"/>
                </IconButtonWrapper>
              </ProfileRowItem>
            </ProfileRow>
          );
        })}
      </ProfileWrapper>
    </ProfileControlWrapper>
  );
};

export default ProfileActivitiesSelectField;