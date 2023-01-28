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
  const keyValidator = () => true;
  const objectValidator = () => true;

  React.useEffect(() => {
    //enhance to check if they are valid & if they arent, unselect the template to hide the follow up fields
    if(updateAttributes.key && updateAttributes.value){
      if(!selectedTemplates.find((t: any) => t.name === action.name)){
        updateSelectedTemplates(true, action, selectedTemplates, setSelectedTemplates);
      }
    } else {
      if(selectedTemplates.find((t: any) => t.name === action.name)){
        updateSelectedTemplates(false, action, selectedTemplates, setSelectedTemplates);
      }
    }
  }, [updateAttributes]);

  return (
    <Row>
      <StepWrapper>
        <Dropdown
          label="Choose a field to update"
          value={action}
          options={Object.values(updateTemplates)}
          updateValue={(event: any, action: any) => {
            setAction(action);
          }}
          styles={{
            margin: "40 0 30 0",
            width: "400px"
          }}
        />
      </StepWrapper>
      { action === updateActions.WORKER_ATTRIBUTES &&
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