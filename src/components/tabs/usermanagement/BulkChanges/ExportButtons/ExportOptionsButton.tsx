
import { Button } from "../BulkChanges.Styles";
import React from "react";
import {
  ExcelExport
} from "@progress/kendo-react-excel-export";

const ExportOptionsButton = (props: any) => {
  const {
    template,
    state
  } = props;

  const _export = React.useRef(null);
  console.log("ExportOptionsButton Template", template);
  console.warn("_export", _export);
  const handleExport = () => {
    const rows: any = [];
    const columns: any = [];
    template.forEach((t: any) => {
      if(t.options){
        const options = t.options(state);
        if(options.length > 0){
          columns.push({
            field: t.field,
            title: t.name,
            width: t.width,
            options: options,
            wrap: true,
            textAlign: "center"
          });
        }
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

    if (_export !== null) {
      _export.current.save(rows, columns);
    }
  };

  return (
    <Button onClick={handleExport}>
      <ExcelExport ref={_export}/>
      Export Template Options
    </Button>
  );
};

export default ExportOptionsButton;