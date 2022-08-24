import React, { useEffect } from "react";
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
import { userFormActions } from "context";

const CallRecordingScope = (props:any) => {

  const {
    calabrioUser,
    setForm
  } = props;

  const {
    groups,
    teams
  } = calabrioUser.scope;

  const [ selectedGroup, setSelectedGroup ] = React.useState(null);

  useEffect(() => {
    if(groups.length > 0) {
      setSelectedGroup(groups[0]);
      groups.forEach((group: any, index: number) => {
        checkIfPartial(index);
      });
    }
  }, [groups]);

  const identifyChildrenTeams = (groupId: number) => {
    const childrenTeams: any[] = [];
    teams.forEach((team: any, index: number) => {
      if(team.parentGroupId === groupId){
        childrenTeams.push(index);
      }
    });
    return childrenTeams;
  };

  const handleCheckGroup = (index: number, isChecked: boolean) => {
    const group = groups[index];
    const childrenTeams = identifyChildrenTeams(group.groupId);
    setForm({
      type: userFormActions.CHECK_CALABRIO_GROUP,
      payload: {
        index,
        checked: isChecked,
        boxType: "checked"
      }
    });
    setForm({
      type: userFormActions.CHECK_CALABRIO_GROUP,
      payload: {
        index,
        checked: false,
        boxType: "partial"
      }
    });
    childrenTeams.forEach((teamIndex:any) => {
      setForm({
        type: userFormActions.CHECK_CALABRIO_TEAM,
        payload: {
          index: teamIndex,
          checked: isChecked
        }
      });
    });
  };

  const handleCheckTeam = (index: number, isChecked: boolean) => {
    const parentGroupId = teams[index].parentGroupId;
    setForm({
      type: userFormActions.CHECK_CALABRIO_TEAM,
      payload: {
        index: index,
        checked: isChecked
      }
    });
    const groupIndex = groups.findIndex((group: any) => group.groupId === parentGroupId);
    checkIfPartial(groupIndex);
  };

  const checkIfPartial = (index: number): void => {
    const group = groups[index];
    const childrenTeams = identifyChildrenTeams(group.groupId);
    const checkedChildrenTeams = childrenTeams.filter((teamIndex: any) => teams[teamIndex].checked === true);

    const childrenTeamsExist = childrenTeams.length !== 0;
    const noChildrenTeamsChecked = checkedChildrenTeams.length === 0;
    const allChildrenTeamsChecked = checkedChildrenTeams.length === childrenTeams.length;

    if(!childrenTeamsExist || (noChildrenTeamsChecked && !group.checked) || (allChildrenTeamsChecked && group.checked)){
      if(group.partial !== false){
        setForm({
          type: userFormActions.CHECK_CALABRIO_GROUP,
          payload: {
            index,
            checked: false,
            boxType: "partial"
          }
        });
      }
    } else {
      if(group.partial !== true){
        setForm({
          type: userFormActions.CHECK_CALABRIO_GROUP,
          payload: {
            index,
            checked: true,
            boxType: "partial"
          }
        });
      }
    }
  };

  const handleCheckAdmin = (isChecked: boolean) => {
    groups.forEach((group: any, index: number) => {
      setForm({
        type: userFormActions.CHECK_CALABRIO_GROUP,
        payload: {
          index,
          checked: isChecked,
          boxType: "checked"
        }
      });
      setForm({
        type: userFormActions.CHECK_CALABRIO_GROUP,
        payload: {
          index,
          checked: false,
          boxType: "partial"
        }
      });
    }
    );
    teams.forEach((team: any, index: number) => setForm({
      type: userFormActions.CHECK_CALABRIO_TEAM,
      payload: {
        index,
        checked: isChecked
      }
    }));
  };

  const checkIfAdmin = () => {
    return !groups.some((group: any) => group.checked === false) && !teams.some((team: any) => team.checked === false);
  };

  return(
    <>
      { groups.length > 0 && selectedGroup ?
        <FormControlsPane>
          <FullAccessWrapper>
            <CustomTableData><TableText>Full Admin Access</TableText></CustomTableData>
            <CustomTableData>
              <Checkbox
                data-testid="admin-checkbox"
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
                    data-testid={`group-row-${groups[index].groupId}`}
                    onClick={() => setSelectedGroup(group)}
                    selected={selectedGroup ? selectedGroup.groupId === group.groupId : false}
                    key={group.groupId}
                  >
                    <CustomTableData>
                      <Checkbox
                        data-testid={`group-checkbox-${groups[index].groupId}`}
                        checked={groups[index] ? groups[index].checked : false}
                        indeterminate={groups[index] ? groups[index].partial : false}
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
                identifyChildrenTeams(selectedGroup.groupId).map((teamIndex: any) => (
                  <ScopeRow
                    data-testid={`team-row-${teams[teamIndex].groupId}`}
                    selected={false}
                    key={teams[teamIndex].groupId}>
                    <CustomTableData>
                      <Checkbox
                        data-testid={`team-checkbox-${teams[teamIndex].groupId}`}
                        checked={teams[teamIndex].checked}
                        onChange={e => handleCheckTeam(teamIndex, e.target.checked)}
                      /></CustomTableData>
                    <CustomTableData><TableText>{teams[teamIndex].name}</TableText></CustomTableData>
                  </ScopeRow>
                ))
              }
            </TableBody>
          </ScopeContainer>
        </FormControlsPane>
        : <h3>Failed to load Calabrio Organization</h3>}
    </>
  );
};

export default CallRecordingScope;