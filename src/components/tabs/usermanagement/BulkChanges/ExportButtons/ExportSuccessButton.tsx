
import { Button } from "../BulkChanges.Styles";
import React from "react";
import {
  ExcelExport
} from "@progress/kendo-react-excel-export";

const ExportSuccessButton = (props: any) => {
  const { successfulRows } = props;

  const _export = React.useRef(null);

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
        if(typeof row[key] === "object"){
          row[key] = JSON.stringify(row[key]);
        }
      });
    });

    if (_export !== null) {
      _export.current.save(rows, columns);
    }
  };

  return (
    <Button onClick={handleExport}><ExcelExport ref={_export}/>Export Successful Rows</Button>
  );
};

export default ExportSuccessButton;