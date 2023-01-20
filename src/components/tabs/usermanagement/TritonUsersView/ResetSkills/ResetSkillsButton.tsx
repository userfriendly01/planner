import { DefaultResetInformation } from "./";
import {
  ResetSkillsResultModal,
  StyledButton
} from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
import { apiPaths } from "globals";
import React, { useState } from "react";
import {
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

const ResetSkillsButton = () => {

  const dispatch = useAdminDispatch();
  const state = useAdminState();

  const selectedWorkers = state.workerContext.selectedWorkers;

  const [resultsModalOpts, setResultsModalOpts] = useState(defaultResetInformation);

  const resetWorkers = () => {
    const dispatchResettingSkills = (bool: boolean) => dispatch({
      type: "resettingSkills",
      payload: bool
    });
    dispatchResettingSkills(true);
    const workerSids = selectedWorkers.map(worker => worker.sid);
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
              type: "toggleWorkerSelected",
              payload: {
                sid: result.workerSid
              }
            });
            dispatch({
              type: "updateWorker",
              payload: updatedWorker
            });
            passedWorkers.push({
              name: selectedWorkers.find((worker: any) => result.workerSid === worker.sid).sid
            });
          } else {
            failedWorkers.push({
              reason: result.reason,
              name: selectedWorkers.find((worker: any) => result.workerSid === worker.sid).sid
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
      })
      .catch(error => {
        console.error("Failed to reset worker skills", {
          error,
          workerSids
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
      width: "35%",
      marginRight: "10px"
    }}>
      <Modal open={resultsModalOpts.open}>
        <>
          <ResetSkillsResultModal
            error={resultsModalOpts.error}
            handleClose={() => setResultsModalOpts(defaultResetInformation)}
            successfulWorkers={resultsModalOpts.successfulResets}
            unsuccessfulWorkers={resultsModalOpts.unsuccessfulResets} />
        </>
      </Modal>
      <StyledButton style={{ width: "100%" }} disabled={selectedWorkers.length === 0} onClick={() => resetWorkers()}>
        Reset Skills
      </StyledButton>
    </div>
  );
};

export default ResetSkillsButton;