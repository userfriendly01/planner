
import { Button } from "../BulkChanges.Styles";
import React from "react";
import {
  ExcelExport
} from "@progress/kendo-react-excel-export";
import { logger } from "utils";

const ExportTemplateButton = (props: any) => {
  const { template } = props;

  const _export = React.useRef(null);
  logger.log("ExportTemplateButton Template", template);

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

    logger.log("rows", rows);
    logger.log("columns", columns);

    if (_export !== null) {
      _export.current.save(rows, columns);
    }
  };

  return (
    <Button onClick={handleExport}><ExcelExport ref={_export}/>Export Template</Button>
  );
};

export default ExportTemplateButton;