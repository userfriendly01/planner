import { DeleteTritonUserProps } from "./DeleteTritonUser.Interfaces";
import {
  CheckboxWrapper,
  DeleteTritonUserWrapper,
  Text
} from "./DeleteTritonUser.Styles";
import { ForwardToEntryForm } from "components";
import React from "react";
import { Checkbox } from "@mui/material";

const DeleteTritonUser = (props: DeleteTritonUserProps): any => {
  const {
    workerOpts,
    setWorkerOpts
  } = props;

  const isWorkerDid = workerOpts.worker.directDialNum;

  return (
    <DeleteTritonUserWrapper>
      <Text>This user will be deleted/deactivated from the checked systems.</Text>
      <CheckboxWrapper>
        <Checkbox /><Checkbox /><Checkbox />
      </CheckboxWrapper>
      { isWorkerDid ?
        <ForwardToEntryForm
          label={"This user has a direct dial number. Please choose a forward to option before confirming."}
          updateForwardTo={(inactiveForwardTo: string) => setWorkerOpts({
            ...workerOpts,
            worker: {
              ...workerOpts.worker,
              inactiveForwardTo
            }
          })}
        />
        : null
      }
    </DeleteTritonUserWrapper>
  );
};

export default DeleteTritonUser;