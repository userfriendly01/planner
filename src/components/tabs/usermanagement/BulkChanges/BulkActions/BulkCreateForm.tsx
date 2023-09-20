import {
  Row,
  SelectionWrapper,
  StepWrapper
} from "../BulkChanges.Styles";
import {
  Template,
  BulkActionFormProps
} from "../BulkChanges.Interfaces";
import BusinessUnitModal from "../BusinessUnitModal";
import { updateSelectedTemplates } from "../BulkUtils";
import { getCreateTemplates } from "../BulkTemplates";
import { useAdminState } from "context";
import React from "react";
import {
  Checkbox,
  Modal
} from "@mui/material";

const BulkCreateForm = (props: BulkActionFormProps) => {
  const {
    setBusinessUnitId,
    selectedTemplates,
    setSelectedTemplates
  } = props;

  const state = useAdminState();
  const createTemplates = getCreateTemplates(state);
  const [ showBusinessUnitModal, setShowBusinessUnitModal ] = React.useState(false);

  return (
    <>
      <Row>
        <StepWrapper>
          Step 1: Choose the applicable systems
        </StepWrapper>
        <SelectionWrapper>
          Twilio
          <Checkbox
            checked={selectedTemplates.some((t: Template) => t.name === "CREATE_TRITON_USER")}
            onChange={(event: any) => {
              const checked = event.target.checked;
              updateSelectedTemplates(checked, createTemplates.CREATE_TRITON_USER, selectedTemplates, setSelectedTemplates);
            }}
            style={{ padding: "0px" }}
          />
        </SelectionWrapper>
        <SelectionWrapper>
          Calabrio QM
          <Checkbox
            checked={selectedTemplates.some((t: Template) => t.name === "CREATE_CALABRIO_QM_USER")}
            onChange={(event: any) => {
              const checked = event.target.checked;
              updateSelectedTemplates(checked, createTemplates.CREATE_CALABRIO_QM_USER, selectedTemplates, setSelectedTemplates);
            }}
            style={{ padding: "0px" }}
          />
        </SelectionWrapper>
        <SelectionWrapper>
          Calabrio WFM
          <Checkbox
            checked={selectedTemplates.some((t: Template) => t.name === "CREATE_CALABRIO_WFM_PERSON")}
            onChange={(event: any) => {
              const checked = event.target.checked;
              if(checked){
                setShowBusinessUnitModal(true);
              }
              updateSelectedTemplates(checked, createTemplates.CREATE_CALABRIO_WFM_PERSON, selectedTemplates, setSelectedTemplates);
            }}
            style={{ padding: "0px" }}
          />
        </SelectionWrapper>
      </Row>
      <Modal open={showBusinessUnitModal} onClose={() => { return; }} >
        <>
          <BusinessUnitModal
            handleClose={() => setShowBusinessUnitModal(false)}
            handleConfirm={setBusinessUnitId}
          />
        </>
      </Modal>
    </>
  );
};

export default BulkCreateForm;