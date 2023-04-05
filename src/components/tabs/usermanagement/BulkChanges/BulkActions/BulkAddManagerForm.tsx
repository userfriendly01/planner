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
  const teamOptions = state.calabrioContext.teams.map((t: any) => t);
  const groupOptions = state.calabrioContext.groups.map((g: any) => g.name);
  console.log(state);
  console.log("teams: ", teamOptions);
  console.log("one team: ", teamOptions[0]);
  console.log("groups: ", groupOptions);

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