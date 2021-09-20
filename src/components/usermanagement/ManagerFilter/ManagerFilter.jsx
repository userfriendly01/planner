import { Wrapper } from "./ManagerFilter.Styles";
import {
  Divider,
  FilledInput,
  FormControl,
  InputLabel,
  Modal,
  Select
} from "@material-ui/core";
import { AddManagerModal } from "components";
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

  return (
    <Wrapper>
      <FormControl variant="filled">
        <InputLabel shrink htmlFor="filled-filter-native-simple">
          Manager Filter
        </InputLabel>
        <Select
          native
          value={filterBy}
          onChange={event => setFilter(event.target.value)}
          input={
            <FilledInput name="filter" id="filled-filter-native-simple" />
          }
          inputProps={{ "data-testid": "select" }}
        >
          {[
            <option data-testid="manager-list" key={"show-all"} value={"show-all"}>Show All</option>,
            <option data-testid="add-manager" key={"add-manager"} value={"add-manager"}>Add New Manager</option>,
            /* eslint-ignore */
            <Divider light key={"divider"}/>,
            ...sortedManagers.map(manager => (
              <option data-testid="manager-list"
                key={manager.manager_id}
                value={manager.manager_n_number}
              >
                {manager.manager_first_name} {manager.manager_last_name}
              </option>
            ))
          ]}
        </Select>
      </FormControl>
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
