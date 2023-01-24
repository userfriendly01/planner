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
import xlsx from "xlsx";

const BulkUpload = () => {

  const views: any = {
    BULK_UPLOAD: {
      value: "CREATE_USERS",
      label: "Create Users"
    },
    BULK_UPDATE: {
      value: "BULK_UPDATE",
      label: "Bulk Update"
    }
  };

  const [ view, setView ] = React.useState(views.BULK_UPLOAD);
  const [ selectedTemplates, setSelectedTemplates ] = React.useState([]);
  const [ consolidatedTemplates, setConsolidatedTemplates ] = React.useState([]);

  React.useEffect(() => {
    console.log("Bulk Upload UseEffect");
    const final = consolidateTemplates();
    setConsolidatedTemplates(final);
    console.log("Bulk Upload UseEffect", final);
  }, [selectedTemplates]);

  const updateSelectedTemplates = (checked: boolean, template: any) => {
    if(checked) {
      const templates = selectedTemplates.slice();
      templates.push(template);
      setSelectedTemplates(templates);
    } else {
      const templates = selectedTemplates.filter((t: any) => t !== template);
      setSelectedTemplates(templates);
    }
  };

  const consolidateTemplates = () => {
    const beginningArray: any = [];
    console.log("consolidateTemplates - selectedTemplates", selectedTemplates);
    selectedTemplates.forEach((t: any) => beginningArray.push(...t));
    const finalArray: any = [];
    beginningArray.forEach((t: any) => {
      const duplicateField = finalArray.some((caf: any) => caf.field === t.field);
      if(!duplicateField){
        finalArray.push(t);
      }
    });
    console.log("consolidateTemplates - finalArray", finalArray);
    return finalArray;
  };

  const readUploadFile = (e: any) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = e => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        console.log(json);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

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
            onChange={(event: any) => {
              const checked = event.target.checked;
              console.log("Triton onChange", checked, createTemplates.CREATE_CALABRIO_QM_USER);
              updateSelectedTemplates(checked, createTemplates.CREATE_TRITON_USER);
            }}
            style={{ padding: "0px" }}
          />
        </SelectionWrapper>
        <SelectionWrapper>
        Calabrio QM
          <Checkbox
            checked={selectedTemplates.some((t: any) => t === createTemplates.CREATE_CALABRIO_QM_USER)}
            onChange={(event: any) => {
              const checked = event.target.checked;
              console.log("QM onChange", checked, createTemplates.CREATE_CALABRIO_QM_USER);
              updateSelectedTemplates(checked, createTemplates.CREATE_CALABRIO_QM_USER);
            }}
            style={{ padding: "0px" }}
          />
        </SelectionWrapper>
      </Row>
      <ButtonWrapper>
        <ExportTemplateButton
          template={consolidatedTemplates}
          label="Export Template"
          styles={{ width: "200px" }}
        />
        <input
          type="file"
          name="upload"
          id="upload"
          onChange={readUploadFile}
        >Import CSV</input>
      </ButtonWrapper>
    </BulkChangesWrapper>
  );
};

export default BulkUpload;