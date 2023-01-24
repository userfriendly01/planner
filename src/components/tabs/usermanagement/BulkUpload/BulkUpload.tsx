import React from "react";
import {
  BulkChangesWrapper,
  ButtonWrapper,
  ImportButton,
  Row,
  StepWrapper
} from "./BulkUpload.Styles";
import {
  Dropdown,
  StyledButton
} from "components";
import BulkCreateForm from "./BulkCreateForm";
import ExportButtons from "./ExportButtons/ExportButtons";
import * as XLSX from "xlsx";

const BulkUpload = () => {

  const views: any = {
    BULK_CREATE_USERS: {
      value: "BULK_CREATE_USERS",
      label: "Create Users"
    },
    BULK_UPDATE: {
      value: "BULK_UPDATE",
      label: "Bulk Update"
    }
  };

  const uploadButtonRef = React.useRef<HTMLInputElement>();
  const [ view, setView ] = React.useState(views.BULK_CREATE_USERS);
  const [ selectedTemplates, setSelectedTemplates ] = React.useState([]);
  const [ consolidatedTemplate, setConsolidatedTemplates ] = React.useState([]);

  React.useEffect(() => {
    const final = consolidateTemplates();
    setConsolidatedTemplates(final);
    console.log("Bulk Upload UseEffect", final);
  }, [selectedTemplates]);

  console.log("view component logic", view, views, view === views.BULK_CREATE_USERS);

  const updateSelectedTemplates = (checked: boolean, template: any) => {
    const templates = selectedTemplates.slice();
    const templateFound = selectedTemplates.some((t: any) => t.name !== template.name);

    if(checked && !templateFound) {
      templates.push(template);
      setSelectedTemplates(templates);
    } else if(!checked && templateFound) {
      setSelectedTemplates(templates.filter((t: any) => t.name !== template.name));
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
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        console.log(json);
        console.log("More Es", e);
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
      <BulkCreateForm
        selectedTemplates = {selectedTemplates}
        updateSelectedTemplates={updateSelectedTemplates}
      />
      <Row>
        <StepWrapper>
          Step 2: Export Template & Template Options
        </StepWrapper>
        <ExportButtons template={consolidatedTemplate} />
      </Row>
      <Row>
        <StepWrapper>
          Step 3: Import completed Spreadsheet
        </StepWrapper>
        <ImportButton onClick={() => uploadButtonRef.current.click()} >Upload Spreadsheet</ImportButton>
        <input type="file" ref={uploadButtonRef} style={{
          visibility: "hidden",
          height: "0px"
        }} onChange={readUploadFile} />
      </Row>
      <Row>
        <StepWrapper>
          Step 4: Process Bulk Create
        </StepWrapper>
        <StyledButton>Process</StyledButton>
      </Row>
    </BulkChangesWrapper>
  );
};

export default BulkUpload;