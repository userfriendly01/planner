import React from "react";
import { CallflowWrapper } from "./UserManagement.Styles";
import {
  View,
  views
} from "./UserManagement.Interfaces";
import {
  UserAction,
  WorkerOpts
} from "../OnboardNewUser/UserEntryFormWrapper.Interfaces";
import {
  UserEntryForm,
  TritonUserManagementWrapper,
  Dropdown
} from "components";
import { FormStateProvider } from "context";

const UserManagementWrapper = () => {

  const [ view, setView ] = React.useState(views.ONBOARD_NEW_USER);
  const defaultWorkerOpts: WorkerOpts = {
    worker: null,
    action: UserAction.ADD,
    systems: {
      triton: true,
      calabrio_qm: true,
      calabrio_wfm: false
    }
  };
  const [ selectedWorkerOpts, setSelectedWorkerOpts ] = React.useState(defaultWorkerOpts);

  React.useEffect(() => {
    console.log("I'm getting hit at least");
    if(selectedWorkerOpts.action !== UserAction.ADD && selectedWorkerOpts.worker){
      setView(views.ONBOARD_NEW_USER);
    }
  }, [selectedWorkerOpts.action]);

  return (
    <FormStateProvider>

      <CallflowWrapper>
        <Dropdown
          label="What would you like to do?"
          value={view}
          options={Object.values(views)}
          updateValue={(event: any, view: View) => setView(view)}
          styles={{
            margin: "40 0 30 0",
            width: "500px"
          }}
        />
        {view === views.ONBOARD_NEW_USER && <UserEntryForm
          handleClose={() => console.log("I dont think we need this")}
          workerOpts={selectedWorkerOpts}
          setWorkerOpts={setSelectedWorkerOpts}
        />}
        {view === views.TRITON_USERS && <TritonUserManagementWrapper
          setView={setView}
          workerOpts={selectedWorkerOpts}
          setWorkerOpts={setSelectedWorkerOpts}
        />}
      </CallflowWrapper>
    </FormStateProvider>
  );
};

export default UserManagementWrapper;