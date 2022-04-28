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
  const [ selectedGroup, setSelectedGroup ] = React.useState(null);

  useEffect(() => {
    if(groups.length > 0) {
      setSelectedGroup(groups[0]);
    }
  }, [groups]);

  console.log("Selected Group! ", selectedGroup);
  console.log("Form!", form);

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
    console.log("handleCheckGroup childrenTeams", childrenTeams, group);

    setForm({
      type: userFormActions.CHECK_GROUP,
      payload: {
        index,
        checked: isChecked,
        boxType: "checked"
      }
    });
    childrenTeams.forEach((teamIndex:any) => {
      setForm({
        type: userFormActions.CHECK_TEAM,
        payload: {
          index: teamIndex,
          checked: isChecked
        }
      });
    });
    checkIfParital(index);
  };

  const handleCheckTeam = (index: number, isChecked: boolean) => {
    const parentGroupId = teams[index].parentGroupId;
    setForm({
      type: userFormActions.CHECK_TEAM,
      payload: {
        index: index,
        checked: isChecked
      }
    });
    const groupIndex = groups.findIndex((group: any) => group.groupId === parentGroupId);
    checkIfParital(groupIndex);
  };

  const checkIfParital = (index: number): void => {
    const group = groups[index];
    console.log("checkIfParital is run", group);
    const childrenTeams = identifyChildrenTeams(group.groupId);
    console.log("teams in teams", childrenTeams);
    console.log("childrenTeams in checkIfPartial", childrenTeams);
    const checkedChildrenTeams = childrenTeams.filter((teamIndex: any) => teams[teamIndex].checked === true);
    console.log("checkedChildrenTeams in checkIfPartial", checkedChildrenTeams);
    if(childrenTeams.length !== 0 && checkedChildrenTeams.length !== childrenTeams.length || childrenTeams.length !== 0 && checkedChildrenTeams.length === childrenTeams.length && !group.checked){
      console.log("Trying to set partial to true");
      setForm({
        type: userFormActions.CHECK_GROUP,
        payload: {
          index,
          checked: true,
          boxType: "partial"
        }
      });
    } else {
      console.log("Trying to set partial to false");
      setForm({
        type: userFormActions.CHECK_GROUP,
        payload: {
          index,
          checked: false,
          boxType: "partial"
        }
      });
    }
  };

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
                    selected={selectedGroup ? selectedGroup.groupId === group.groupId : false}
                    key={group.groupId}
                  >
                    <CustomTableData>
                      <Checkbox
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
                  <ScopeRow selected={false} key={teams[teamIndex].groupId}>
                    <CustomTableData>
                      <Checkbox
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
        : null}
    </>
  );
};

export default CallRecordingScope;