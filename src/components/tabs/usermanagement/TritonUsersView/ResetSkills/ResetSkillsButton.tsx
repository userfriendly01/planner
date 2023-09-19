import { DefaultResetInformation } from "./ResetSkills.Interfaces";
import {
  ResetSkillsResultsModal,
  StyledButton
} from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
import { apiPaths } from "globals";
import React, { useState } from "react";
import {
  logger,
  mapWorkerFromDbWorker,
  myAxios
} from "utils";
import { Modal } from "@mui/material";

const defaultResetInformation: DefaultResetInformation = {
  open: false,
  error: null,
  successfulResets: [],
  unsuccessfulResets: []
};

const ResetSkillsButton = (props: any) => {
  const {
    selected
  } = props;

  const state = useAdminState();
  const nNumber = state.userContext.pingIdentity?.sub;

  const dispatch = useAdminDispatch();
  const [ resultsModalOpts, setResultsModalOpts ] = useState(defaultResetInformation);

  const resetWorkers = () => {
    const dispatchResettingSkills = (bool: boolean) => dispatch({
      type: "resettingSkills",
      payload: bool
    });
    dispatchResettingSkills(true);
    const workerSids = selected.map((worker: any) => worker.sid);
    myAxios
      .post(apiPaths.RESET_WORKER_SKILLS, { workerSids }).then(response => {
        const failedWorkers: any[] = [];
        const passedWorkers: any[] = [];
        response.data.forEach((result: any) => {
          if (result.updated){
            result.worker.workerSid = result.workerSid;
            result.worker.attributes = JSON.parse(result.worker.attributes);
            const updatedWorker = mapWorkerFromDbWorker(result.worker);
            dispatch({
              type: "updateWorker",
              payload: updatedWorker
            });
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
        dispatchResettingSkills(false);
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
        dispatchResettingSkills(false);
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

export default ResetSkillsButton;