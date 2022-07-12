import React from "react";
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
import {
  useAdminState,
  useAdminDispatch,
  useFormState
} from "context";
import {
  modalOverlayStatuses,
  timeouts
} from "globals";
import {
  getCalabrioOrg,
  createCalabrioUser
} from "services";
import {
  checkConflictingUsers,
  wait
} from "utils";

interface MergeUsersModalProps {
  loading: any,
  updateLoading: (payload: any) => void,
  primaryUser: any,
  mergeUsersModalState: any,
  setMergeUsersModalState: (state: any) => void
}

const MergeUsersModal = (props: MergeUsersModalProps) => {
  const {
    loading,
    updateLoading,
    primaryUser,
    mergeUsersModalState,
    setMergeUsersModalState
  } = props;

  const state = useAdminState();
  const dispatch = useAdminDispatch();
  const form = useFormState();
  const [ conflictState, setConflictState ] = React.useState(null);
  console.log("PRIMARY USER IN MERGE USERS MODAL", primaryUser);

  React.useEffect(() => {
    const runConflictCheck = async () => {
      await handleConflictCheck();
    };

    if(!conflictState){
      runConflictCheck();
    }
  }, []);

  const handleClose = () => {
    setMergeUsersModalState({
      open: false,
      duplicateUser: null
    });
  };

  const handleConflictCheck = async () => {
    try {
      const org: any = await getCalabrioOrg();
      // const org: any = {
      //   data: []
      // };
      console.log("Calabrio Org", org);
      dispatch({
        type: "loadCalabrioOrg",
        payload: org.data
      });
      try {
        const res = await checkConflictingUsers(form.calabrioUser, form.nNumber.value.toLowerCase(), state.calabrioContext.users);
        if(res.conflictFound || form.calabrioUser){
          setConflictState(res);
          console.log("Conflict Found!");
          return res;
        } else {
          try {
            await createCalabrioUser(primaryUser);
            handleClose();
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
            }, timeouts.MODAL_OVERLAY);
          } catch(err){
            handleClose();
            updateLoading({
              ...loading,
              overlayMessage: "Triton Admin User added but Calabrio User not added",
              saveStatus: modalOverlayStatuses.SUCCESS,
              saveUser: true
            });
            console.error("Triton Admin User added but Calabrio User not added", err);
          }
        }
      } catch(err){
        console.log("Error validating conflicting users for Calabrio", err);
        handleClose();
        updateLoading({
          ...loading,
          overlayMessage: "Triton Admin failed to check for conflicting Calabrio users. Please validate Calabrio and manually add the user.",
          saveStatus: modalOverlayStatuses.PARTIAL_FAIL,
          saveUser: true
        });
      }
    } catch (error) {
      console.error("Failed to reload calabrio org from merge users modal");
      handleClose();
      updateLoading({
        ...loading,
        overlayMessage: "Triton Admin failed to add Calabrio user. Please validate Calabrio and manually add the user.",
        saveStatus: modalOverlayStatuses.PARTIAL_FAIL,
        saveUser: true
      });
    }
    return null;
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
              value={primaryUser?.acdId}
              margin="normal"
            />
            <StyledTextField
              disabled={true}
              label="Duplicate User"
              variant="outlined"
              value={mergeUsersModalState.duplicateUser?.acdId}
              margin="normal"
            />
          </UserWrapper>
          <UserWrapper>
            <StyledTextField
              disabled={true}
              label="Primary Search By"
              variant="outlined"
              value="WKe7ddc4e2bb44a978647dcb062dd7ad13"
              margin="normal"
            />
            <StyledTextField
              disabled={true}
              label="Duplicate Search By"
              variant="outlined"
              value="WKe7ddc4e2bb44a978647dcb062dd7ad13"
              margin="normal"
            />
          </UserWrapper>
          <Text style={{ marginTop: "10px" }}>6. Click Save in the upper right hand corner in Calabrio</Text>
          <Text>7. Once the users are merged, select continue on this screen.</Text>
          <SubHeader>If you hit cancel, the Triton user will be created and clean up work will still be required for this user in Calabrio</SubHeader>
        </InstructionsWrapper>
        <ButtonWrapper>
          <Button
            onClick={() => {
              setMergeUsersModalState({
                duplicateUser: null,
                open: false
              });
              updateLoading({
                ...loading,
                overlayMessage: "Triton Admin User added but Calabrio User not added",
                saveStatus: modalOverlayStatuses.PARTIAL_FAIL,
                saveUser: true
              });
            }}
          >Cancel</Button>
          <Button
            onClick={() => {
              setConflictState(null);
              handleConflictCheck();
            }
            }
          >Continue</Button>
        </ButtonWrapper>

      </ModalContainer>
      : <div></div>
  );
};

export default MergeUsersModal;