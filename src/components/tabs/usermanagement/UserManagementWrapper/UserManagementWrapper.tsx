import React from "react";
import { CallflowWrapper } from "./UserManagement.Styles";
import {
  View,
  views } from "./UserManagement.Interfaces";
import {
  UserAction,
  WorkerOpts
} from "../OnboardNewUser/UserEntryFormWrapper/UserEntryFormWrapper.Interfaces";
import {
  BulkUpload,
  UserEntryForm,
  Dropdown,
  TritonUsersViewWrapper
} from "components";
import {
  FormStateProvider,
  useAdminState
} from "context";
import { identifyUserProfiles } from "utils";

const UserManagementWrapper = () => {

  const [ view, setView ] = React.useState(views.TRITON_USERS);
  const state = useAdminState();

  const defaultWorkerOpts: WorkerOpts = {
    worker: {},
    action: UserAction.ADD,
    routedFrom: null,
    systems: {
      triton: true,
      calabrio_qm: true,
      calabrio_wfm: false
    }
  };
  const [ selectedWorkerOpts, setSelectedWorkerOpts ] = React.useState(defaultWorkerOpts);

  React.useEffect(() => {
    if(selectedWorkerOpts.action !== UserAction.ADD && selectedWorkerOpts.worker){
      setSelectedWorkerOpts({
        ...selectedWorkerOpts,
        systems: identifyUserProfiles(state, selectedWorkerOpts)
      });
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
          updateValue={(event: any, view: View) => {
            console.log("**wtf is happeneing", view);
            if(view === views.ONBOARD_NEW_USER){
              console.log("**I should be setting this shit", defaultWorkerOpts);
              setSelectedWorkerOpts(defaultWorkerOpts);
            }
            setView(view);
          }}
          styles={{
            margin: "40 0 30 0",
            width: "500px"
          }}
        />
        {view === views.ONBOARD_NEW_USER && <UserEntryForm
          handleClose={() => setView(selectedWorkerOpts.routedFrom)}
          workerOpts={selectedWorkerOpts}
          setWorkerOpts={setSelectedWorkerOpts}
        />}
        {view === views.TRITON_USERS && <TritonUsersViewWrapper
          setView={setView}
          workerOpts={selectedWorkerOpts}
          setWorkerOpts={setSelectedWorkerOpts}
        />}
        {view === views.BULK_CHANGES && <BulkUpload />}
      </CallflowWrapper>
    </FormStateProvider>
  );
};

export default UserManagementWrapper;