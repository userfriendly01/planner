import {
  Row,
  SelectionWrapper,
  StepWrapper
} from "../BulkChanges.Styles";
import {
  updateActions,
  valueTypes
} from "../BulkChanges.Interfaces";
import { updateSelectedTemplates } from "../BulkUtils/utils";
import { getUpdateTemplates } from "../BulkUtils/templates";
import {
  CustomInput,
  Dropdown
} from "components";
import { useAdminState } from "context";
import React from "react";
import { Tooltip } from "@mui/material";


const BulkUpdateForm = (props: any) => {
  const {
    selectedTemplates,
    setSelectedTemplates
  } = props;

  const state = useAdminState();
  const updateTemplates = getUpdateTemplates(state);
  const [ action, setAction ] = React.useState(updateTemplates.UPDATE_WORKER_ATTRIBUTE);
  const [ updateAttributes, setUpdateAttributes ] = React.useState({
    key: "",
    value: "",
    type: valueTypes.STRING
  });

  console.log("BulkUpdateForm - selectedTemplates", selectedTemplates);
  const keyValidator = (key: string) => key.length > 0 && key.indexOf(" ") === -1;
  const objectValidator = (value: string) => {
    switch(updateAttributes.type){
      case valueTypes.STRING:
        return true;
      case valueTypes.NUMBER:
        try {
          parseInt(value);
          return true;
        } catch(err){
          return false;
        }
      case valueTypes.BOOLEAN: {
        const cleanValue = value.replace(" ", "").toLowerCase();
        if(cleanValue === "true" || cleanValue === "false"){
          return true;
        } else {
          return false;
        }
      }
      case valueTypes.OBJECT:
        try {
          JSON.parse(value);
          return true;
        } catch(err){
          return false;
        }
      case valueTypes.ARRAY:
        try {
          JSON.parse(value);
          return true;
        } catch(err){
          return false;
        }
      default:
        return false;
    }
  };

  React.useEffect(() => {
    //enhance to check if they are valid & if they arent, unselect the template to hide the follow up fields
    if(updateAttributes.key && updateAttributes.value){
      const templateFound = selectedTemplates.find((t: any) => t.name === action.name);
      if(!templateFound){
        updateSelectedTemplates(true, {
          ...action,
          data: updateAttributes
        }, selectedTemplates, setSelectedTemplates);
      } else {
        templateFound.data = updateAttributes;
      }
    } else {
      if(selectedTemplates.find((t: any) => t.name === action.name)){
        updateSelectedTemplates(false, action, selectedTemplates, setSelectedTemplates);
      }
    }
  }, [updateAttributes]);

  const constructDropdownOption = (template: any) => {
    const name = template.name.split("_").map((w: string) => {
      const word = w.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return {
      label: name.join(" "),
      value: template
    };
  };

  return (
    <Row>
      <StepWrapper>
        <Dropdown
          label="Choose a field to update"
          value={constructDropdownOption(action)}
          options={Object.values(updateTemplates).map((t: any) => constructDropdownOption(t))}
          updateValue={(event: any, template: any) => {
            console.log("TEMPLATE", template);
            setAction(template.value);
          }}
          styles={{
            margin: "40 0 30 0",
            width: "400px"
          }}
        />
      </StepWrapper>
      { action === updateTemplates.UPDATE_WORKER_ATTRIBUTE &&
        <SelectionWrapper>
          <Tooltip title="Must be a string with no spaces">
            <CustomInput
              label="Attribute Key"
              name="attribute-key"
              validator={keyValidator}
              value={updateAttributes.key}
              updateValue={(key: string) => setUpdateAttributes({
                ...updateAttributes,
                key
              })}
              styles={{ width: "250px" }}
            />
          </Tooltip>
          <Tooltip title="Must align with selected Value Type">
            <CustomInput
              label="Attribute Value"
              name="attribute-value"
              validator={objectValidator}
              value={updateAttributes.value}
              updateValue={(value: string) => setUpdateAttributes({
                ...updateAttributes,
                value
              })}
              styles={{ width: "250px" }}
            />
          </Tooltip>
          <Dropdown
            label="Value Type"
            value={updateAttributes.type}
            options={Object.values(valueTypes)}
            updateValue={(event: any, type: any) => setUpdateAttributes({
              ...updateAttributes,
              type
            })}
            styles={{
              margin: "40 0 30 0",
              width: "150px"
            }}
          />
        </SelectionWrapper>
      }
    </Row>
  );
};

export default BulkUpdateForm;