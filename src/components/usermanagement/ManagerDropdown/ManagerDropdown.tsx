import {
  Label,
  IconWrapper,
  Wrapper
} from "./ManagerDropdown.Styles";
import { Modal } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import {
  AddManagerModal,
  Dropdown
} from "components";
import { useAdminState } from "context";
import React, {
  useEffect,
  useState
} from "react";
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

  const managers = useAdminState().managerContext.managers;
  const sortedManagers = [ ...managers ].sort(sortManagersByName);
  const [isAddManagerModalOpen, setIsAddManagerModalOpen] = useState(false);

  const handleOpenAddManager = () => {
    setIsAddManagerModalOpen(true);
  };

  const handleCloseAddManager = () => {
    setFilter("show-all");
    setIsAddManagerModalOpen(false);
  };

  useEffect(() => {
    if(filterBy === "add-manager"){
      handleOpenAddManager();
    }
  });

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
            <IconWrapper onClick={() => console.log("**EDIT**")} data-testid="edit-button">
              <Edit fontSize={"inherit"}/>
            </IconWrapper>
          </Wrapper>
        }
      </Wrapper>
    );
  };

  return (
    <Wrapper>
      <Dropdown
        label="Manager Filter"
        options={options}
        styles= {{ width: 325 }}
        value={options.find((option: DropdownOption) => option.value === filterBy)}
        updateValue={(event: any, newInputValue: any) => setFilter(newInputValue.value)}
        CustomRender={DropdownOption}
      />
      <Modal disableBackdropClick={true} open={isAddManagerModalOpen}>
        <AddManagerModal data-testid="add-manager-modal" handleClose={handleCloseAddManager} />
      </Modal>
    </Wrapper>
  );
};

export default ManagerDropdown;
