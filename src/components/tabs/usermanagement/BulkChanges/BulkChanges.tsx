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
import {
  readUploadFile,
  consolidateTemplates
} from "./BulkUtils/utils";
import { Dropdown } from "components";
import BulkCreateForm from "./BulkActions/BulkCreateForm";
import ExportButtons from "./ExportButtons/ExportButtons";
import ProcessingModal from "./Processing/ProcessingModal";
import { Modal } from "@mui/material";

const BulkChanges = () => {

  const uploadButtonRef = React.useRef<HTMLInputElement>();
  const [ view, setView ] = React.useState(views.BULK_CREATE_USERS);
  const [ selectedTemplates, setSelectedTemplates ] = React.useState([]);
  const [ consolidatedTemplate, setConsolidatedTemplates ] = React.useState([]);
  const [ uploadedForm, setUploadedForm ] = React.useState(null);

  const [ showProcessingModal , setShowProcessingModal ] = React.useState(false);

  React.useEffect(() => {
    consolidateTemplates(selectedTemplates, setConsolidatedTemplates);
  }, [selectedTemplates]);

  const resetBulkChanges = () => {
    setShowProcessingModal(false);
    setSelectedTemplates([]);
    setConsolidatedTemplates([]);
    setUploadedForm(null);
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
          setSelectedTemplates={setSelectedTemplates}
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
              onClick={() => setShowProcessingModal(true)}>Process</ImportButton>
          </Wrapper>
        </Row>
      }
      <input
        type="file"
        ref={uploadButtonRef}
        hidden={true}
        onChange={(e: any) => readUploadFile(e, setUploadedForm)}
      />
    </BulkChangesWrapper>
  );
};

export default BulkChanges;