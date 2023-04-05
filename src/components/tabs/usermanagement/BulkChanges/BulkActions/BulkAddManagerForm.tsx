import {
  Row,
  SelectionWrapper,
  StepWrapper
} from "../BulkChanges.Styles";
import {
  Template,
  BulkActionFormProps
} from "../BulkChanges.Interfaces";
import { updateSelectedTemplates } from "../BulkUtils";
import { getCreateTemplates } from "../BulkTemplates";
import { useAdminState } from "context";
import React from "react";
import { Checkbox } from "@mui/material";

const BulkAddManagerForm = (props: BulkActionFormProps) => {
  const {
    selectedTemplates,
    setSelectedTemplates
  } = props;

  const state = useAdminState();
  const createTemplates = getCreateTemplates(state);

  console.log("BulkAddManagerForm - selectedTemplates", selectedTemplates);

  return (
    <Row>
      <StepWrapper>
          Step 1:
      </StepWrapper>
      <SelectionWrapper>
          Add Manager
        <Checkbox
          checked={selectedTemplates.some((t: Template) => t.name === "CREATE_MANAGER")}
          onChange={(event: any) => {
            const checked = event.target.checked;
            updateSelectedTemplates(checked, createTemplates.CREATE_MANAGER, selectedTemplates, setSelectedTemplates);
          }}
          style={{ padding: "0px" }}
        />
      </SelectionWrapper>
    </Row>
  );
};

export default BulkAddManagerForm;