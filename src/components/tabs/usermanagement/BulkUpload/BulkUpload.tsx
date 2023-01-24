import React from "react";
import {
  BulkChangesWrapper,
  ButtonWrapper,
  ImportButton
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
    BULK_CREATE: {
      value: "CREATE_USERS",
      label: "Create Users"
    },
    BULK_UPDATE: {
      value: "BULK_UPDATE",
      label: "Bulk Update"
    }
  };

  const uploadButtonRef = React.useRef<HTMLInputElement>();
  const [ view, setView ] = React.useState(views.BULK_UPLOAD);
  const [ selectedTemplates, setSelectedTemplates ] = React.useState([]);
  const [ consolidatedTemplates, setConsolidatedTemplates ] = React.useState([]);

  React.useEffect(() => {
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
      <ButtonWrapper>
        Step 2: Export Template & Template Options
        <ExportButtons template={consolidatedTemplates} />
      </ButtonWrapper>
      <ButtonWrapper>
        Step 3: Import completed Spreadsheet
        <ImportButton onClick={() => uploadButtonRef.current.click()} >Upload Spreadsheet</ImportButton>
      </ButtonWrapper>
      Step 4: Process Bulk Create
      <StyledButton>Process</StyledButton>
      <input type="file" ref={uploadButtonRef} style={{
        visibility: "hidden",
        height: "0px"
      }} onChange={readUploadFile} />
    </BulkChangesWrapper>
  );
};

export default BulkUpload;