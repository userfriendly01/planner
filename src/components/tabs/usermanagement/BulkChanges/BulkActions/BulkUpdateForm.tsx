import {
  Row,
  StepWrapper
} from "../BulkChanges.Styles";
import {
  Template,
  BulkActionFormProps
} from "../BulkChanges.Interfaces";
import { updateSelectedTemplates } from "../BulkUtils";
import {
  BulkUpdateAttributes,
  BulkUpdateManager,
  BulkUpdateDefaultSkills,
  BulkUpdateCallerStates,
  BulkUpdateHrSync
} from "./";
import { getUpdateTemplates } from "../BulkTemplates";
import { Dropdown } from "components";
import { useAdminState } from "context";
import React from "react";

const BulkUpdateForm = (props: BulkActionFormProps) => {
  const {
    setUploadedForm,
    setShowTemplates,
    selectedTemplates,
    setSelectedTemplates
  } = props;

  const state = useAdminState();
  const updateTemplates = getUpdateTemplates(state);
  const [template, setTemplate] = React.useState(selectedTemplates.length === 1 ? selectedTemplates[0] : null);

  const replaceTemplate = (template: Template) => updateSelectedTemplates(true, template, [], setSelectedTemplates);
  const updateTemplate = (template: Template, data: any) => template.data = data;
  const removeTemplate = (template: Template) => updateSelectedTemplates(false, template, selectedTemplates, setSelectedTemplates);

  console.log("SELECTED TEMPLATES", selectedTemplates);

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

  const resetFormForNewSelection = () => {
    setSelectedTemplates([]);
    setShowTemplates(true);
    setUploadedForm(null);
  };

  return (
    <Row>
      <StepWrapper>
        <Dropdown
          label="Choose a field to update"
          value={template ? constructDropdownOption(template) : ""}
          options={Object.values(updateTemplates).map((t: Template) => constructDropdownOption(t))}
          updateValue={(event: any, t: Template) => {
            resetFormForNewSelection();
            setTemplate(t?.value || null);
          }}
          styles={{
            margin: "40 0 30 0",
            width: "300px"
          }}
        />
      </StepWrapper>
      {template && template.name === updateTemplates.UPDATE_WORKER_ATTRIBUTE.name &&
        <BulkUpdateAttributes
          template={updateTemplates.UPDATE_WORKER_ATTRIBUTE}
          selectedTemplates={selectedTemplates}
          replaceTemplate={replaceTemplate}
          updateTemplate={updateTemplate}
          removeTemplate={removeTemplate}
        />
      }
      {template && template.name === updateTemplates.UPDATE_USERS_MANAGER.name &&
        <BulkUpdateManager
          template={updateTemplates.UPDATE_USERS_MANAGER}
          selectedTemplates={selectedTemplates}
          replaceTemplate={replaceTemplate}
          updateTemplate={updateTemplate}
          removeTemplate={removeTemplate}
        />
      }
      {template && template.name === updateTemplates.UPDATE_DEFAULT_SKILLS.name &&
        <BulkUpdateDefaultSkills
          template={updateTemplates.UPDATE_DEFAULT_SKILLS}
          selectedTemplates={selectedTemplates}
          replaceTemplate={replaceTemplate}
          updateTemplate={updateTemplate}
          removeTemplate={removeTemplate}
        />
      }
      {template && template.name === updateTemplates.UPDATE_CALLER_STATES.name &&
        <BulkUpdateCallerStates
          template={updateTemplates.UPDATE_CALLER_STATES}
          selectedTemplates={selectedTemplates}
          replaceTemplate={replaceTemplate}
          updateTemplate={updateTemplate}
          removeTemplate={removeTemplate}
        />
      }
      {template && template.name === updateTemplates.SYNC_HR_ATTRIBUTES.name &&
        <BulkUpdateHrSync
          template={updateTemplates.SYNC_HR_ATTRIBUTES}
          selectedTemplates={selectedTemplates}
          setShowTemplates={setShowTemplates}
          setUploadedForm={setUploadedForm}
          replaceTemplate={replaceTemplate}
          updateTemplate={updateTemplate}
          removeTemplate={removeTemplate}
        />
      }
    </Row>
  );
};

export default BulkUpdateForm;