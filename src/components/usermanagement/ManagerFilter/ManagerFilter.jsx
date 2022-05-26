import { Wrapper } from "./ManagerFilter.Styles";
import { Modal } from "@material-ui/core";
import {
  AddManagerModal,
  SimpleFilter
} from "components";
import { useAdminState } from "context";
import PropTypes from "prop-types";
import React, {
  useEffect,
  useState
} from "react";
import { sortManagersByName } from "utils";

const ManagerFilter = props => {
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

  const options = [
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

  return (
    <Wrapper>
      <SimpleFilter
        label="Manager Filter"
        options={options}
        styles= {{ width: 275 }}
        value={options.find(option => option.value === filterBy)}
        updateValue={(event, newInputValue) => setFilter(newInputValue.value)}
      />
      <Modal disableBackdropClick={true} open={isAddManagerModalOpen}>
        <AddManagerModal data-testid="add-manager-modal" handleClose={handleCloseAddManager} />
      </Modal>
    </Wrapper>
  );
};

ManagerFilter.propTypes = {
  filterBy: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired
};

export default ManagerFilter;
