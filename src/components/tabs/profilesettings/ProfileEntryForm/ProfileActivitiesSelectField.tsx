import React, { useState } from "react";
import {
  ProfileActivitiesSelectFieldProps
} from "./ProfileEntryForm.Interfaces";
import {
  IconButtonWrapper,
  ProfileActivitiesControlWrapper,
  ProfileActivityRow,
  ProfileActivityRowItem,
  ProfileActivityRowSeperator,
  Label,
  ProfileActivitiesWrapper
} from "./ProfileEntryForm.Styles";
import {
  Dropdown
} from "components";
import {
  Add,
  Delete
} from "@mui/icons-material";
import {
  useAdminState,
  useAdminDispatch
} from "context";
import {
  Activity,
  apiPaths
} from "globals";
import { Tooltip } from "@mui/material";
import { myAxios } from "utils";

const getActivities = (dispatch: any) => new Promise((resolve, reject) => myAxios.get(apiPaths.GET_ACTIVITIES)
  .then(res => {
    dispatch({
      type: "loadActivities",
      payload: res.data
    });
    resolve(true);
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

  const dispatch = useAdminDispatch();

  React.useEffect(() => {
    getActivities(dispatch).catch(error => console.error(error.msg));
  }, []);

  const activities = useAdminState().activitiesContext.activities;
  const profileActivitiesForDropDown = activities.filter(activity => !activitiesList.includes(activity)); //profileActivitiesList.filter((profileActivityObj: ProfileActivity) => !profileActivitiesList.skills.includes(skillObj.name));

  const defaultNewActivity: Activity = {
    activity_id: null,
    activity_nme: "",
    available_i: null
  };
  const [newProfileActivity, setNewProfileActivity] = useState<Activity>(defaultNewActivity);
  const newProfileActivityChanged = (profileActivity: {
    [index: string]: any,
    value: number
  }) => {
    const activity = activities.find(activity => activity.activity_id === profileActivity.value);
    setNewProfileActivity(activity);
  };

  const addProfileActivityClicked = () => {
    const updatedActivitiesList = [ ...activitiesList ];
    updatedActivitiesList.push(newProfileActivity);
    setActivitiesList(updatedActivitiesList);
    setNewProfileActivity(defaultNewActivity);
  };

  const removeProfileActivityClicked = (activityToBeRemoved: Activity) => {
    const updatedActivitiesList = activitiesList.filter(activity => activity.activity_id!==activityToBeRemoved.activity_id);
    setActivitiesList(updatedActivitiesList);
  };

  const getDropDownOptions = (optionsList: Activity[]) => {
    return optionsList.map(option => ({
      value: option.activity_id,
      label: option.activity_nme
    }));
  };

  return (
    <ProfileActivitiesControlWrapper>
      <Label>Add Activities</Label>
      <ProfileActivityRow>
        <ProfileActivityRowItem>
          <Dropdown
            styles={{
              small: true,
              height: "40px",
              width: "180px"
            }}
            options={getDropDownOptions(profileActivitiesForDropDown)}
            value={{
              label: newProfileActivity.activity_nme,
              value: newProfileActivity.activity_id
            }}
            updateValue={(event: any, newInputValue: { [index: string]: any; value: number; }) => newProfileActivityChanged(newInputValue)}
          />
        </ProfileActivityRowItem>
        <ProfileActivityRowItem>
          <IconButtonWrapper disabled={ newProfileActivity.activity_nme === "" } onClick={addProfileActivityClicked} data-testid="add-profileActivity-button">
            <Add fontSize={"inherit"}/>
          </IconButtonWrapper>
        </ProfileActivityRowItem>
      </ProfileActivityRow>
      <ProfileActivityRowSeperator/>
      <ProfileActivitiesWrapper>
        {activitiesList.map((activity: Activity, index: number) => {
          return (
            // @ts-ignore
            <ProfileActivityRow highlightOnHover={true} key={`activity-row-${index}`}>
              <Tooltip
                title={activity.available_i.data[0]?"Available":"Unavailable"}
                placement={"bottom"}
              >
                <ProfileActivityRowItem>{activity.activity_nme}</ProfileActivityRowItem>
              </Tooltip>
              <ProfileActivityRowItem>
                <IconButtonWrapper onClick={() => removeProfileActivityClicked(activity)} data-testid="delete-activity-button">
                  <Delete fontSize="inherit"/>
                </IconButtonWrapper>
              </ProfileActivityRowItem>
            </ProfileActivityRow>
          );
        })}
      </ProfileActivitiesWrapper>
    </ProfileActivitiesControlWrapper>
  );
};

export default ProfileActivitiesSelectField;