import React from "react";
import {
  BulkChangesWrapper,
  ImportButton,
  Row,
  StepWrapper,
  Wrapper
} from "./BulkUpload.Styles";
import { Dropdown } from "components";
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

  enum LoadingStatus {
    LOADING = "loading",
    VALIDATION_COMPLETE = "",
    PROCESSING_COMPLETE = ""
  }

  const uploadButtonRef = React.useRef<HTMLInputElement>();
  const [ view, setView ] = React.useState(views.BULK_CREATE_USERS);
  const [ selectedTemplates, setSelectedTemplates ] = React.useState([]);
  const [ consolidatedTemplate, setConsolidatedTemplates ] = React.useState([]);
  const [ uploadedForm, setUploadedForm ] = React.useState(null);
  const [ validationErrors, setValidationErrors ] = React.useState(null);
  const [ loading, setLoading ] = React.useState(null);

  React.useEffect(() => {
    const final = consolidateTemplates();
    setConsolidatedTemplates(final);
    console.log("Bulk Upload UseEffect", final);
  }, [selectedTemplates]);

  console.log("view component logic", view, views, view === views.BULK_CREATE_USERS);

  const updateSelectedTemplates = (checked: boolean, template: any) => {
    const templates = selectedTemplates.slice();
    console.log("updateSelectedTemplates", templates.slice());
    const templateFound = templates.some((t: any) => t.name === template.name);
    console.log("templateFound", templateFound);

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
    selectedTemplates.forEach((t: any) => beginningArray.push(...t.fields));
    const consolidatedFieldsList: any = [];
    console.log("consolidateTemplates - beginningArray", beginningArray.slice());
    beginningArray.forEach((t: any) => {
      const duplicateField = consolidatedFieldsList.some((field: any) => field.field === t.field);
      if(!duplicateField){
        consolidatedFieldsList.push(t.fields);
      }
    });
    console.log("consolidateTemplates - consolidatedFieldsList", consolidatedFieldsList);
    return consolidatedFieldsList;
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
        setUploadedForm(json);
        console.log("More Es", e);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const validateFields = () => {
    //Loop through consolidated fields
    //Make sure they are all present, in the right format, and within the options where applicable
    //collect errors
    //forward errors to validation export button
    //Confirmation is shown when process upload is clicked and validation is done
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
        <Wrapper>
          <ExportButtons template={consolidatedTemplate} />
        </Wrapper>
      </Row>
      <Row>
        <StepWrapper>
          Step 3: Upload completed Spreadsheet
        </StepWrapper>
        <Wrapper>
          <ImportButton onClick={() => uploadButtonRef.current.click()} >Upload Spreadsheet</ImportButton>
        </Wrapper>
      </Row>
      <Row>
        <StepWrapper>
          Step 4: Process Bulk Create
        </StepWrapper>
        <Wrapper>
          <ImportButton>Process</ImportButton>
        </Wrapper>
      </Row>
      <input type="file" ref={uploadButtonRef} style={{
        visibility: "hidden",
        height: "0px"
      }} onChange={readUploadFile} />
    </BulkChangesWrapper>
  );
};

export default BulkUpload;