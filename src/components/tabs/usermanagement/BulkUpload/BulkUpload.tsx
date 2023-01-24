import React from "react";
import {
  BulkChangesWrapper,
  Row,
  SelectionWrapper,
  ButtonWrapper,
  ImportButton
} from "./BulkUpload.Styles";
import { createTemplates } from "./templates";
import { Dropdown } from "components";
import ExportTemplateButton from "./ExportTemplateButton";
import { Checkbox } from "@mui/material";

const BulkUpload = () => {

  const views: any = {
    BULK_UPLOAD: {
      value: "BULK_CREATE",
      label: "Bulk Create"
    },
    BULK_UPDATE: {
      value: "BULK_UPDATE",
      label: "Bulk Update"
    }
  };

  const [ view, setView ] = React.useState(views.BULK_UPLOAD);
  const [ selectedTemplates, setSelectedTemplates ] = React.useState(null);
  const [ checked, setChecked ] = React.useState({
    TWILIO: true,
    WORKER_DATABASE: true,
    CALABRIO_QM: true,
    CALABRIO_WFM: true
  });

  const addToSelectedTemplates = (template: any) => {
    const templates = selectedTemplates.slice();
    templates.push(template);
  };
  // const removeFromSelectedTemplates = () => {

  // };

  return (
    <BulkChangesWrapper>
      <Dropdown
        label="Select a change type"
        value={view}
        options={Object.values(views)}
        updateValue={(event: any, view: any) => {
          setView(view);
        }}
        styles={{
          margin: "40 0 30 0",
          width: "500px"
        }}
      />
      <Row>
        <SelectionWrapper>
        Twilio
          <Checkbox
            checked={selectedTemplates.some((t: any) => t === createTemplates.CREATE_TRITON_USER)}
            onChange={(param1: any, param2: any) => {
              console.log("params on check", param1, param2);
            }}
            style={{ padding: "0px" }}
          />
        </SelectionWrapper>
        <SelectionWrapper>
        Calabrio QM
          <Checkbox
            checked={checked.CALABRIO_QM}
            onChange={() => setChecked({
              ...checked,
              CALABRIO_QM: !checked.CALABRIO_QM
            })}
            style={{ padding: "0px" }}
          />
        </SelectionWrapper>
      </Row>
      <ButtonWrapper>
        <ExportTemplateButton
          templates={selectedTemplates}
          label="Export Template"
          styles={{ width: "200px" }}
        />
        <ImportButton>Import CSV</ImportButton>
      </ButtonWrapper>
    </BulkChangesWrapper>
  );
};

export default BulkUpload;