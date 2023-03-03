import React from "react";
import { CallflowWrapper } from "./UserManagement.Styles";
import {
  View,
  views
} from "./UserManagement.Interfaces";
import {
  UserAction,
  WorkerOpts
} from "../OnboardNewUser/UserEntryFormWrapper/UserEntryFormWrapper.Interfaces";
import {
  BulkChanges,
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


  const defaultWorkerOpts: WorkerOpts = {
    worker: {},
    action: UserAction.ADD,
    routedFrom: views.TRITON_USERS,
    systems: {
      triton: true,
      calabrio_qm: true,
      calabrio_wfm: false
    }
  };
  const [ selectedWorkerOpts, setSelectedWorkerOpts ] = React.useState(defaultWorkerOpts);
  const [ view, setView ] = React.useState(views.TRITON_USERS);
  const state = useAdminState();
  const loggedInUser = state.userContext.pingIdentity.sub.toLowerCase();
  const temporaryBulkViewAllowedUsers = [
    "n0263786",
    "n0196231",
    "n0088625",
    "n0183277",
    "n0194977",
    "n0217643",
    "n0147198",
    "n0197784",
    "n0149889",
    "n1576460",
    "n1576461",
    "n1541381",
    "n1610258",
    "n0169879",
    "n0116796",
    "n0251975"
  ];
  console.log("User Management details, workerOpts, view", selectedWorkerOpts, view);

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
        {view !== views.ONBOARD_NEW_USER &&
        <Dropdown
          label="What would you like to do?"
          value={view}
          options={Object.values(views)}
          updateValue={(event: any, view: View) => {
            if(view === views.ONBOARD_NEW_USER){
              setSelectedWorkerOpts(defaultWorkerOpts);
            }
            setView(view);
          }}
          styles={{
            margin: "40 0 30 0",
            width: "500px"
          }}
        />
        }
        {view === views.TRITON_USERS && <TritonUsersViewWrapper
          setView={setView}
          workerOpts={selectedWorkerOpts}
          setWorkerOpts={setSelectedWorkerOpts}
        />}
        {view === views.ONBOARD_NEW_USER && <UserEntryForm
          handleClose={() => {
            setView(selectedWorkerOpts.routedFrom);
            setSelectedWorkerOpts(defaultWorkerOpts);
          }}
          workerOpts={selectedWorkerOpts}
          setWorkerOpts={setSelectedWorkerOpts}
        />}
        {view === views.BULK_CHANGES && temporaryBulkViewAllowedUsers.includes(loggedInUser) && <BulkChanges />}
        {view === views.BULK_CHANGES && !temporaryBulkViewAllowedUsers.includes(loggedInUser) && "This view is temporarily restricted to Game of Phones Product Owners and Admins"}
      </CallflowWrapper>
    </FormStateProvider>
  );
};

export default UserManagementWrapper;
