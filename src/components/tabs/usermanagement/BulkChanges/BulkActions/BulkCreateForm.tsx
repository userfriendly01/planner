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


const BulkCreateForm = (props: BulkActionFormProps) => {
  const {
    selectedTemplates,
    setSelectedTemplates
  } = props;

  const state = useAdminState();
  const createTemplates = getCreateTemplates(state);

  console.log("BulkCreateForm - selectedTemplates", selectedTemplates);

  return (
    <Row>
      <StepWrapper>
        Step 1: Choose the applicable systems
      </StepWrapper>
      <SelectionWrapper>
        Twilio
        <Checkbox
          checked={selectedTemplates.some((t: Template) => t.name === "CREATE_TRITON_USER")}
          onChange={(event: any) => {
            const checked = event.target.checked;
            updateSelectedTemplates(checked, createTemplates.CREATE_TRITON_USER, selectedTemplates, setSelectedTemplates);
          }}
          style={{ padding: "0px" }}
        />
      </SelectionWrapper>
      <SelectionWrapper>
        Calabrio QM
        <Checkbox
          checked={selectedTemplates.some((t: Template) => t.name === "CREATE_CALABRIO_QM_USER")}
          onChange={(event: any) => {
            const checked = event.target.checked;
            updateSelectedTemplates(checked, createTemplates.CREATE_CALABRIO_QM_USER, selectedTemplates, setSelectedTemplates);
          }}
          style={{ padding: "0px" }}
        />
      </SelectionWrapper>
    </Row>
  );
};

export default BulkCreateForm;