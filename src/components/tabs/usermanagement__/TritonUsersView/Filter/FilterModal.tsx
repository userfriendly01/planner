import {
  FilterButtonWrapper,
  Header,
  ModalContainer,
  DropdownWrapper,
  CloseButtonContainer
} from "usermanagement/Filter.Styles";
import { PaperContainer } from "components/PaperContainer";
import { StyledButton } from "components/StyledButton";
import { ProfileFilterDropdown } from "usermanagement/ProfileFilterDropdown";
import { OuFilterDropdown } from "usermanagement/OuFilterDropdown";
import { ManagerDropdown } from "usermanagement/ManagerDropdown";
import React from "react";
import { CloseRounded } from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface FilterModalProps {
  handleClear: ()=> void
  handleClose: () => void
}

export const FilterModal = (props: FilterModalProps) => {
  const {
    handleClose,
    handleClear
  } = props;

  return (
    <ModalContainer>
      <PaperContainer>
        <CloseButtonContainer>
          <IconButton>
            <CloseRounded data-testid="close-button" onClick={handleClose}/>
          </IconButton>
        </CloseButtonContainer>
        <Header>Filters</Header>
        <DropdownWrapper>
          <ProfileFilterDropdown />
          <OuFilterDropdown />
          <ManagerDropdown />
        </DropdownWrapper>
        <FilterButtonWrapper>
          <StyledButton onClick={handleClose}>Done</StyledButton>
          <StyledButton onClick={handleClear}>Clear</StyledButton>
        </FilterButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};