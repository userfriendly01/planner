
import { StyledExportButton } from "usermanagement/TritonUsersHeader.Styles";
import { ExportTritonUserProps } from "usermanagement/TritonUsersHeader.Interfaces";
import React from "react";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { formatWorkerAttributeSkillsToString } from "utils/skillsUtils";
import { useAdminState } from "context/appContext";
import { exportColumns } from "globals";

export const ExportUsersButton = (props: ExportTritonUserProps) => {
  const {
    selected,
    label
  } = props;

  const state = useAdminState();

  const _export = React.useRef(null);
  const rows = selected.map((worker: any) => {
    const workerObj: any = {
      ...worker
    };

    const caller_states = worker.attributes?.routing?.caller_states;
    const profile = state.profileContext.profiles.find((p: any) => String(p.profile_id) === String(worker.attributes.profile_id));
    const salesAssociateWorkers = worker.attributes?.routing?.sales_assoc_workers;

    Object.keys(worker.attributes).forEach((key: any) => {
      workerObj[key] = worker.attributes[key];
    });
    workerObj.roles = worker.attributes?.roles?.toString();
    workerObj.routing_team = worker.attributes?.routing?.team;
    workerObj.routing_caller_states = caller_states ? caller_states.join(", ") : "";
    workerObj.current_skills = formatWorkerAttributeSkillsToString(worker.attributes?.routing).toString();
    workerObj.default_skills = formatWorkerAttributeSkillsToString(worker.attributes?.default_skills).toString();
    workerObj.disabled_skills = formatWorkerAttributeSkillsToString(worker.attributes?.disabled_skills).toString();
    workerObj.ou = profile ? profile.ou_sid : "";
    workerObj.sales_assoc_workers = salesAssociateWorkers ? salesAssociateWorkers.join(", ") : "";
    workerObj.outbound_number = workerObj.caller_id;

    delete workerObj.attributes;
    return workerObj;
  });

  const handleExport = () => {
    if (_export.current !== null) {
      _export.current.save(rows, exportColumns);
    }
  };

  return (
    <div style={{
      width: "50%",
      margin: "10px"
    }}>
      <StyledExportButton onClick={handleExport}><ExcelExport ref={_export}/>{label ? label : "Export"}</StyledExportButton>
    </div>
  );
};