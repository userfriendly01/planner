
import { StyledExportButton } from "../BulkChanges.Styles";
import React from "react";
import {
  ExcelExport
} from "@progress/kendo-react-excel-export";

const ExportSuccessButton = (props: any) => {
  const { successfulRows } = props;

  const _export = React.useRef(null);
  console.log("ExportSuccessButton successfulRows", successfulRows);

  const handleExport = () => {
    const rows: any = successfulRows;
    const columns: any = [];

    successfulRows.forEach((r: any) => {
      Object.keys(r).forEach((key: string) => {
        if(!columns.find((c:any) => c.title === key)) {
          columns.push({
            title: key,
            field: key,
            width: "50px"
          });
        }
      });
    });

    rows.forEach((row: any) => {
      Object.keys(row).forEach((key: any) => {
        if(typeof row[key] !== "string"){
          [key] = row[key].toString();
        }
      });
    });

    console.log("rows", rows);
    console.log("columns", columns);

    if (_export.current !== null) {
      _export.current.save(rows, columns);
    }
  };

  return (
    <StyledExportButton onClick={handleExport}><ExcelExport ref={_export}/>Export Successful Rows</StyledExportButton>
  );
};

export default ExportSuccessButton;