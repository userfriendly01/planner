import { DefaultResetInformation } from "usermanagement/ResetSkills.Interfaces";
import { ResetSkillsResultsModal } from "usermanagement/ResetSkillsResultsModal";
import { StyledButton } from "components/StyledButton";
import { useAdminState } from "context/appContext";
import { apiPaths } from "globals";
import React, { useState } from "react";
import { logger } from "utils/logger";
import { myAxios } from "utils/myAxios";
import { Modal } from "@mui/material";

const defaultResetInformation: DefaultResetInformation = {
  open: false,
  error: null,
  successfulResets: [],
  unsuccessfulResets: []
};

export const ResetSkillsButton = (props: any) => {
  const {
    selected,
    setResettingSkills
  } = props;

  const state = useAdminState();
  const { nNumber } = state.userContext;

  const [ resultsModalOpts, setResultsModalOpts ] = useState(defaultResetInformation);

  const resetWorkers = () => {
    setResettingSkills(true);
    const workerSids = selected.map((worker: any) => worker.sid);
    myAxios
      .post(apiPaths.RESET_WORKER_SKILLS, { workerSids }).then(response => {
        const failedWorkers: any[] = [];
        const passedWorkers: any[] = [];
        response.data.forEach((result: any) => {
          if (result.updated){
            result.worker.workerSid = result.workerSid;
            result.worker.attributes = JSON.parse(result.worker.attributes);
            passedWorkers.push({
              name: selected.find((worker: any) => result.workerSid === worker.sid).sid
            });
          } else {
            failedWorkers.push({
              reason: result.reason,
              name: selected.find((worker: any) => result.workerSid === worker.sid).sid
            });
          }
        });
        setResettingSkills(false);
        setResultsModalOpts({
          ...resultsModalOpts,
          open: true,
          successfulResets: passedWorkers,
          unsuccessfulResets: failedWorkers
        });

        logger.info("Successfully reset worker skills", {
          workerSids,
          nNumber
        });
      })
      .catch(error => {
        logger.error("Failed to reset worker skills", {
          error,
          workerSids,
          nNumber
        });
        setResettingSkills(false);
        setResultsModalOpts({
          ...resultsModalOpts,
          open: true,
          error: "An unexpected error occurred when trying to reset worker skills"
        });
      });
  };

  return (
    <div style={{
      width: "50%",
      margin: "10px"
    }}>
      <Modal open={resultsModalOpts.open}>
        <>
          <ResetSkillsResultsModal
            error={resultsModalOpts.error}
            handleClose={() => setResultsModalOpts(defaultResetInformation)}
            successfulWorkers={resultsModalOpts.successfulResets}
            unsuccessfulWorkers={resultsModalOpts.unsuccessfulResets} />
        </>
      </Modal>
      <StyledButton style={{
        width: "100%",
        height: "50px"
      }} disabled={selected.length === 0} onClick={resetWorkers}>
        Reset Skills
      </StyledButton>
    </div>
  );
};