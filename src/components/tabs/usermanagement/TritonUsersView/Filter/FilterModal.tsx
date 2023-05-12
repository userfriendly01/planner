import {
  FilterButtonWrapper,
  FlexRowMax,
  Header,
  ModalContainer,
  DropdownWrapper,
  CloseButtonContainer
} from "./Filter.Styles";
import { FilterModalProps } from "./Filter.Interfaces";
import {
  PaperContainer,
  StyledButton,
  ProfileFilterDropdown,
  OuFilterDropdown,
  ManagerDropdown
} from "components";
import React from "react";
import { CloseRounded } from "@mui/icons-material";

const FilterModal = (props: FilterModalProps) => {
  const {
    handleClose,
    handleClear,
    tableState,
    setTableState
  } = props;

  return (
    <ModalContainer>
      <PaperContainer>
        <CloseButtonContainer>
          <CloseRounded data-testid={"close-button"} onClick={handleClose}/>
        </CloseButtonContainer>
        <Header>Filters</Header>
        <DropdownWrapper>
          <ProfileFilterDropdown filterBy={tableState.profileFilter} setFilter={(profile_id: string) => setTableState({
            ...tableState,
            profileFilter: profile_id
          })}
          />
          <OuFilterDropdown filterBy={tableState.ouFilter} setFilter={(ou_name: string) => setTableState({
            ...tableState,
            ouFilter: ou_name
          })}
          />
          <ManagerDropdown filterBy={tableState.managerFilter} setFilter={(manager_n_number: string) => setTableState({
            ...tableState,
            managerFilter: manager_n_number
          })}
          />
        </DropdownWrapper>
        <FilterButtonWrapper>
          <StyledButton onClick={handleClose}>Apply Filters</StyledButton>
          <StyledButton onClick={handleClear}>Clear Filters</StyledButton>
        </FilterButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

export default FilterModal;