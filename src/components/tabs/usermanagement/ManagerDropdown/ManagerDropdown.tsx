import {
  Label,
  IconWrapper,
  Wrapper
} from "./ManagerDropdown.Styles";
import { Modal } from "@mui/material";
import {
  Edit,
  Delete
} from "@mui/icons-material";
import {
  ManagerModal,
  ManagerDelete,
  Dropdown
} from "components";
import { useAdminState } from "context";
import React, { useState } from "react";
import { sortManagersByName } from "utils";

interface ManagerDropDownProps {
  filterBy: string,
  setFilter: (filter: string) => void
}

interface DropdownOption {
  label: string,
  value: any
}

const ManagerDropdown = (props: ManagerDropDownProps) => {
  const {
    filterBy,
    setFilter
  } = props;

  const state = useAdminState();
  const managers = state.managerContext.managers;
  const sortedManagers = [ ...managers ].sort(sortManagersByName);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [isManagerDeleteOpen, setIsManagerDeleteOpen] = useState(false);
  const [ selectedManager, setSelectedManager ] = useState(null);

  const handleOpenManager = () => {
    setIsManagerModalOpen(true);
  };

  const handleEditManager = async (option: DropdownOption) => {
    setSelectedManager(managers.find(manager => manager.manager_n_number === option.value));
    setIsManagerModalOpen(true);
  };

  const handleOpenDeleteManager = async (option: DropdownOption) => {
    setSelectedManager(managers.find(manager => manager.manager_n_number === option.value));
    setIsManagerDeleteOpen(true);
  };

  const handleCloseManager = () => {
    setSelectedManager(null);
    setFilter("show-all");
    setIsManagerModalOpen(false);
    setIsManagerDeleteOpen(false);
  };

  const handleCloseManagerDelete = () => {
    setSelectedManager(null);
    setFilter("show-all");
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
      label: `${manager.manager_first_name} ${manager.manager_last_name} | ${manager.manager_n_number}`,
      value: manager.manager_n_number
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
            <IconWrapper onClick={() => handleEditManager(option)} data-testid="edit-button">
              <Edit fontSize={"inherit"}/>
            </IconWrapper>
            <IconWrapper onClick={() => handleOpenDeleteManager(option)} data-testid="delete-button">
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
        styles= {{ width: 325 }}
        value={options.find((option: DropdownOption) => option.value === filterBy)}
        updateValue={(event: any, newInputValue: any) => {
          setFilter(newInputValue.value);
          if(newInputValue.value === "add-manager"){
            handleOpenManager();
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
          <ManagerDelete handleClose={handleCloseManagerDelete} selectedManager={selectedManager}/>
        </>
      </Modal>
    </Wrapper>
  );
};

export default ManagerDropdown;
