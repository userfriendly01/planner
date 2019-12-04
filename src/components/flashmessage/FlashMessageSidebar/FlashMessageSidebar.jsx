import {
  Checkbox,
  FormControlLabel
} from "@material-ui/core";
import React from "react";
import styled from "styled-components";

const SidebarWrapper = styled.div`
  background-color: white;
  box-shadow: 2px 0px 5px -2px #C0BFC0;
  display: flex;
  flex-direction: column;
`;

const StyledFormControl = styled(FormControlLabel)`
  && {
    margin-left: 0px;
  }
  && .Mui-checked {
    color: ${props => props.theme.libertyDarkTeal};
  }
`;

export const FlashMessageSidebar = () => {
  // This entire component will likely have to be refactored to use context and such once we have more groups.
  return (
    <SidebarWrapper>
      <StyledFormControl
        control={
          <Checkbox
            checked={true} // This will have to change later when we have multiple checkboxes
            value="aisg"
          />
        }
        label="AISG"
      />
    </SidebarWrapper>
  );
};

export default FlashMessageSidebar;