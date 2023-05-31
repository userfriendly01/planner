import {
  BulkCreateForm,
  BulkUpdateForm
} from "./BulkActions";
import {
  readUploadFile,
  consolidateTemplates
} from "./BulkUtils";
import {
  Template,
  View,
  views
} from "./BulkChanges.Interfaces";
import { getCreateTemplates } from "./BulkTemplates";
import {
  BulkChangesWrapper,
  ButtonWrapper,
  FileNameWrapper,
  ImportButton,
  Row,
  StepWrapper,
  Wrapper
} from "./BulkChanges.Styles";
import {
  ExportTemplateButton,
  ExportOptionsButton
} from "./ExportButtons";
import { ProcessingModal } from "./Processing";
import WFMLoadRetryModal from "./WFMLoadRetryModal";
import { checkIfBulkAdmin } from "authentication";
import { Dropdown } from "components";
import { useAdminState } from "context";
import React from "react";
import { Modal } from "@mui/material";

const BulkChanges = () => {

  const state = useAdminState();
  const uploadButtonRef = React.useRef<HTMLInputElement>();
  const [ view, setView ] = React.useState(views.BULK_CREATE_USERS);
  const [ selectedTemplates, setSelectedTemplates ] = React.useState<Template[]>([]);
  const [ consolidatedTemplate, setConsolidatedTemplates ] = React.useState([]);
  const [ uploadedForm, setUploadedForm ] = React.useState(null);
  const [ filenameText, setFilenameText ] = React.useState(null);
  const [ showProcessingModal , setShowProcessingModal ] = React.useState(false);
  const [ showWFMLoadModal, setShowWFMLoadModal ] = React.useState(false);
  const createTemplates = getCreateTemplates(state);

  React.useEffect(() => {
    consolidateTemplates(selectedTemplates, setConsolidatedTemplates);

    // If wfm user template is selected, but the options failed to load, try to reload them in the modal
    if(selectedTemplates.some((t: Template) => t.name === "CREATE_CALABRIO_WFM_PERSON")) {
      const isLoaded = checkIfWFMLoaded();
      if (!isLoaded) {
        setShowWFMLoadModal(true);
      }
    }
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

  return (
    <>
      { checkIfBulkAdmin ?
        <BulkChangesWrapper>
          <Dropdown
            label="Select a change type"
            value={view}
            options={Object.values(views)}
            updateValue={(event: any, view: View) => {
              setView(view);
              resetBulkChanges();
              if(view === views.BULK_ADD_MANAGER){
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
          <Modal open={showWFMLoadModal} onClose={() => { return; }} >
            <>
              <WFMLoadRetryModal
                handleClose={() => setShowWFMLoadModal(false)}
              />
            </>
          </Modal>
          { view === views.BULK_CREATE_USERS &&
        <BulkCreateForm
          selectedTemplates= {selectedTemplates}
          setSelectedTemplates= {setSelectedTemplates}
        />
          }
          { view === views.BULK_UPDATE &&
        <BulkUpdateForm
          selectedTemplates= {selectedTemplates}
          setSelectedTemplates= {setSelectedTemplates}
        />
          }
          { view === views.BULK_ADD_MANAGER &&
        <Row>
          <StepWrapper>
            Step 1: Mentally Prepare
          </StepWrapper>
        </Row>
          }
          { selectedTemplates.length > 0 &&
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
                selectedTemplates={selectedTemplates}
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
          { uploadedForm &&
        <Row>
          <StepWrapper>
            Step 4: Process Bulk Create
          </StepWrapper>
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
              if(e.target.files && e.target.files.length){
                setFilenameText(`${e.target.files[0].name} has been uploaded`);
              }
            }}
            onClick={(e: any) => {
              e.target.value=null;
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

export default BulkChanges;