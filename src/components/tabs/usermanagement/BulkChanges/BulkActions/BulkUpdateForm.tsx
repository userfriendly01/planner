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
  BulkUpdateManager
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
  const [ template, setTemplate ] = React.useState(selectedTemplates.length === 1 ? selectedTemplates[0] : null);

  const replaceTemplate = (template: Template) => updateSelectedTemplates(true, template, [], setSelectedTemplates);
  const updateTemplate = (template: Template, data: any) => template.data = data;
  const removeTemplate = (template: Template) => updateSelectedTemplates(false, template, selectedTemplates, setSelectedTemplates);

  //Update Functionality should only have one selected template in the array
  console.log("BulkUpdateForm - selectedTemplates", selectedTemplates);

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
    </Row>
  );
};

export default BulkUpdateForm;