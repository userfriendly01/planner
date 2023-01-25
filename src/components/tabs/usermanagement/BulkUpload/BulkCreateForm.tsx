import {
  Row,
  SelectionWrapper,
  StepWrapper
} from "./BulkUpload.Styles";
import { getCreateTemplates } from "./templates";
import { useAdminState } from "context";
import React from "react";
import { Checkbox } from "@mui/material";


const BulkCreateForm = (props: any) => {
  const {
    selectedTemplates,
    updateSelectedTemplates
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
          checked={selectedTemplates.some((t: any) => t.name === "CREATE_TRITON_USER")}
          onChange={(event: any) => {
            const checked = event.target.checked;
            console.log("Triton onChange", checked, createTemplates.CREATE_TRITON_USER);
            updateSelectedTemplates(checked, createTemplates.CREATE_TRITON_USER);
          }}
          style={{ padding: "0px" }}
        />
      </SelectionWrapper>
      <SelectionWrapper>
        Calabrio QM
        <Checkbox
          checked={selectedTemplates.some((t: any) => t.name === "CREATE_CALABRIO_QM_USER")}
          onChange={(event: any) => {
            const checked = event.target.checked;
            console.log("QM onChange", checked, createTemplates.CREATE_CALABRIO_QM_USER);
            updateSelectedTemplates(checked, createTemplates.CREATE_CALABRIO_QM_USER);
          }}
          style={{ padding: "0px" }}
        />
      </SelectionWrapper>
    </Row>
  );
};

export default BulkCreateForm;