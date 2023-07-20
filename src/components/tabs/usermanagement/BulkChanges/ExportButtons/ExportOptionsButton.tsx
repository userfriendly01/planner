
import { Button } from "../BulkChanges.Styles";
import { Template } from "../BulkChanges.Interfaces";
import React from "react";
import {
  ExcelExport
} from "@progress/kendo-react-excel-export";

const ExportOptionsButton = (props: any) => {
  const {
    template,
    state,
    disabled,
    businessUnitId
  } = props;

  const _export = React.useRef(null);
  console.log("ExportOptionsButton Template", template);

  const handleExport = () => {
    const rows: any = [];
    const columns: any = [];
    template.forEach((t: any) => {
      if(t.options){
        let options = [];
        // To generate the wfm field options, the selected Business Unit needs to be passed into the options function
        // in order to generate the appropriate list of options
        // all wfm fields are prefixed with wfm
        if (t.field.includes("wfm")) {
          options = t.options(state, businessUnitId);
        } else {
          options = t.options(state);
        }
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
    <Button onClick={handleExport} disabled={disabled}>
      <ExcelExport ref={_export}/>
      Export Template Options
    </Button>
  );
};

export default ExportOptionsButton;