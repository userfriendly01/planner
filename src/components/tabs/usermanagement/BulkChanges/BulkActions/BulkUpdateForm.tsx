import {
  Row,
  UpdateWrapper,
  StepWrapper
} from "../BulkChanges.Styles";
import {
  Template,
  BulkActionFormProps,
  WorkerAttribute
} from "../BulkChanges.Interfaces";
import { updateSelectedTemplates } from "../BulkUtils";
import {
  BulkUpdateAttributes,
  BulkUpdateManager,
  BulkUpdateDefaultSkills,
  BulkUpdateCallerStates
} from "./";
import { getUpdateTemplates } from "../BulkTemplates";
import { Dropdown } from "components";
import { useAdminState } from "context";
import React from "react";

const BulkUpdateForm = (props: BulkActionFormProps) => {
  const {
    selectedTemplates,
    setSelectedTemplates
  } = props;

  const state = useAdminState();
  const updateTemplates = getUpdateTemplates(state);
  console.log("wsx Available Update Templates", updateTemplates);
  const [ template, setTemplate ] = React.useState(selectedTemplates.length === 1 ? selectedTemplates[0] : null);

  const replaceTemplate = (template: Template) => updateSelectedTemplates(true, template, [], setSelectedTemplates);
  const updateTemplate = (template: Template, data: any) => template.data = data;
  const removeTemplate = (template: Template) => updateSelectedTemplates(false, template, selectedTemplates, setSelectedTemplates);

  // Update Functionality should only have one selected template in the array
  console.log("BulkUpdateForm - selectedTemplates", selectedTemplates);

  // Convert template name like "UPDATE_USERS_MANAGER" to dropdown label like "Update Users Manager"
  const constructDropdownOption = (t: Template) => {
    const name = t.name.split("_").map((w: string) => {
      const word = w.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return {
      label: name.join(" "),
      value: t
    };
  };

  return (
    <Row>
      <StepWrapper>
        <Dropdown
          label="Choose a field to update"
          value={template ? constructDropdownOption(template) : ""}
          options={Object.values(updateTemplates).map((t: Template) => constructDropdownOption(t))}
          updateValue={(event: any, t: Template) => {
            setTemplate(t.value);
            console.log("wsx Selected template", t);
          }}
          styles={{
            margin: "40 0 30 0",
            width: "300px"
          }}
        />
      </StepWrapper>
      { template && template.name === updateTemplates.UPDATE_WORKER_ATTRIBUTE.name &&
        <BulkUpdateAttributes
          template={updateTemplates.UPDATE_WORKER_ATTRIBUTE}
          selectedTemplates={selectedTemplates}
          replaceTemplate={replaceTemplate}
          updateTemplate={updateTemplate}
          removeTemplate={removeTemplate}
        />
      }
      { template && template.name === updateTemplates.UPDATE_USERS_MANAGER.name &&
        <BulkUpdateManager
          template={updateTemplates.UPDATE_USERS_MANAGER}
          selectedTemplates={selectedTemplates}
          replaceTemplate={replaceTemplate}
          updateTemplate={updateTemplate}
          removeTemplate={removeTemplate}
        />
      }
      { template && template.name === updateTemplates.UPDATE_DEFAULT_SKILLS.name &&
        <BulkUpdateDefaultSkills
          template={updateTemplates.UPDATE_DEFAULT_SKILLS}
          selectedTemplates={selectedTemplates}
          replaceTemplate={replaceTemplate}
          updateTemplate={updateTemplate}
          removeTemplate={removeTemplate}
        />
      }
      { template && template.name === updateTemplates.UPDATE_CALLER_STATES.name &&
        <BulkUpdateCallerStates
          template={updateTemplates.UPDATE_CALLER_STATES}
          selectedTemplates={selectedTemplates}
          replaceTemplate={replaceTemplate}
          updateTemplate={updateTemplate}
          removeTemplate={removeTemplate}
        />
      }
    </Row>
  );
};

export default BulkUpdateForm;