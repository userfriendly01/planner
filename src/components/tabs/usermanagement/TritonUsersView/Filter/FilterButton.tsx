import {
  FilterModal,
  StyledButton
} from "components";
import {
  //useAdminDispatch,
  useAdminState
} from "context";
import React, { useState } from "react";
import { Modal } from "@mui/material";
import { FilterButtonProps } from "./Filter.Interfaces";

const FilterButton = (props: FilterButtonProps) => {
  const {
    tableState,
    setTableState
  } = props;
  //   const dispatch = useAdminDispatch();
  const state = useAdminState();
  console.log(state);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleOpenFilterModal = () => {
    setIsFilterModalOpen(true);
  };


  const handleCloseFilterModal = () => {
    // setSelectedManager(null);
    //setFilter(null);
    setIsFilterModalOpen(false);
    //setIsManagerDeleteOpen(false);
  };

  const handleClearFilters = () => {
    setTableState({
      ...tableState,
      managerFilter: null,
      profileFilter: null,
      ouFilter: null
    });
    console.log("set table state2!", tableState);
  };

  return (
    <div>
      <Modal onClose={() => { return; }} open={isFilterModalOpen}>
        <FilterModal handleClose={handleCloseFilterModal}
          handleClear = {handleClearFilters}
          tableState= {tableState}
          setTableState={setTableState} />
      </Modal>
      <StyledButton style={{
        width: "100%",
        height: "50px",
        padding: "1em"
      }} onClick={() => handleOpenFilterModal()}>
        Filters
      </StyledButton>
    </div>
  );
};

export default FilterButton;