import {
  FilterButtonWrapper,
  Header,
  ModalContainer,
  DropdownWrapper,
  CloseButtonContainer
} from "./Filter.Styles";
import {
  PaperContainer,
  StyledButton,
  ProfileFilterDropdown,
  OuFilterDropdown,
  ManagerDropdown
} from "components";
import React from "react";
import { CloseRounded } from "@mui/icons-material";

export interface FilterModalProps {
  handleClear: ()=> void
  handleClose: () => void
}

const FilterModal = (props: FilterModalProps) => {
  const {
    handleClose,
    handleClear
  } = props;

  return (
    <ModalContainer>
      <PaperContainer>
        <CloseButtonContainer>
          <CloseRounded data-testid={"close-button"} onClick={handleClose}/>
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

export default FilterModal;