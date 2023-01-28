import {
  Row,
  SelectionWrapper,
  StepWrapper
} from "../BulkChanges.Styles";
import {
  updateActions
} from "../BulkChanges.Interfaces";
import { updateSelectedTemplates } from "../BulkUtils/utils";
import { getUpdateTemplates } from "../BulkUtils/templates";
import { Dropdown } from "components";
import { useAdminState } from "context";
import React from "react";


const BulkUpdateForm = (props: any) => {
  const {
    selectedTemplates,
    setSelectedTemplates
  } = props;

  const state = useAdminState();
  const updateTemplates = getUpdateTemplates(state);
  const [ action, setAction ] = React.useState(updateActions.WORKER_ATTRIBUTES);

  console.log("BulkUpdateForm - selectedTemplates", selectedTemplates);

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
        Bulk Update Changes!
      </SelectionWrapper>
    </Row>
  );
};

export default BulkUpdateForm;