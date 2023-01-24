
import { StyledExportButton } from "./BulkUpload.Styles";
import React from "react";
import { ExcelExport } from "@progress/kendo-react-excel-export";

const ExportTemplateButton = (props: any) => {
  const {
    templates,
    label,
    styles
  } = props;

  const _export = React.useRef(null);
  console.log("Templates", templates);

  const handleExport = () => {
    const rows: any = [];
    const columns: any = [];
    if (_export.current !== null) {
      _export.current.save(rows, columns);
    }
  };

  return (
    <StyledExportButton onClick={handleExport} styles={styles}><ExcelExport ref={_export}/>{label ? label : "Export Template"}</StyledExportButton>
  );
};

export default ExportTemplateButton;