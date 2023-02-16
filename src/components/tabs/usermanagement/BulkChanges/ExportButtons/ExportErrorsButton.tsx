
import { Button } from "../BulkChanges.Styles";
import React from "react";
import { ExcelExport } from "@progress/kendo-react-excel-export";

const ExportErrorsButton = (props: any) => {
  const { errors } = props;

  const _export = React.useRef(null);
  console.log("ExportErrorsButton Template", errors);

  const handleExport = () => {
    const rows: any = [];
    const columns: any = [
      {
        title: "Row",
        field: "row",
        width: "50px"
      },
      {
        title: "Errors",
        field: "errors",
        width: "400px"
      }
    ];

    errors.forEach((error: any) => {
      rows.push({
        row: error.row,
        errors: error.errors.toString()
      });
    });

    console.log("rows", rows);
    console.log("columns", columns);
    if (_export !== null) {
      _export.current.save(rows, columns);
    }
  };

  return (
    <Button onClick={handleExport}><ExcelExport ref={_export}/>Export Errors</Button>
  );
};

export default ExportErrorsButton;