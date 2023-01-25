
import { StyledExportButton } from "../BulkUpload.Styles";
import React from "react";
import {
  ExcelExport
} from "@progress/kendo-react-excel-export";

const ExportErrorsButton = (props: any) => {
  const {
    errorType,
    errors
  } = props;

  const _export = React.useRef(null);
  console.log("ExportErrorsButton errors", errors);

  const handleExport = () => {
    const rows: any = errors;
    console.log("rows", rows);

    if (_export.current !== null) {
      _export.current.save(rows);
    }
  };

  return (
    <StyledExportButton onClick={handleExport}>
      <ExcelExport ref={_export}/>
      Export {errorType} Errors
    </StyledExportButton>
  );
};

export default ExportErrorsButton;