import React from "react";
import {
  Dropdown,
  ExportButton,
  StyledButton
} from "components";
import { Checkbox } from "@mui/material";
import styled from "styled-components";

const BulkChangesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

const FlexRow = styled.div`
  display: flex;
  width: 80%;
  margin: 20px;
`;

const SelectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  height: 60px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  margin: 20px;
`;

const ImportButton = styled(StyledButton)`
  width: 200px
`;

const BulkUpload = () => {

  const views: any = {
    BULK_UPLOAD: {
      value: "BULK_CREATE",
      label: "Bulk Create"
    },
    BULK_UPDATE: {
      value: "BULK_UPDATE",
      label: "Bulk Update"
    },
    BULK_DELETE: {
      value: "BULK_DELETE",
      label: "Bulk Delete"
    }
  };

  const [ view, setView ] = React.useState(views.BULK_UPLOAD);
  const [ checked, setChecked ] = React.useState({
    TWILIO: true,
    WORKER_DATABASE: true,
    CALABRIO_QM: true,
    CALABRIO_WFM: true
  });

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
      <FlexRow>
        <SelectionWrapper>
        Twilio
          <Checkbox
            checked={checked.TWILIO}
            onChange={() => setChecked({
              ...checked,
              TWILIO: !checked.TWILIO
            })}
            style={{ padding: "0px" }}
          />
        </SelectionWrapper>
        <SelectionWrapper>
        Worker Database
          <Checkbox
            checked={checked.WORKER_DATABASE}
            onChange={() => setChecked({
              ...checked,
              WORKER_DATABASE: !checked.WORKER_DATABASE
            })}
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
        <SelectionWrapper>
        Calabrio WFM
          <Checkbox
            checked={checked.CALABRIO_WFM}
            onChange={() => setChecked({
              ...checked,
              CALABRIO_WFM: !checked.CALABRIO_WFM
            })}
            style={{ padding: "0px" }}
          />
        </SelectionWrapper>
      </FlexRow>
      <ButtonWrapper>
        <ExportButton
          selected={[]}
          label="Export Template"
          styles={{ width: "200px" }}
        />
        <ImportButton>Import CSV</ImportButton>
      </ButtonWrapper>
    </BulkChangesWrapper>
  );
};

export default BulkUpload;