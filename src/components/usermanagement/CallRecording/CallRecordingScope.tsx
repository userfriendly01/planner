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
import {
  getCalabrioRoles
} from "services";

const CallRecordingScope = (props:any) => {

  // const {
  //   groups,
  //   teams
  // } = props;

  const form = useFormState();
  const setForm = useFormDispatch();
  /*
  Scope Component Rules:
    When Tenant is clicked: all groups and teams are selected
    When Group is clicked: all teams within group are selected
    When Group is selected and individual team within that group is de-selected, entire group is de-selected
    When individual team is selected: nothing else is selected
  */


  const tenant: CalabrioGroup = {
    "groupId": 208,
    "name": "Liberty Mutual",
    "displayId": null,
    "parentGroupId": null,
    "parentGroupName": "Default Group",
    "groupLevel": "TENANT"
  };
  const groups: any[] = [
    {
      "groupId": 209,
      "name": "Default Group1",
      "displayId": null,
      "parentGroupId": 12,
      "parentGroupName": "LibertyMutual",
      "groupLevel": "GROUP"
    },
    {
      "groupId": 124,
      "name": "Default Group2",
      "displayId": null,
      "parentGroupId": 12,
      "parentGroupName": "LibertyMutual",
      "groupLevel": "GROUP"
    },
    {
      "groupId": 125,
      "name": "Default Group3",
      "displayId": null,
      "parentGroupId": 12,
      "parentGroupName": "LibertyMutual",
      "groupLevel": "GROUP"
    },
    {
      "groupId": 126,
      "name": "Default Group4",
      "displayId": null,
      "parentGroupId": 12,
      "parentGroupName": "LibertyMutual",
      "groupLevel": "GROUP"
    },
    {
      "groupId": 127,
      "name": "Default Group5",
      "displayId": null,
      "parentGroupId": 12,
      "parentGroupName": "LibertyMutual",
      "groupLevel": "GROUP"
    },
    {
      "groupId": 138,
      "name": "Default Group6",
      "displayId": null,
      "parentGroupId": 12,
      "parentGroupName": "LibertyMutual",
      "groupLevel": "GROUP"
    },
    {
      "groupId": 129,
      "name": "Default Group7",
      "displayId": null,
      "parentGroupId": 12,
      "parentGroupName": "LibertyMutual",
      "groupLevel": "GROUP"
    },
    {
      "groupId": 130,
      "name": "Default Group8",
      "displayId": null,
      "parentGroupId": 12,
      "parentGroupName": "LibertyMutual",
      "groupLevel": "GROUP"
    },
    {
      "groupId": 131,
      "name": "Default Group8",
      "displayId": null,
      "parentGroupId": 12,
      "parentGroupName": "LibertyMutual",
      "groupLevel": "GROUP"
    },
    {
      "groupId": 132,
      "name": "Default Group9",
      "displayId": null,
      "parentGroupId": 12,
      "parentGroupName": "LibertyMutual",
      "groupLevel": "GROUP"
    },
    {
      "groupId": 133,
      "name": "Default Group10",
      "displayId": null,
      "parentGroupId": 12,
      "parentGroupName": "LibertyMutual",
      "groupLevel": "GROUP"
    }
  ];
  const teams: any[] = [
    {
      "groupId": 225,
      "name": "Default Team",
      "displayId": null,
      "parentGroupId": 209,
      "parentGroupName": "Default Group",
      "groupLevel": "TEAM"
    },
    {
      "groupId": 210,
      "name": "Default Team2",
      "displayId": null,
      "parentGroupId": 209,
      "parentGroupName": "Default Group",
      "groupLevel": "TEAM"
    },
    {
      "groupId": 230,
      "name": "Game of Phones",
      "displayId": null,
      "parentGroupId": 209,
      "parentGroupName": "Default Group",
      "groupLevel": "TEAM"
    },
    {
      "groupId": 215,
      "name": "New Team 9",
      "displayId": null,
      "parentGroupId": 124,
      "parentGroupName": "New Test Group 9",
      "groupLevel": "TEAM"
    },
    {
      "groupId": 217,
      "name": "New Team 6",
      "displayId": null,
      "parentGroupId": 216,
      "parentGroupName": "New Test Group 6",
      "groupLevel": "TEAM"
    },
    {
      "groupId": 219,
      "name": "New Team 10",
      "displayId": null,
      "parentGroupId": 218,
      "parentGroupName": "New Test Group 10",
      "groupLevel": "TEAM"
    }
  ];

  const [ worker, setWorker ] = React.useState(null);

  React.useEffect(() => {
    getCalabrioRoles().then(res => {
      console.log("Calabrio Roles", res);
    }).catch(err => {
      console.error("Failed to fetch Calabrio Roles.", err);
    });
    //check for worker email in the agents list and get agent if found
  }, []);

  const [ selectedGroup, setSelectedGroup ] = React.useState(groups[0]);
  const [ checkedGroups, setCheckedGroups ] = React.useState(worker ? worker.scope.groups : []);
  const [ checkedTeams, setCheckedTeams ] = React.useState(worker ? worker.scope.teams : []);

  console.log("Selected Group! ", selectedGroup);
  const identifyChildrenTeams = (groupId: number) => {
    const childrenTeams = teams.filter(team => team.parentGroupId === groupId);
    return childrenTeams;
  };

  const handleCheckGroup = (checkedGroup: any, isChecked: boolean) => {
    const childrenTeams = identifyChildrenTeams(checkedGroup.groupId);
    if(isChecked){
      setCheckedGroups([...checkedGroups, checkedGroup]);
      setCheckedTeams([...checkedTeams, ...childrenTeams]);
    } else {
      setCheckedGroups(checkedGroups.filter((group: any) => group.groupId !== checkedGroup.groupId));
      console.warn("Checking object equality test:" checkedTeams);
      const final = checkedTeams.filter((team: any) => childrenTeams.some(cteam => cteam.groupId === team.groupId));
      console.warn("Final Result", final);
      // setCheckedTeams();
    }
  };

  const handleCheckTeam = (checkedTeam: any, isChecked: boolean) => {
    if(isChecked){
      setCheckedTeams([...checkedTeams, checkedTeam]);
    } else {
      setCheckedTeams(checkedTeams.filter((team: any) => team.groupId !== checkedTeam.groupId));
    }
  };

  const checkIfParital = (groupId: number): boolean => {

    return false;
  };

  const isChecked = (groupId: number): boolean => {
    const result = checkedTeams.some((group: any) => group.groupId === groupId) || checkedGroups.some((group: any) => group.groupId === groupId);
    return result;
  };

  return(
    <FormControlsPane>
      <FullAccessWrapper>
        <CustomTableData><TableText>Full Admin Access</TableText></CustomTableData>
        <CustomTableData><Checkbox onChange={value => console.log("Checkbox clicked", value)}/></CustomTableData>
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
                    checked={isChecked(group.groupId)}
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
                <CustomTableData><Checkbox checked={isChecked(team.groupId)} onChange={e => handleCheckTeam(team, e.target.checked)} /></CustomTableData>
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