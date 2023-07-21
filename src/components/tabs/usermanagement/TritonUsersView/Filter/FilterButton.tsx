import {
  FilterModal,
  StyledButton
} from "components";
import React, { useState } from "react";
import { Modal } from "@mui/material";
import { FilterButtonProps } from "./Filter.Interfaces";

const FilterButton = (props: FilterButtonProps) => {
  const {
    tableState,
    setTableState
  } = props;

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleClearFilters = () => {
    setTableState({
      ...tableState,
      managerFilter: null,
      profileFilterArray: [],
      ouFilterArray: []
    });
  };

  return (
    <div>
      <Modal onClose={() => { return; }} open={isFilterModalOpen}>
        <>
          <FilterModal handleClose={()=>setIsFilterModalOpen(false)}
            handleClear = {handleClearFilters}
            tableState= {tableState}
            setTableState={setTableState}
          />
        </>
      </Modal>
      <StyledButton style={{
        width: "100%",
        height: "50px",
        padding: "1em"
      }} onClick={()=>setIsFilterModalOpen(true)}>
        Filters
      </StyledButton>
    </div>
  );
};

export default FilterButton;