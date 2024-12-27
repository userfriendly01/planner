
import {
  ButtonWrapper, ModalWrapper, StyledExportButton, Text
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
  const [error, setError] = useState(undefined);

  const _export = React.useRef(null);

  const generateRows = (workers: UMUser[]): unknown[] => {
    const rows = workers.map((worker: any) => {
      const workerObj: any = {
        ...worker
      };

      const attributes = worker.attributes || {};
      const backupWorkers = attributes.routing?.backup_workers;
      const caller_states = attributes.routing?.caller_states;
      const profile = state.profileContext.profiles.find((p: any) => String(p.profile_id) === String(attributes.profile_id));
      const salesAssociateWorkers = attributes.routing?.sales_assoc_workers;

      Object.keys(attributes).forEach((key: any) => {
        workerObj[key] = attributes[key];
      });
      workerObj.roles = attributes.roles?.toString();
      workerObj.routing_team = attributes.routing?.team;
      workerObj.routing_caller_states = caller_states ? caller_states.join(", ") : "";
      workerObj.current_skills = formatWorkerAttributeSkillsToString(attributes.routing).toString();
      workerObj.default_skills = formatWorkerAttributeSkillsToString(attributes.default_skills).toString();
      workerObj.disabled_skills = formatWorkerAttributeSkillsToString(attributes.disabled_skills).toString();
      workerObj.ou = profile ? profile.ou_name : "";
      workerObj.backup_workers = backupWorkers ? backupWorkers.join(", ") : "";
      workerObj.sales_assoc_workers = salesAssociateWorkers ? salesAssociateWorkers.join(", ") : "";
      workerObj.outbound_number = workerObj.caller_id;

      delete workerObj.attributes;
      return workerObj;
    });
    return rows;
  };

  const handleExport = (usersToExport: UMUser[], columns: unknown[]) => {
    const rows = generateRows(usersToExport);

    if (_export.current !== null) {
      _export.current.save(rows, columns);
    }

    handleCloseModal();
  };

  const fetchTermedUsers = async () => {
    setIsLoadingTermedUsers(true);
    const inactiveUsers = await listInactiveUMUsers(dispatch);
    if (inactiveUsers) {
      setInactiveWorkers(inactiveUsers);
      setError(undefined);
    } else {
      setError("Error fetching inactive users");
    }
    setIsLoadingTermedUsers(false);
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
                {inactiveWorkers.length && !isLoadingTermedUsers ?
                  <>
                    <Text>Successfully retrieved Inactive Triton Users.  Click the button to Export</Text>
                    <br/>
                    <StyledButton onClick={() => handleExport(inactiveWorkers, termedUserExportColumns)}>
                      <ExcelExport ref={_export}/>Export Inactive Users
                    </StyledButton>
                  </>
                  :
                  <>
                    {error && <Text color="red">{error}<br/></Text>}
                    <Text>Do you want to export active Triton Users, or Inactive/terminated Users?</Text>
                    <br/>
                    <ButtonWrapper>
                      <StyledButton onClick={() => handleExport(selected, exportColumns)}>
                        <ExcelExport ref={_export}/>Export Active Users
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