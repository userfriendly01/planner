import { FilterModal } from "usermanagement/FilterModal";
import { StyledButton } from "components/StyledButton";
import React, { useState } from "react";
import { useAdminDispatch } from "context/appContext";
import { Modal } from "@mui/material";

export const FilterButton = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const dispatch = useAdminDispatch();

  const handleClearFilters = () => {
    dispatch({
      type: "resetFilters"
    });
  };

  return (
    <div>
      <Modal onClose={() => { return; }} open={isFilterModalOpen}>
        <>
          <FilterModal
            handleClose={()=>setIsFilterModalOpen(false)}
            handleClear = {handleClearFilters}
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