
import { StyledExportButton } from "../Skills.Styles";
import { SkillsExportButtonProps } from "../Skills.Interfaces";
import React from "react";
import { ExcelExport } from "@progress/kendo-react-excel-export";

const ExportButton = (props: SkillsExportButtonProps) => {
  const {
    selected,
    label,
    styles
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
      _export.current.save(selected, columns);
    }
  };

  return (
    <StyledExportButton onClick={handleExport} styles={styles}><ExcelExport ref={_export}/>{label ? label : "Export"}</StyledExportButton>
  );
};

export default ExportButton;