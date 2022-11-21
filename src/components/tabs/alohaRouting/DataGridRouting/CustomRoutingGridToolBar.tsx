import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";


interface CustomRoutingGridToolBarProps {
  openAddModal: (flag: boolean) => void;
}

export const CustomFlowRoutingToolBar = ({ openAddModal }: CustomRoutingGridToolBarProps) => {

  const [dropDownOptions, setDropDownOptions] = useState({ "addRouting": false });

  const handleChange = (event: any) => {
    if (event.target.value === "addRouting") {
      openAddModal(true);
    }

  };
  return (
    <div>
      <FormControl sx={{
        minWidth: 120,
        marginLeft: "calc(85%)",
        marginTop: 1
      }}>
        <InputLabel>Actions</InputLabel>
        <Select
          inputProps={{
            sx: {
              width: 120
            }
          }}
          label="Actions"
          value={dropDownOptions}
          onChange={handleChange}
          variant="outlined"
          size="small"
        >
          <MenuItem key="addRouting" value="addRouting">
            Add Routing +
          </MenuItem>
          <MenuItem key="Filter" value="Filter">
            Advance Search
          </MenuItem>

        </Select>
      </FormControl>
    </div>
  );
};
