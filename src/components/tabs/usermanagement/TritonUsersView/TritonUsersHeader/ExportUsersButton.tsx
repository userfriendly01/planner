
import { StyledExportButton } from "./TritonUsersHeader.Styles";
import { ExportTritonUserProps } from "./TritonUsersHeader.Interfaces";
import React from "react";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { formatWorkerAttributeSkillsToString } from "utils";
import { useAdminState } from "context";
import { exportColumns } from "globals";

const ExportButton = (props: ExportTritonUserProps) => {
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

    const callerStates = worker.attributes?.routing?.callerStates;
    const profile = state.profileContext.profiles.find((p: any) => String(p.profile_id) === String(worker.attributes.profile_id));
    const salesAssociateWorkers = worker.attributes?.routing?.sales_assoc_workers;

    Object.keys(worker.attributes).forEach((key: any) => {
      workerObj[key] = worker.attributes[key];
    });
    workerObj.roles = worker.attributes?.roles?.toString();
    workerObj.routing_team = worker.attributes?.routing?.team;
    workerObj.routing_caller_states = callerStates ? callerStates.join(", ") : "";
    workerObj.current_skills = formatWorkerAttributeSkillsToString(worker.attributes?.routing).toString();
    workerObj.default_skills = formatWorkerAttributeSkillsToString(worker.attributes?.default_skills).toString();
    workerObj.disabled_skills = formatWorkerAttributeSkillsToString(worker.attributes?.disabled_skills).toString();
    workerObj.ou = profile ? profile.operating_unit_nme : "";
    workerObj.sales_assoc_workers = salesAssociateWorkers ? salesAssociateWorkers.join(", ") : "";

    if(!workerObj.directDialNum){
      workerObj.outbound_number = workerObj.did;
    }
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

export default ExportButton;