import React, { useEffect } from "react";
import {
  FormControlsContainer,
  FormControlsPane
} from "./CallRecording.Styles";
import CallRecordingScope from "./CallRecordingScope";
import { FilterableSelect } from "components";
import {
  useAdminState,
  useFormState,
  useFormDispatch,
  userFormActions
} from "context";
import {
  getCalabrioRoles,
  getCalabrioUser
} from "services";

const CallRecordingForm = (props: any) => {
  const {
    worker
  } = props;
  const state = useAdminState();
  const tenant = state.calabrioContext.tenant;
  const groups = state.calabrioContext.groups;
  const teams = state.calabrioContext.teams;
  const users = state.calabrioContext.users;

  const form = useFormState();
  const setForm = useFormDispatch();
  console.log("***STATE!", state);
  console.log("worker", worker);
  console.log("ENV", process.env.APP_ENV);

  const [ roles, setRoles ] = React.useState([]);
  // const [ user, setUser ] = React.useState(null);

  useEffect(() => {
    console.log("Use effect is entered");
    getCalabrioRoles(tenant.groupId).then((res:any) => {
      console.log("Calabrio Roles", res);
      setRoles(res.data);
    }).catch(err => {
      console.error("Failed to fetch Calabrio Roles.", err);
    });
    if(worker && form.formMode ==="UPDATE") {
      const email = form.nNumberFetchedUser.email.toLowerCase();
      const userRecord = users.filter(user => user.email.toLowerCase() === email);
      //update to put all groups on worker but check the ones that the existing worker has
      if(userRecord){
        getCalabrioUser(tenant.groupId).then((res: any) => {
          console.log("Fetched Calabrio User", res);
          setForm({
            type: userFormActions.SET_CALABRIO_USER,
            payload: {
              isScreenRecorded: res.adLogin ? true : false,
              team: res.groupId,
              roles: res.roles,
              scope: {
                groups: res.scope.groups,
                teams: res.scope.teams,
                tenant: res.scope.tenant
              }
            }
          });
        }).catch(err => {
          console.error("Failed to fetch Calabrio Roles.", err);
        });
      }
    } else {
      console.log("useEffect for new user entered", groups);
      setForm({
        type: userFormActions.SET_CALABRIO_USER,
        payload: {
          ...form.calabrioUser,
          isScreenRecorded: true,
          scope: {
            groups,
            teams,
            tenant
          }
        }
      });
    }
  },[]);


  const getRoleOptions = () => {
    return roles.map(role => {
      return {
        label: role.name,
        value: role.id
      };
    });
  };
  const getTeamOptions = () => {
    return teams.map(team => {
      return {
        label: team.name,
        value: team.groupId
      };
    });
  };

  return(
    <FormControlsContainer>
      <FormControlsPane>
        <div>Roles: </div>
        <FilterableSelect
          optionsList={getRoleOptions()}
        />
        <div>Team</div>
        <FilterableSelect
          optionsList={getTeamOptions()}
        />
      </FormControlsPane>
      <CallRecordingScope
        groups={form.calabrioUser.scope.groups}
        teams={form.calabrioUser.scope.teams}
      />
    </FormControlsContainer>
  );
};

export default CallRecordingForm;