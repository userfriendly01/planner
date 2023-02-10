import { UpdateWrapper } from "../BulkChanges.Styles";
import {
  Template,
  BulkUpdateProps
} from "../BulkChanges.Interfaces";
import { Dropdown } from "components";
import { useAdminState } from "context";
import React from "react";

const BulkUpdateManager = (props: BulkUpdateProps) => {
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

  console.log("BulkUpdateForm - selectedTemplates", selectedTemplates);

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

  return (
    <UpdateWrapper>
      <Dropdown
        label="Triton Team Manager"
        value={newManager.nNumber}
        options={state.managerContext.managers.map((m: any) => {
          return {
            label: `${m.manager_first_name} ${m.manager_first_name}`,
            value: m.manager_n_number,
            ...m
          };
        })}
        updateValue={(event: any, manager: any) => setNewManager({
          ...newManager,
          nNumber: manager.manager_n_number
        })}
        styles={{
          width: "230px",
          margin: "10px 20px 0px 20px"
        }}
      />
      <Dropdown
        label="Calabrio Team"
        value={newManager.calabrioTeamId}
        options={state.calabrioContext.teams.map((t: any) => {
          return {
            label: t.name,
            value: t.groupId,
            ...t
          };
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

export default BulkUpdateManager;