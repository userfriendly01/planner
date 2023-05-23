
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

  const handleExport = () => {
    const columns = [
      {
        field: "Id",
        title: "Id",
        width: "100px"
      },
      {
        field: "FirstName",
        title: "First Name",
        width: "100px"
      },
      {
        field: "LastName",
        title: "Last Name",
        width: "100px"
      },
      {
        field: "EmploymentNumber",
        title: "N Number",
        width: "100px"
      },
      {
        field: "Email",
        title: "Email",
        width: "100px"
      },
      {
        field: "Identity",
        title: "Identity",
        width: "100px"
      },
      {
        field: "BusinessUnitId",
        title: "Business Unit Id",
        width: "100px"
      },
      {
        field: "TeamId",
        title: "TeamId",
        width: "100px"
      },
      {
        field: "FirstDayOfWeek",
        title: "First Day Of Week",
        width: "100px"
      }
    ];
    if (_export.current !== null) {
      _export.current.save(selected, columns);
    }
  };

  return (
    <StyledExportButton onClick={handleExport}><ExcelExport ref={_export}/>{label ? label : "Export"}</StyledExportButton>
  );
};

export default ExportButton;