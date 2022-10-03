
import {
  StyledExportButton,
  SkillsExportButtonProps
} from "../";
import React from "react";
import { ExcelExport } from "@progress/kendo-react-excel-export";

const ExportButton = (props: SkillsExportButtonProps) => {
  const {
    checked
  } = props;

  const _export = React.useRef(null);

  const handleExport = () => {
    const columns = [
      {
        field: "name",
        title: "Skill Name",
        width: "50px"
      },
      {
        field: "closedMessage",
        title: "Closed Message",
        width: "200px"
      },
      {
        field: "flashMessage",
        title: "Flash Message",
        width: "200px"
      }
    ];
    if (_export.current !== null) {
      _export.current.save(checked, columns);
    }
  };

  return (
    <StyledExportButton onClick={handleExport}><ExcelExport ref={_export}/>Export</StyledExportButton>
  );
};

export default ExportButton;