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

const MergeUsersModal = () => {

  return (
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
            value="WKe7ddc4e2bb44a978647dcb062dd7ad13"
            margin="normal"
          />
          <StyledTextField
            disabled={true}
            label="Duplicate User"
            variant="outlined"
            value="WKe7ddc4e2bb44a978647dcb062dd7ad13"
            margin="normal"
          />
        </UserWrapper>
        <Text>6. Click Save in the upper right hand corner in Calabrio</Text>
        <Text>7. Once the users are merged, select continue on this screen.</Text>
        <SubHeader>If you hit cancel, the Triton user will be created and clean up work will still be required for this user in Calabrio</SubHeader>
      </InstructionsWrapper>
      <ButtonWrapper>
        <Button>Cancel</Button>
        <Button>Continue</Button>
      </ButtonWrapper>
    </ModalContainer>
  );
};

export default MergeUsersModal;