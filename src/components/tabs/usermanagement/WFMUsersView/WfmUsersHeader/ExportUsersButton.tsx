
import { StyledExportButton } from "./WfmUsersHeader.Styles";
import { ExportWfmUserProps } from "./WfmUsersHeader.Interfaces";
import React from "react";
import { ExcelExport } from "@progress/kendo-react-excel-export";

const ExportButton = (props: ExportWfmUserProps) => {
  const {
    selected,
    label
  } = props;

  const _export = React.useRef(null);
  const rows: any[] = [];

  const handleExport = () => {
    const columns = [
      {
        field: "emp_first_name",
        title: "First Name",
        width: "100px"
      },
      {
        field: "emp_last_name",
        title: "Last Name",
        width: "100px"
      },
      {
        field: "n_number",
        title: "N Number",
        width: "100px"
      },
      {
        field: "email",
        title: "Email",
        width: "100px"
      },
      {
        field: "extension",
        title: "Extension",
        width: "100px"
      },
      {
        field: "profile_id",
        title: "Profile Id",
        width: "100px"
      },
      {
        field: "manager_n_number",
        title: "Manager N Number",
        width: "100px"
      },
      {
        field: "manager",
        title: "Manager",
        width: "100px"
      },
      {
        field: "directDialNum",
        title: "Direct Dial Number",
        width: "100px"
      },
      {
        field: "sid",
        title: "Worker Sid",
        width: "100px"
      }
    ];
    if (_export.current !== null) {
      _export.current.save(rows, columns);
    }
  };

  return (
    <StyledExportButton onClick={handleExport}><ExcelExport ref={_export}/>{label ? label : "Export"}</StyledExportButton>
  );
};

export default ExportButton;