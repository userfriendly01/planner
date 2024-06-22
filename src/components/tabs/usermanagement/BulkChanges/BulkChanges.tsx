import { BulkCreateForm } from "usermanagement/BulkCreateForm";
import { BulkUpdateForm } from "usermanagement/BulkUpdateForm";
import { readUploadFile } from "usermanagement/processingUtils";
import { consolidateTemplates } from "usermanagement/validationUtils";
import {
  Template,
  View,
  views
} from "usermanagement/BulkChanges.Interfaces";
import { getCreateTemplates } from "usermanagement/templates";
import {
  BulkChangesWrapper,
  ButtonWrapper,
  FileNameWrapper,
  ImportButton,
  Row,
  StepWrapper,
  Wrapper
} from "usermanagement/BulkChanges.Styles";
import { ExportTemplateButton } from "usermanagement/ExportTemplateButton";
import { ExportOptionsButton } from "usermanagement/ExportOptionsButton";
import { ProcessingModal } from "usermanagement/ProcessingModal";
import { checkIfBulkAdmin } from "authentication/authUtils";
import { Dropdown } from "components/Dropdown";
import { useAdminState } from "context/appContext";
import React from "react";
import { Modal } from "@mui/material";
import { PageLoadSpinner } from "components/PageLoadSpinner";
import {
  AppError, LoadStatuses
} from "globals/interfaces";

export const BulkChanges = () => {

  const state = useAdminState();
  const uploadButtonRef = React.useRef<HTMLInputElement>();
  const [view, setView] = React.useState(views.BULK_CREATE_USERS);
  const [showTemplates, setShowTemplates] = React.useState(true);
  const [selectedTemplates, setSelectedTemplates] = React.useState<Template[]>([]);
  const [consolidatedTemplate, setConsolidatedTemplates] = React.useState([]);
  const [uploadedForm, setUploadedForm] = React.useState(null);
  const [filenameText, setFilenameText] = React.useState(null);
  const [showProcessingModal, setShowProcessingModal] = React.useState(false);
  const [businessUnitId, setBusinessUnitId] = React.useState(null);
  const createTemplates = getCreateTemplates(state);

  React.useEffect(() => {
    consolidateTemplates(selectedTemplates, setConsolidatedTemplates);
  }, [selectedTemplates]);

  const resetBulkChanges = () => {
    setShowProcessingModal(false);
    setSelectedTemplates([]);
    setConsolidatedTemplates([]);
    setUploadedForm(null);
    setFilenameText(null);
  };

  const checkIfWFMLoaded = () => {
    const areOptionsLoaded = state.calabrioContext.wfmOptions.length > 0;
    const isOrgLoaded = state.calabrioContext.wfmOrg.length > 0;
    return areOptionsLoaded && isOrgLoaded;
  };

  const { loadStatus } = state.workerContext;

  if (loadStatus === LoadStatuses.LOADING && !showProcessingModal) {
    return (
      <BulkChangesWrapper>
        <PageLoadSpinner message="Loading Users, operations will be available once it completes"/>
      </BulkChangesWrapper>
    );
  }

  if (loadStatus === LoadStatuses.FAIL && !showProcessingModal) {
    return (
      <AppError>
        An error was thrown loading users, please refresh Triton to try again
      </AppError>
    );
  }

  return (
    <>
      {checkIfBulkAdmin ?
        <BulkChangesWrapper>
          <Dropdown
            label="Select a change type"
            value={view}
            options={Object.values(views)}
            updateValue={(event: any, view: View) => {
              setView(view);
              resetBulkChanges();
              if (view === views.BULK_ADD_MANAGER) {
                setSelectedTemplates([createTemplates.CREATE_MANAGER]);
              }
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
          {view === views.BULK_CREATE_USERS &&
            <BulkCreateForm
              businessUnitId={businessUnitId}
              setBusinessUnitId={setBusinessUnitId}
              selectedTemplates={selectedTemplates}
              setSelectedTemplates={setSelectedTemplates}
            />
          }
          {view === views.BULK_UPDATE &&
            <BulkUpdateForm
              setUploadedForm={setUploadedForm}
              setShowTemplates={setShowTemplates}
              selectedTemplates={selectedTemplates}
              setSelectedTemplates={setSelectedTemplates}
            />
          }
          {view === views.BULK_ADD_MANAGER &&
            <Row>
              <StepWrapper>
                Step 1: Mentally Prepare
              </StepWrapper>
            </Row>
          }
          {selectedTemplates.length > 0 && showTemplates &&
            <>
              <Row>
                <StepWrapper>
                  Step 2: Export Template & Template Options
                </StepWrapper>
                <ButtonWrapper>
                  <ExportTemplateButton template={consolidatedTemplate} />
                  <ExportOptionsButton
                    template={consolidatedTemplate}
                    state={state}
                    businessUnitId={businessUnitId}
                    disabled={
                      selectedTemplates.some((t: Template) => t.name === "CREATE_CALABRIO_WFM_PERSON") &&
                      !checkIfWFMLoaded()
                    }
                  />
                </ButtonWrapper>
              </Row>
              <Row>
                <StepWrapper>
                  Step 3: Upload completed Spreadsheet
                </StepWrapper>
                <Wrapper center={true} column={true} centrallyAlign={true}>
                  <ImportButton
                    onClick={() => uploadButtonRef.current.click()}
                    disabled={
                      selectedTemplates.some((t: Template) => t.name === "CREATE_CALABRIO_WFM_PERSON") &&
                      !checkIfWFMLoaded()
                    }
                  >Upload Spreadsheet</ImportButton>
                  <FileNameWrapper> {filenameText} </FileNameWrapper>
                </Wrapper>
              </Row>
            </>
          }
          {uploadedForm &&
            <Row>
              {showTemplates ? <StepWrapper> Step 4: Process </StepWrapper> : <StepWrapper> Step 2: Process </StepWrapper>}
              <Wrapper center={true}>
                <ImportButton
                  onClick={() => setShowProcessingModal(true)}
                  disabled={
                    selectedTemplates.some((t: Template) => t.name === "CREATE_CALABRIO_WFM_PERSON") &&
                    !checkIfWFMLoaded()
                  }
                >Process</ImportButton>
              </Wrapper>
            </Row>
          }
          <input
            data-testid="file-upload"
            type="file"
            ref={uploadButtonRef}
            hidden={true}
            onChange={(e: any) => {
              readUploadFile(e, setUploadedForm);
              if (e.target.files && e.target.files.length) {
                setFilenameText(`${e.target.files[0].name} has been uploaded`);
              }
            }}
            onClick={(e: any) => {
              e.target.value = null;
            }}
          />
        </BulkChangesWrapper>
        : <div>
          This view is temporarily restricted to Game of Phones Product Owners and Admins
        </div>
      }
    </>
  );
};