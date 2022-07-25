import React from "react";
import { searchByOptions } from "./CallRecording.Interfaces";
import {
  Button,
  ButtonWrapper,
  Header,
  InstructionsWrapper,
  ModalContainer,
  SubHeader,
  Text,
  StyledTextField,
  UserWrapper
} from "./CallRecording.Styles";
import { useAdminDispatch } from "context";
import {
  modalOverlayStatuses,
  timeouts
} from "globals";
import {
  getCalabrioAgents
} from "services";
import {
  checkDuplicateRecords,
  wait
} from "utils";

interface MergeUsersModalProps {
  loading: any,
  updateLoading: (payload: any) => void,
  mergeUsersModalState: any,
  setMergeUsersModalState: (state: any) => void,
  handleClose: (reopen: boolean | null) => void
}

const MergeUsersModal = (props: MergeUsersModalProps) => {
  const {
    loading,
    handleClose,
    mergeUsersModalState,
    setMergeUsersModalState,
    updateLoading
  } = props;

  const dispatch = useAdminDispatch();
  const [ conflictState, setConflictState ] = React.useState(null);
  console.log("PRIMARY USER IN MERGE USERS MODAL", mergeUsersModalState.permanentUser);

  React.useEffect(() => {
    const runConflictCheck = async () => {
      await handleConflictCheck();
    };

    if(!conflictState){
      runConflictCheck();
    }
  }, []);

  const getDuplicateSearchBy = () => {
    if(conflictState){
      const user = conflictState.duplicateUser;
      switch(conflictState.searchBy){
        case searchByOptions.ACD_ID:
          return user?.acdId;
        case searchByOptions.N_NUMBER:
          return user?.adLogin;
        default:
          return `${user?.firstName} ${user?.lastName}`;
      }
    } else {
      return "";
    }
  };

  const handleConflictCheck = async () => {
    try {
      const res: any = await getCalabrioAgents();
      const agents = res.data;
      console.warn("Calabrio Agents", res.data);
      dispatch({
        type: "loadCalabrioAgents",
        payload: agents
      });
      try {
        await checkDuplicateRecords(mergeUsersModalState.permanentUser, agents);
        setMergeUsersModalState({
          open: false,
          permanentUser: null
        });
        updateLoading({
          ...loading,
          overlayMessage: "Successfully added new user",
          saveStatus: modalOverlayStatuses.SUCCESS,
          saveUser: true
        });
        wait(() => {
          updateLoading({
            ...loading,
            saveUser: false
          });
          handleClose(true);
        }, timeouts.MODAL_OVERLAY);
      } catch(err){
        if(err.conflictFound){
          console.warn("Conflict Found!", err);
          setConflictState(err);
        } else {
          throw(err);
        }
      }
    } catch (error) {
      console.error("Error validating conflicting users for Calabrio", error);
      setMergeUsersModalState({
        open: false,
        permanentUser: null
      });
      updateLoading({
        ...loading,
        overlayMessage: "Failed to check for conflicting Calabrio users.",
        saveStatus: modalOverlayStatuses.PARTIAL_FAIL,
        saveUser: true
      });
      wait(() => {
        updateLoading({
          ...loading,
          saveUser: false
        });
        handleClose(true);
      }, timeouts.MODAL_OVERLAY);
    }
  };

  const handleCloseMergeUsersModal = () => {
    setMergeUsersModalState({
      permanentUser: null,
      open: false
    });
    updateLoading({
      ...loading,
      overlayMessage: "This user requires cleanup work in Calabrio.",
      saveStatus: modalOverlayStatuses.PARTIAL_FAIL,
      saveUser: true
    });
    wait(() => {
      updateLoading({
        ...loading,
        saveUser: false
      });
      handleClose(true);
    }, timeouts.MODAL_OVERLAY);
  };

  return (
    conflictState ?
      <ModalContainer>
        <InstructionsWrapper>
          <Header>Multiple Calabrio Accounts have been found for this user</Header>
          <SubHeader>Before proceeding please follow these steps</SubHeader>
          <Text>1. Go to the Calabrio Console</Text>
          <Text>2. Navigate to Application Management &gt; User Configuration &gt; Merge Users</Text>
          <Text>3. Select Merge duplicate users into a single user</Text>
          <Text>4. Select Show Inactive Users</Text>
          <Text>5. Select the Primary User and Duplicate User to align with the below</Text>
          <UserWrapper>
            <StyledTextField
              disabled={true}
              label="Primary User"
              variant="outlined"
              value={conflictState.duplicateUser?.acdId}
              margin="normal"
            />
            <StyledTextField
              disabled={true}
              label="Duplicate User"
              variant="outlined"
              value={mergeUsersModalState.permanentUser?.acdId}
              margin="normal"
            />
          </UserWrapper>
          <UserWrapper>
            <StyledTextField
              disabled={true}
              label="Primary Search By"
              variant="outlined"
              value={getDuplicateSearchBy()}
              margin="normal"
            />
            <StyledTextField
              disabled={true}
              label="Duplicate Search By"
              variant="outlined"
              value={`${mergeUsersModalState.permanentUser?.firstName} ${mergeUsersModalState.permanentUser?.lastName}`}
              margin="normal"
            />
          </UserWrapper>
          <Text style={{ marginTop: "10px" }}>6. Click Save in the upper right hand corner in Calabrio</Text>
          <Text>7. Once the users are merged, select continue on this screen.</Text>
          <SubHeader>If you hit cancel, additional clean up may still be needed in Calabrio which could cause downstream negative impacts</SubHeader>
        </InstructionsWrapper>
        <ButtonWrapper>
          <Button onClick={handleCloseMergeUsersModal}>Cancel</Button>
          <Button
            onClick={() => {
              setConflictState(null);
              handleConflictCheck();
            }}
          >Continue</Button>
        </ButtonWrapper>

      </ModalContainer>
      : <div/>
  );
};

export default MergeUsersModal;