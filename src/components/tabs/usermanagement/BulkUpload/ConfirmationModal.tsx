import React from "react";
import {
  ButtonWrapper,
  StyledExportButton
} from "./BulkUpload.Styles";
import { ExcelExport } from "@progress/kendo-react-excel-export";

const ConfirmationModal = (props: any) => {
  const {
    errorType,
    errors,
    uploadedForm
  } = props;
  //if there are validation errors, show export validation button and provide options to cancel or proceed with valid rows
  //if user selects proceed - hide confirmation form and show progress bar

  const _export = React.useRef(null);
  const totalRowCount = uploadedForm.length;
  const totalErrorCount = errors.length;
  const totalSuccessCount = totalRowCount - totalErrorCount;

  const handleExport = () => {
    const rows: any = errors;
    console.log("rows", rows);

    if (_export.current !== null) {
      _export.current.save(rows);
    }
  };

  return (
    <div>
      {totalErrorCount} {errorType} Errors have been found for this template.
      <ButtonWrapper>
        <StyledExportButton>
          Cancel
        </StyledExportButton>
        <StyledExportButton onClick={handleExport}><ExcelExport ref={_export}/>
          Export {errorType} Errors
        </StyledExportButton>
        <StyledExportButton>
          Process {totalSuccessCount} out of {totalRowCount} rows
        </StyledExportButton>
      </ButtonWrapper>

    </div>
  );
};

export default ConfirmationModal;