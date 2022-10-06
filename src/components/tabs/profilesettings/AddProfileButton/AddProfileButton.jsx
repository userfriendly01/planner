import React from "react";
import styled from "styled-components";
import {
  StyledButton
} from "components";
import {
  Modal,
} from "@mui/material";

const FlexRow = styled.div`
  display: flex;
  flex: 1 1 auto;
`;

const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 1%;
`;

const AddProfileButton = () => {
  let isAddProfileFormOpen = false;

  const addProfileButtonClicked = () => {
      isAddProfileFormOpen = true
  };

  const handleUpload = () => {
    return '';
  };

  return(
    <div>
      <ButtonWrapper>
        <StyledButton onClick={addProfileButtonClicked}>
              Add Profile
        </StyledButton>
      </ButtonWrapper>
      <Modal onClose={() => { return; }} open={isAddProfileFormOpen}>
        <div id="addProfiles">
            <h4>Add Profiles</h4>
            <p className="pb-3">To add / edit a group of profiles, upload your CSV document here</p>
            <form
                name="form-multiple-add-profile"
                encType="multipart/form-data"
                method="post"
                onSubmit={handleUpload}
            >
                <div className="text-left mt-4">
                    <input type="file"/>
                    <input type="submit" value="Upload"/>
                </div>
            </form>
        </div>
      </Modal>
    </div>
  )
};

export default AddProfileButton;
