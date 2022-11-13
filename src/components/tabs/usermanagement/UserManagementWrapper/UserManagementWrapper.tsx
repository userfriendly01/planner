import React from "react";
import { CallflowWrapper } from "./UserManagement.Styles";
import {
  View,
  views
} from "./UserManagement.Interfaces";
import { WorkerOpts } from "../OnboardNewUser/UserEntryFormWrapper.Interfaces";
import {
  UserEntryForm,
  ManagementWrapper,
  Dropdown
} from "components";
import { FormStateProvider } from "context";


const UserManagementWrapper = () => {

  const defaultWorkerOpts: WorkerOpts = {
    worker: null,
    action: null,
    systems: {
      triton: false,
      calabrio_qm: false,
      calabrio_wfm: false
    }
  };

  const [ view, setView ] = React.useState(views.ONBOARD_NEW_USER);
  const [ selectedWorkerOpts, setSelectedWorkerOpts ] = React.useState(defaultWorkerOpts);

  return (
    <FormStateProvider>
      <CallflowWrapper>
        <Dropdown
          label="What would you like to do?"
          value={view}
          options={Object.values(views)}
          updateValue={(event: any, view: View) => setView(view)}
          styles={{
            margin: "40 0 60 0",
            width: "500px"
          }}
        />
        {view === views.ONBOARD_NEW_USER && <UserEntryForm
          handleClose={() => console.log("I dont think we need this")}
          workerOpts={selectedWorkerOpts}
          setWorkerOpts={setSelectedWorkerOpts}
        />}
        {view === views.TRITON_USERS && <ManagementWrapper />}
      </CallflowWrapper>
    </FormStateProvider>
  );
};

export default UserManagementWrapper;