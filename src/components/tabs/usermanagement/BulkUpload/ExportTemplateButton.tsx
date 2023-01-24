
import { StyledExportButton } from "./BulkUpload.Styles";
import React from "react";
import {
  ExcelExport
} from "@progress/kendo-react-excel-export";

const ExportTemplateButton = (props: any) => {
  const {
    template,
    label,
    styles
  } = props;

  const _export = React.useRef(null);
  console.log("Template", template);

  const handleExport = () => {
    const rows: any = [];
    const columns: any = [];
    const description: any = {};
    const example: any = {};
    template.forEach((t: any) => {
      columns.push({
        field: t.field,
        title: t.name,
        width: t.width,
        wrap: true,
        textAlign: "center"
      });
    });

    template.forEach((t: any) => {
      const fieldName = t.field;
      description[fieldName] = t.description;
    });

    template.forEach((t: any) => {
      const fieldName = t.field;
      example[fieldName] = t.example;
    });

    rows.push(description);
    rows.push(example);

    console.log("rows", rows);
    console.log("columns", columns);

    if (_export.current !== null) {
      _export.current.save(rows, columns);
    }
  };

  return (
    <StyledExportButton onClick={handleExport} styles={styles}><ExcelExport ref={_export}/>{label ? label : "Export Template"}</StyledExportButton>
  );
};

export default ExportTemplateButton;