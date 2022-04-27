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
  useFormDispatch
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
  const [ checkedGroups, setCheckedGroups ] = React.useState(form.calabrioUser.scope.groups);
  const [ checkedTeams, setCheckedTeams ] = React.useState(form.calabrioUser.scope.teams);

  console.log("Selected Group! ", selectedGroup);
  console.log("Form!", form);
  console.log("checkedGroups", checkedGroups);
  console.log("checkedTeams", checkedTeams);

  const identifyChildrenTeams = (groupId: number) => {
    console.log("identifyChildrenTeams is run");
    const childrenTeams = teams.filter((team: any) => team.parentGroupId === groupId);
    return childrenTeams;
  };

  const isGroupInList = (group: any, groupArray: any) => {
    console.log("isGroupInList is run");
    return groupArray.some((chteam: any) => JSON.stringify(chteam) === JSON.stringify(group));
  };

  const handleCheckGroup = (checkedGroup: any, isChecked: boolean) => {
    console.log("handleCheckTeam is run");
    const childrenTeams = identifyChildrenTeams(checkedGroup.groupId);
    if(isChecked){
      if(!isGroupInList(checkedGroup, checkedGroups)){
        setCheckedGroups([...checkedGroups, checkedGroup]);
      }
      setCheckedTeams([...checkedTeams, ...childrenTeams]);
    } else {
      setCheckedGroups(checkedGroups.filter((group: any) => group.groupId !== checkedGroup.groupId));
      setCheckedTeams(checkedTeams.filter((team: any) => !isGroupInList(team, childrenTeams)));
    }
  };

  const handleCheckTeam = (checkedTeam: any, isChecked: boolean) => {
    console.log("handleCheckTeam is run");
    if(isChecked){
      if(!isGroupInList(checkedTeam, checkedTeams)){
        setCheckedTeams([...checkedTeams, checkedTeam]);
      }
    } else {
      setCheckedTeams(checkedTeams.filter((team: any) => team.groupId !== checkedTeam.groupId));
    }
  };

  const checkIfParital = (groupId: number): boolean => {
    console.log("checkIfParital is run");
    const isGroupChecked = checkedGroups.some((group: any) => group.groupId === groupId);
    const childrenTeams = identifyChildrenTeams(groupId);
    const result = childrenTeams.filter((team: any) => isGroupInList(team, checkedTeams));
    if(result.length === 0) {
      return false;
    } else if(result.length !== childrenTeams.length) {
      if(isGroupChecked){
        setCheckedGroups(checkedGroups.filter((group: any) => group.groupId !== groupId));
      }
      return true;
    } else {
      return false;
    }
  };

  const isGroupChecked = (groupId: number): boolean => {
    console.log("isGroupChecked is run");
    const childrenTeams = identifyChildrenTeams(groupId);
    const isGroupChecked = checkedGroups.some((group: any) => group.groupId === groupId);
    if(isGroupChecked && childrenTeams.length === 0){
      return true;
    }
    const checkedChildrenTeams = childrenTeams.filter((team: any) => isGroupInList(team, checkedTeams));
    return isGroupChecked && checkedChildrenTeams.length > 0;
  };

  const handleCheckAdmin = (isChecked: boolean) => {
    if(isChecked){
      setCheckedGroups(groups);
      setCheckedTeams(teams);
    } else {
      setCheckedGroups([]);
      setCheckedTeams([]);
    }
  };

  return(
    <FormControlsPane>
      <FullAccessWrapper>
        <CustomTableData><TableText>Full Admin Access</TableText></CustomTableData>
        <CustomTableData>
          <Checkbox
            onChange={e => handleCheckAdmin(e.target.checked)}
            checked={checkedGroups.length === groups.length && checkedTeams.length === teams.length}
          />
        </CustomTableData>
      </FullAccessWrapper>
      <ScopeContainer>
        <TableBody>
          {
            groups.map((group: any) => (
              <ScopeRow
                onClick={() => setSelectedGroup(group)}
                selected={selectedGroup.groupId === group.groupId}
                key={group.groupId}
              >
                <CustomTableData>
                  <Checkbox
                    checked={isGroupChecked(group.groupId)}
                    indeterminate={checkIfParital(group.groupId)}
                    onChange={e => handleCheckGroup(group, e.target.checked)}
                  />
                </CustomTableData>
                <CustomTableData><TableText>{group.name}</TableText></CustomTableData>
              </ScopeRow>
            ))
          }
        </TableBody>
        <TableBody>
          {
            identifyChildrenTeams(selectedGroup.groupId).map((team: any) => (
              <ScopeRow selected={false} key={team.groupId}>
                <CustomTableData>
                  <Checkbox
                    checked={checkedTeams.some((group: any) => group.groupId === team.groupId)}
                    onChange={e => handleCheckTeam(team, e.target.checked)}
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