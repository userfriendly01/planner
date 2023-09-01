
import { Button } from "../BulkChanges.Styles";
import React from "react";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { logger } from "utils";

const ExportErrorsButton = (props: any) => {
  const { errors } = props;

  const _export = React.useRef(null);
  logger.log("ExportErrorsButton Template", errors);

  const handleExport = () => {
    const rows: any = [];
    const columns: any = [
      {
        title: "Row",
        field: "row",
        width: "75px"
      },
      {
        title: "Errors",
        field: "errors",
        width: "400px"
      },
      {
        title: "WFM External Logon - Failed Activations",
        field: "wfmErrors",
        width: "400px"
      }
    ];

    errors.forEach((error: any) => {
      rows.push({
        row: error.rowNumber,
        errors: error.errors.toString(),
        wfmErrors: error.wfmErrors
      });
    });

    logger.log("rows", rows);
    logger.log("columns", columns);
    if (_export !== null) {
      _export.current.save(rows, columns);
    }
  };

  return (
    <Button onClick={handleExport}><ExcelExport ref={_export}/>Export Errors</Button>
  );
};

export default ExportErrorsButton;