import React from "react";
import {
  views,
  LoadingStatus
} from "./BulkChanges.Interfaces";
import {
  BulkChangesWrapper,
  ImportButton,
  Row,
  StepWrapper,
  Wrapper
} from "./BulkChanges.Styles";
import { Dropdown } from "components";
import BulkCreateForm from "./BulkActions/BulkCreateForm";
import ExportButtons from "./ExportButtons/ExportButtons";
import ProcessingModal from "./Processing/ProcessingModal";
import { Modal } from "@mui/material";
import * as XLSX from "xlsx";

const BulkChanges = () => {

  //Define prerequisites somewhere, managers and calabrio teams added before hand

  const uploadButtonRef = React.useRef<HTMLInputElement>();
  const [ view, setView ] = React.useState(views.BULK_CREATE_USERS);
  const [ selectedTemplates, setSelectedTemplates ] = React.useState([]);
  const [ consolidatedTemplate, setConsolidatedTemplates ] = React.useState([]);
  const [ uploadedForm, setUploadedForm ] = React.useState(null);

  const [ showProcessingModal , setShowProcessingModal ] = React.useState(false);

  React.useEffect(() => {
    consolidateTemplates();
  }, [selectedTemplates]);

  const resetBulkChanges = () => {
    setShowProcessingModal(false);
    setSelectedTemplates([]);
    setConsolidatedTemplates([]);
    setUploadedForm(null);
  };

  const updateSelectedTemplates = (checked: boolean, template: any) => {
    const templates = selectedTemplates.slice();
    const templateFound = templates.some((t: any) => t.name === template.name);
    console.log("updateSelectedTemplates- templates", templates);
    console.log("updateSelectedTemplates- templateFound", templateFound);

    if(checked && !templateFound) {
      templates.push(template);
      setSelectedTemplates(templates);
    } else if(!checked && templateFound) {
      setSelectedTemplates(templates.filter((t: any) => t.name !== template.name));
    }
  };

  const consolidateTemplates = () => {
    const beginningArray: any = [];
    selectedTemplates.forEach((t: any) => beginningArray.push(...t.fields));
    const consolidatedFieldsList: any = [];
    beginningArray.forEach((bt: any) => {
      const duplicateField = consolidatedFieldsList.some((field: any) => field.field === bt.field);
      if(!duplicateField){
        consolidatedFieldsList.push(bt);
      }
    });
    console.log("consolidatedFieldsList", consolidatedFieldsList);
    setConsolidatedTemplates(consolidatedFieldsList);
  };

  const readUploadFile = (e: any) => {
    console.log("UPLOAD FILED", e);
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = e => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        console.log(json); // missing 1 row?
        setUploadedForm(json);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const initiateUpload = () => {
    setShowProcessingModal(true);
  };

  return (
    <BulkChangesWrapper>
      <Dropdown
        label="Select a change type"
        value={view}
        options={Object.values(views)}
        updateValue={(event: any, view: any) => {
          setView(view);
          resetBulkChanges();
        }}
        styles={{
          margin: "40 0 30 0",
          width: "500px"
        }}
      />
      <Modal onClose={() => { return; }} open={showProcessingModal}>
        <>
          <ProcessingModal
            selectedTemplates={selectedTemplates}
            handleClose={resetBulkChanges}
            uploadedForm={uploadedForm}
            consolidatedFieldsList={consolidatedTemplate}
          />
        </>
      </Modal>
      { view === views.BULK_CREATE_USERS &&
        <BulkCreateForm
          selectedTemplates = {selectedTemplates}
          updateSelectedTemplates={updateSelectedTemplates}
        />
      }
      { selectedTemplates.length > 0 &&
        <>
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
            <Wrapper center={true}>
              <ImportButton onClick={() => uploadButtonRef.current.click()} >Upload Spreadsheet</ImportButton>
            </Wrapper>
          </Row>
        </>
      }
      { uploadedForm &&
        <Row>
          <StepWrapper>
            Step 4: Process Bulk Create
          </StepWrapper>
          <Wrapper center={true}>
            <ImportButton
              onClick={initiateUpload}>Process</ImportButton>
          </Wrapper>
        </Row>
      }
      <input
        type="file"
        ref={uploadButtonRef}
        hidden={true}
        onChange={readUploadFile}
      />
    </BulkChangesWrapper>
  );
};

export default BulkChanges;