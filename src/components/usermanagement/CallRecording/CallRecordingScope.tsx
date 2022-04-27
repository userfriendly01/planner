import React from "react";
import { Checkbox } from "@material-ui/core";
import {
  TableBody,
  TableText,
  CustomTableData,
  ScopeContainer,
  ScopeRow,
  FormControlsPane,
  FullAccessWrapper
} from "./CallRecording.Styles";
import {
  CalabrioGroup
} from "./CallRecording.Interfaces";
import {
  useFormState,
  useFormDispatch,
  userFormActions
} from "context";


const CallRecordingScope = (props:any) => {

  const {
    groups,
    teams
  } = props;

  const form = useFormState();
  const setForm = useFormDispatch();
  /*
  Scope Component Rules:
    When Tenant is clicked: all groups and teams are selected
    When Group is clicked: all teams within group are selected
    When Group is selected and individual team within that group is de-selected, entire group is de-selected
    When individual team is selected: nothing else is selected
  */

  // const groups: any[] = [
  //   {
  //     "groupId": 209,
  //     "name": "Default Group1",
  //     "displayId": null,
  //     "parentGroupId": 12,
  //     "parentGroupName": "LibertyMutual",
  //     "groupLevel": "GROUP"
  //   },
  //   {
  //     "groupId": 124,
  //     "name": "Default Group2",
  //     "displayId": null,
  //     "parentGroupId": 12,
  //     "parentGroupName": "LibertyMutual",
  //     "groupLevel": "GROUP"
  //   },
  //   {
  //     "groupId": 125,
  //     "name": "Default Group3",
  //     "displayId": null,
  //     "parentGroupId": 12,
  //     "parentGroupName": "LibertyMutual",
  //     "groupLevel": "GROUP"
  //   },
  //   {
  //     "groupId": 126,
  //     "name": "Default Group4",
  //     "displayId": null,
  //     "parentGroupId": 12,
  //     "parentGroupName": "LibertyMutual",
  //     "groupLevel": "GROUP"
  //   },
  //   {
  //     "groupId": 127,
  //     "name": "Default Group5",
  //     "displayId": null,
  //     "parentGroupId": 12,
  //     "parentGroupName": "LibertyMutual",
  //     "groupLevel": "GROUP"
  //   },
  //   {
  //     "groupId": 138,
  //     "name": "Default Group6",
  //     "displayId": null,
  //     "parentGroupId": 12,
  //     "parentGroupName": "LibertyMutual",
  //     "groupLevel": "GROUP"
  //   },
  //   {
  //     "groupId": 129,
  //     "name": "Default Group7",
  //     "displayId": null,
  //     "parentGroupId": 12,
  //     "parentGroupName": "LibertyMutual",
  //     "groupLevel": "GROUP"
  //   },
  //   {
  //     "groupId": 130,
  //     "name": "Default Group8",
  //     "displayId": null,
  //     "parentGroupId": 12,
  //     "parentGroupName": "LibertyMutual",
  //     "groupLevel": "GROUP"
  //   },
  //   {
  //     "groupId": 131,
  //     "name": "Default Group8",
  //     "displayId": null,
  //     "parentGroupId": 12,
  //     "parentGroupName": "LibertyMutual",
  //     "groupLevel": "GROUP"
  //   },
  //   {
  //     "groupId": 132,
  //     "name": "Default Group9",
  //     "displayId": null,
  //     "parentGroupId": 12,
  //     "parentGroupName": "LibertyMutual",
  //     "groupLevel": "GROUP"
  //   },
  //   {
  //     "groupId": 133,
  //     "name": "Default Group10",
  //     "displayId": null,
  //     "parentGroupId": 12,
  //     "parentGroupName": "LibertyMutual",
  //     "groupLevel": "GROUP"
  //   }
  // ];
  // const teams: any[] = [
  //   {
  //     "groupId": 225,
  //     "name": "Default Team",
  //     "displayId": null,
  //     "parentGroupId": 209,
  //     "parentGroupName": "Default Group",
  //     "groupLevel": "TEAM"
  //   },
  //   {
  //     "groupId": 210,
  //     "name": "Default Team2",
  //     "displayId": null,
  //     "parentGroupId": 209,
  //     "parentGroupName": "Default Group",
  //     "groupLevel": "TEAM"
  //   },
  //   {
  //     "groupId": 230,
  //     "name": "Game of Phones",
  //     "displayId": null,
  //     "parentGroupId": 209,
  //     "parentGroupName": "Default Group",
  //     "groupLevel": "TEAM"
  //   },
  //   {
  //     "groupId": 215,
  //     "name": "New Team 9",
  //     "displayId": null,
  //     "parentGroupId": 124,
  //     "parentGroupName": "New Test Group 9",
  //     "groupLevel": "TEAM"
  //   },
  //   {
  //     "groupId": 217,
  //     "name": "New Team 6",
  //     "displayId": null,
  //     "parentGroupId": 216,
  //     "parentGroupName": "New Test Group 6",
  //     "groupLevel": "TEAM"
  //   },
  //   {
  //     "groupId": 219,
  //     "name": "New Team 10",
  //     "displayId": null,
  //     "parentGroupId": 218,
  //     "parentGroupName": "New Test Group 10",
  //     "groupLevel": "TEAM"
  //   }
  // ];

  const [ selectedGroup, setSelectedGroup ] = React.useState(groups[0]);
  // const [ checkedGroups, setCheckedGroups ] = React.useState(form.calabrioUser.scope.groups);
  // const [ checkedTeams, setCheckedTeams ] = React.useState(form.calabrioUser.scope.teams);

  console.log("Selected Group! ", selectedGroup);
  console.log("Form!", form);
  //Calabrio user can hold all groups with their index and indicate if its checked or not
  //then when we submit the add user we can filter for only the true ones

  const identifyChildrenTeams = (groupId: number) => {
    console.log("identifyChildrenTeams is run");
    //can clean this up to only return index if it works
    const childrenTeams = teams.map((team: any, index: number) => {
      if(team.parentGroupId === groupId){
        return {
          index,
          ...team
        };
      }
    });
    return childrenTeams;
  };

  // const isGroupInList = (group: any, groupArray: any) => {
  //   console.log("isGroupInList is run");
  //   return groupArray.some((chteam: any) => JSON.stringify(chteam) === JSON.stringify(group));
  // };

  const handleCheckGroup = (index: number, isChecked: boolean) => {
    console.log("handleCheckTeam is run");
    const group = groups[index];

    const childrenTeams = identifyChildrenTeams(group.groupId);
    setForm({
      type: userFormActions.CHECK_GROUP,
      payload: {
        index,
        checked: isChecked
      }
    });
    childrenTeams.forEach((team:any) => {
      setForm({
        type: userFormActions.CHECK_TEAM,
        payload: {
          index: team.index,
          checked: isChecked
        }
      });
    });
  };

  // const handleCheckTeam = (checkedTeam: any, isChecked: boolean) => {
  //   console.log("handleCheckTeam is run");
  //   if(isChecked){
  //     if(!isGroupInList(checkedTeam, checkedTeams)){
  //       setCheckedTeams([...checkedTeams, checkedTeam]);
  //     }
  //   } else {
  //     setCheckedTeams(checkedTeams.filter((team: any) => team.groupId !== checkedTeam.groupId));
  //   }
  // };

  const checkIfParital = (index: number): boolean => {
    const group = groups[index];
    console.log("checkIfParital is run");
    const childrenTeams = identifyChildrenTeams(group.groupId);
    const checkedChildrenTeams = childrenTeams.filter((team: any) => team.checked === true);
    if(childrenTeams.length !== 0 && checkedChildrenTeams.length !== childrenTeams.length){
      return true;
    } else {
      return false;
    }
  };

  // const isGroupChecked = (groupId: number, index: number): boolean => {
  //   console.log("isGroupChecked is run");
  //   const childrenTeams = identifyChildrenTeams(groupId);
  //   const isGroupChecked = groups[index].checked;
  //   if(isGroupChecked && childrenTeams.length === 0){
  //     return true;
  //   }
  //   return isGroupChecked && allChildrenChecked;
  // };

  const handleCheckAdmin = (isChecked: boolean) => {
    groups.forEach((group: any, index: number) => setForm({
      type: userFormActions.CHECK_GROUP,
      payload: {
        index,
        checked: isChecked
      }
    }));
    teams.forEach((team: any, index: number) => setForm({
      type: userFormActions.CHECK_TEAM,
      payload: {
        index,
        checked: isChecked
      }
    }));
  };

  const checkIfAdmin = () => {
    return groups.some((group: any) => group.checked === false) || teams.some((team: any) => team.checked === false);
  };

  return(
    <FormControlsPane>
      <FullAccessWrapper>
        <CustomTableData><TableText>Full Admin Access</TableText></CustomTableData>
        <CustomTableData>
          <Checkbox
            onChange={e => handleCheckAdmin(e.target.checked)}
            checked={checkIfAdmin()}
          />
        </CustomTableData>
      </FullAccessWrapper>
      <ScopeContainer>
        <TableBody>
          {
            groups.map((group: any, index: number) => (
              <ScopeRow
                onClick={() => setSelectedGroup(group)}
                selected={selectedGroup.groupId === group.groupId}
                key={group.groupId}
              >
                <CustomTableData>
                  <Checkbox
                    checked={groups[index].checked}
                    indeterminate={checkIfParital(index)}
                    onChange={e => handleCheckGroup(index, e.target.checked)}
                  />
                </CustomTableData>
                <CustomTableData><TableText>{group.name}</TableText></CustomTableData>
              </ScopeRow>
            ))
          }
        </TableBody>
        <TableBody>
          {
            identifyChildrenTeams(selectedGroup.groupId).map((team: any, index: number) => (
              <ScopeRow selected={false} key={team.groupId}>
                <CustomTableData>
                  <Checkbox
                    checked={teams[index].checked}
                    onChange={e => setForm({
                      type: userFormActions.CHECK_TEAM,
                      payload: {
                        index,
                        checked: e.target.checked
                      }
                    })}
                  /></CustomTableData>
                <CustomTableData><TableText>{team.name}</TableText></CustomTableData>
              </ScopeRow>
            ))
          }
        </TableBody>
      </ScopeContainer>
    </FormControlsPane>
  );
};

export default CallRecordingScope;