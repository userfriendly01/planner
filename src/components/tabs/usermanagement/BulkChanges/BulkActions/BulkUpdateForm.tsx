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
  const [ action, setAction ] = React.useState(updateActions.WORKER_ATTRIBUTES);
  const [ valueType, setValueType ] = React.useState(valueTypes.STRING);

  console.log("BulkUpdateForm - selectedTemplates", selectedTemplates);
  const keyValidator = () => true;
  const objectValidator = () => true;

  return (
    <Row>
      <StepWrapper>
        <Dropdown
          label="Choose a field to update"
          value={action}
          options={Object.values(updateActions)}
          updateValue={(event: any, action: any) => {
            setAction(action);
          }}
          styles={{
            margin: "40 0 30 0",
            width: "500px"
          }}
        />
      </StepWrapper>
      <SelectionWrapper>
        { action === updateActions.WORKER_ATTRIBUTES &&
          <div>
            <Tooltip title="Must be a string with no spaces">
              <CustomInput
                label="Attribute Key"
                name="attribute-key"
                value=""
                updateValue={() => console.log("Key updated!")}
              />
            </Tooltip>
            <Tooltip title="Must align with selected Value Type">
              <CustomInput
                label="Attribute Value"
                name="attribute-value"
                value=""
                updateValue={() => console.log("Value updated!")}
              />
            </Tooltip>
            <Dropdown
              label="Value Type"
              value={valueType}
              options={Object.values(valueTypes)}
              updateValue={(event: any, valueType: any) => {
                setValueType(valueType);
              }}
              styles={{
                margin: "40 0 30 0",
                width: "500px"
              }}
            />
          </div>
        }
      </SelectionWrapper>
    </Row>
  );
};

export default BulkUpdateForm;