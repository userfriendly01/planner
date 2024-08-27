import { DefaultResetInformation, ResetWorkerSkillsToDefaultResponse, Worker } from "usermanagement/ResetSkills.Interfaces";
import { ResetSkillsResultsModal } from "usermanagement/ResetSkillsResultsModal";
import { StyledButton } from "components/StyledButton";
import { useAdminState } from "context/appContext";
import React, { useState } from "react";
import { logger } from "utils/logger";
import { Modal } from "@mui/material";
import { resetWorkerSkillsToDefault } from "services/resetWorkerSkillsToDefault";
import { UMUser } from "globals/interfaces";

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
  const workers = state.workerContext.workers;

  const [ resultsModalOpts, setResultsModalOpts ] = useState(defaultResetInformation);

  const resetWorkers = () => {
    setResettingSkills(true);
    const workerSids = selected.map((worker: UMUser) => worker.sid);
    const selectedWorkers = selected.map((currWorker: UMUser) => (workers.find(worker => worker.sid === currWorker.sid)));
    resetWorkerSkillsToDefault(selectedWorkers).then((response : ResetWorkerSkillsToDefaultResponse[]) => {
        const failedWorkers: Worker[] = [];
        const passedWorkers: Worker[] = [];
        response.forEach((result: ResetWorkerSkillsToDefaultResponse) => {
          if (result.updated){
            result.worker.workerSid = result.workerSid;
            passedWorkers.push({
              name: selected.find((worker: UMUser) => result.workerSid === worker.sid).sid
            });
          } else {
            failedWorkers.push({
              reason: result.reason,
              name: selected.find((worker: UMUser) => result.workerSid === worker.sid).sid
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