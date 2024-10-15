
import {
  ButtonWrapper, ModalWrapper, StyledExportButton
} from "usermanagement/TritonUsersHeader.Styles";
import { ExportTritonUserProps } from "usermanagement/TritonUsersHeader.Interfaces";
import React, { useState } from "react";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { formatWorkerAttributeSkillsToString } from "utils/skillsUtils";
import {
  useAdminState, useAdminDispatch
} from "context/appContext";
import {
  exportColumns, termedUserExportColumns
} from "globals";
import {
  CircularProgress, Modal
} from "@mui/material";
import { StyledButton } from "components/StyledButton";
import { listInactiveUMUsers } from "services/user";
import { LoadingMessage } from "components/core/PageLoadSpinner/PageLoadSpinner.Styles";
import { theme } from "globals/theme";
import { UMUser } from "globals/interfaces";

export const ExportUsersButton = (props: ExportTritonUserProps) => {
  const {
    selected,
    label
  } = props;

  const state = useAdminState();
  const dispatch = useAdminDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingTermedUsers, setIsLoadingTermedUsers] = useState(false);
  const [inactiveWorkers, setInactiveWorkers] = useState([]);

  const _export = React.useRef(null);

  const generateRows = (workers: UMUser[]): unknown[] => {
    const rows = workers.map((worker: any) => {
      const workerObj: any = {
        ...worker
      };

      const backupWorkers = worker.attributes?.routing?.backup_workers;
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
      workerObj.ou = profile ? profile.ou_name : "";
      workerObj.backup_workers = backupWorkers ? backupWorkers.join(", ") : "";
      workerObj.sales_assoc_workers = salesAssociateWorkers ? salesAssociateWorkers.join(", ") : "";
      workerObj.outbound_number = workerObj.caller_id;

      delete workerObj.attributes;
      return workerObj;
    });
    return rows;
  };

  const handleActiveUserExport = () => {
    const rows = generateRows(selected);

    if (_export.current !== null) {
      _export.current.save(rows, exportColumns);
    }

    handleCloseModal();
  };

  const fetchTermedUsers = async () => {
    setIsLoadingTermedUsers(true);
    const inactiveUsers = await listInactiveUMUsers(dispatch);

    setInactiveWorkers(inactiveUsers);
    // just putting a test rando worker in so I don't need to keep the graph deployed
    // setInactiveWorkers([
    //   {
    //     did: "1234567890",
    //     attributes: {},
    //     isConsole: false,
    //     inactiveForwardTo: "s;ldkjfasldjf",
    //     inactive_date: "2024-10-10",
    //     sid: "workersid123"
    //   }
    // ]);
    setIsLoadingTermedUsers(false);
  };

  const handleTermedUserExport = async () => {
    const rows = generateRows(inactiveWorkers);

    console.log("rows", rows);
    console.log("_export", _export);
    if (_export.current !== null) {
      _export.current.save(rows, termedUserExportColumns);
    }

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setInactiveWorkers([]);
    setIsModalOpen(false);
  };

  return (
    <div style={{
      width: "50%",
      margin: "10px"
    }}>
      <Modal onClose={() => { return; }} open={isModalOpen}>
        <>
          <ModalWrapper>
            {isLoadingTermedUsers ?
              <>
                <LoadingMessage>Loading termed users...</LoadingMessage>
                <CircularProgress size={theme.circularProgressSize} />
              </>
              :
              <>
                {inactiveWorkers.length > 0 ?
                  <>
                    <div>Successfully retrieved Inactive Triton Users.  Click the button to Export</div>
                    <StyledButton onClick={handleTermedUserExport}>
                      <ExcelExport ref={_export}/>Export Inactive Users
                    </StyledButton>
                  </>
                  :
                  <>
                    <div>Do you want to export active Triton Users, or Inactive/terminated Users?</div>
                    <ButtonWrapper>
                      <StyledButton onClick={handleActiveUserExport}>
                        <ExcelExport ref={_export}/>Active Users
                      </StyledButton>
                      <StyledButton onClick={fetchTermedUsers}>
                      Fetch Inactive Users for Export
                      </StyledButton>
                    </ButtonWrapper>
                  </>
                }
              </>
            }
          </ModalWrapper>
        </>
      </Modal>
      <StyledExportButton onClick={() => setIsModalOpen(true)}>{label ? label : "Export"}</StyledExportButton>
    </div>
  );
};