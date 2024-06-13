import { UpdateWrapper } from "usermanagement/BulkChanges.Styles";
import {
  Template,
  BulkUpdateProps
} from "usermanagement/BulkChanges.Interfaces";
import { Dropdown } from "components/Dropdown";
import { useAdminState } from "context/appContext";
import React from "react";
import { UMManager } from "globals/interfaces";

export const BulkUpdateManager = (props: BulkUpdateProps) => {
  const {
    template,
    selectedTemplates,
    replaceTemplate,
    updateTemplate,
    removeTemplate
  } = props;

  const state = useAdminState();
  const [ newManager, setNewManager ] = React.useState({
    nNumber: "",
    calabrioTeamId: ""
  });

  React.useEffect(() => {
    //If the entries are valid, update/add the template to the selected templates.
    //If they arent valid, remove the template from the selected templates
    //Valid templates will drive the display of the processing buttons
    if(newManager.nNumber && newManager.calabrioTeamId){
      const templateFound = selectedTemplates.find((t: Template) => t.name === template.name);
      if(!templateFound){
        replaceTemplate({
          ...template,
          data: newManager
        });
      } else {
        updateTemplate(templateFound, newManager);
      }
    } else {
      if(selectedTemplates.find((t: Template) => t.name === template.name)){
        removeTemplate(template);
      }
    }
  }, [newManager]);

  React.useEffect(() => {
    if(selectedTemplates.length === 0){
      setNewManager({
        nNumber: "",
        calabrioTeamId: ""
      });
    }
  }, [selectedTemplates]);


  const formatManagerDropdownEntry = (m: UMManager) => {
    if(m){
      return {
        label: `${m.manager_first_name} ${m.manager_last_name}`,
        value: m.manager_n_num,
        ...m
      };
    } else {
      return "";
    }
  };

  const formatTeamDropdownEntry = (t: any) => {
    if(t) {
      return {
        label: t.name,
        value: t.groupId,
        ...t
      };
    } else {
      return "";
    }
  };

  return (
    <UpdateWrapper>
      <Dropdown
        label="Triton Team Manager"
        value={formatManagerDropdownEntry(state.managerContext.managers.find((m: any) => m.manager_n_num === newManager.nNumber))}
        options={state.managerContext.managers.map((m: any) => {
          return formatManagerDropdownEntry(m);
        })}
        updateValue={(event: any, manager: any) => setNewManager({
          ...newManager,
          nNumber: manager.manager_n_num
        })}
        styles={{
          width: "230px",
          margin: "10px 20px 0px 20px"
        }}
      />
      <Dropdown
        label="Calabrio Team"
        value={formatTeamDropdownEntry(state.calabrioContext.teams.find((t: any) => t.groupId === newManager.calabrioTeamId))}
        options={state.calabrioContext.teams.map((t: any) => {
          return formatTeamDropdownEntry(t);
        })}
        updateValue={(event: any, team: any) => setNewManager({
          ...newManager,
          calabrioTeamId: team.groupId
        })}
        styles={{
          width: "230px",
          margin: "10px 20px 0px 20px"
        }}
      />
    </UpdateWrapper>
  );
};