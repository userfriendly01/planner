import {
  Label,
  IconWrapper,
  Wrapper
} from "usermanagement/ManagerDropdown.Styles";
import { ManagerModal } from "usermanagement/ManagerModal";
import { ManagerDelete } from "usermanagement/ManagerDelete";
import { Dropdown } from "components/Dropdown";
import {
  useAdminState,
  useAdminDispatch
} from "context/appContext";
import React, { useState } from "react";
import { sortManagersByName } from "utils/_sortUtils";
import {
  Edit,
  Delete
} from "@mui/icons-material";
import { Modal } from "@mui/material";

export interface DropdownOption {
  label: string,
  value: any
}

export const ManagerDropdown = () => {
  const state = useAdminState();
  const filterBy = state.userManagementTableFilters.managerFilter;
  const dispatch = useAdminDispatch();
  const managers = state.managerContext.managers;
  const sortedManagers = [ ...managers ].sort(sortManagersByName);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [isManagerDeleteOpen, setIsManagerDeleteOpen] = useState(false);
  const [ selectedManager, setSelectedManager ] = useState(null);

  const handleOpenManager = () => {
    setIsManagerModalOpen(true);
  };

  const handleEditManager = async (option: DropdownOption) => {
    setSelectedManager(managers.find(manager => manager.manager_n_num === option.value));
    setIsManagerModalOpen(true);
  };

  const handleOpenDeleteManager = async (option: DropdownOption) => {
    setSelectedManager(managers.find(manager => manager.manager_n_num === option.value));
    setIsManagerDeleteOpen(true);
  };

  const handleCloseManager = () => {
    setSelectedManager(null);
    setIsManagerModalOpen(false);
    setIsManagerDeleteOpen(false);
  };

  const options: DropdownOption[] = [
    {
      label: "Show All",
      value: "show-all"
    },
    {
      label: "Add Manager",
      value: "add-manager"
    },
    {
      label: "divider",
      value: "divider"
    },
    ...sortedManagers.map(manager => ({
      label: `${manager.manager_first_name} ${manager.manager_last_name} | ${manager.manager_n_num}`,
      value: manager.manager_n_num
    }))
  ];

  const DropdownOption = (props: any) => {
    const {
      option
    } = props;

    return (
      <Wrapper>
        { option.label === "Show All" || option.label === "Add Manager" || option.label === "divider"
          ? option.label
          : <Wrapper>
            <Label>
              {option.label}
            </Label>
            <IconWrapper onClick={() => handleEditManager(option)}>
              <Edit fontSize={"inherit"}/>
            </IconWrapper>
            <IconWrapper onClick={() => handleOpenDeleteManager(option)}>
              <Delete fontSize={"inherit"}/>
            </IconWrapper>
          </Wrapper>
        }
      </Wrapper>
    );
  };

  return (
    <Wrapper>
      <Dropdown
        label="Manager Dropdown"
        options={options}
        styles={{
          width: "400px",
          margin: "10px 0px"
        }}
        value={filterBy ? options.find((option: DropdownOption) => { if(option.value === filterBy){ return option.label; } }) : ""}
        updateValue={(event: any, newInputValue: any) => {
          if (newInputValue === null || newInputValue.value === "show-all") {
            dispatch({
              type: "updateManagerFilter",
              payload: null
            });
          } else if (newInputValue.value === "add-manager") {
            handleOpenManager();
          } else if (newInputValue.value !== "divider") {
            dispatch({
              type: "updateManagerFilter",
              payload: newInputValue.value
            });
          }
        }}
        CustomRender={DropdownOption}
      />
      <Modal onClose={() => { return; }} open={isManagerModalOpen}>
        <>
          <ManagerModal handleClose={handleCloseManager} selectedManager={selectedManager}/>
        </>
      </Modal>
      <Modal onClose={() => { return; }} open={isManagerDeleteOpen}>
        <>
          <ManagerDelete handleClose={handleCloseManager} selectedManager={selectedManager}/>
        </>
      </Modal>
    </Wrapper>
  );
};