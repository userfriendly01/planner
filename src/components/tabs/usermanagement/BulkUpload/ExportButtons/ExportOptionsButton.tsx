
import { StyledExportButton } from "../BulkUpload.Styles";
import React from "react";
import {
  ExcelExport
} from "@progress/kendo-react-excel-export";

const ExportOptionsButton = (props: any) => {
  const { template } = props;

  const _export = React.useRef(null);
  console.log("ExportOptionsButton Template", template);

  const handleExport = () => {
    const rows: any = [];
    const columns: any = [];
    template.forEach((t: any) => {
      if(t.options && t.options.length > 0) {
        console.log("Pushing onto options column", {
          field: t.field,
          title: t.name,
          width: t.width,
          options: t.options,
          wrap: true,
          textAlign: "center"
        });
        columns.push({
          field: t.field,
          title: t.name,
          width: t.width,
          options: t.options,
          wrap: true,
          textAlign: "center"
        });
      }
    });

    columns.forEach((c: any) => {
      const field = c.field;
      const options = c.options;
      options.forEach((o: any, i: number) => {
        if(rows[i]){
          rows[i][field] = o;
        } else {
          rows.push({
            [field]: o
          });
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
    <StyledExportButton onClick={handleExport}>
      <ExcelExport ref={_export}/>
      Export Template Options
    </StyledExportButton>
  );
};

export default ExportOptionsButton;