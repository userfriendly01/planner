import React from "react";
import {
  FormControlsContainer,
  FormControlsPane
} from "./CallRecording.Styles";
import CallRecordingScope from "./CallRecordingScope";
import { FilterableSelect } from "components";
import {
  useAdminState,
  useFormState,
  useFormDispatch,
  userFormActions
} from "context";

const CallRecordingForm = () => {
  const state = useAdminState();
  const form = useFormState();
  const setForm = useFormDispatch();
  console.log("***STATE!", state);

  return(
    <FormControlsContainer>
      <FormControlsPane>
        Call Recording
        <div>Roles: </div>
        <div>Team</div>
        <FilterableSelect
          optionsList={state.calabrioContext.teams}
        />
        <div>Scope: </div>
        <CallRecordingScope />
      </FormControlsPane>
    </FormControlsContainer>
  );
};

export default CallRecordingForm;