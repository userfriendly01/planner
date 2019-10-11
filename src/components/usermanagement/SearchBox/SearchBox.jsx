import { TextField } from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const TextInput = styled(TextField)`
  && {
    margin: 0%;
  }
`;

const SearchBox = props => {
  const {
    searchBy,
    setSearch
  } = props;

  return (
    <TextInput
      id="outlined-SearchBox-input"
      label="Search"
      margin="normal"
      name="outlined-SearchBox-input"
      onChange={event => setSearch(event.target.value)}
      variant="outlined"
      value={searchBy}
    />
  );
};

SearchBox.propTypes = {
  searchBy: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired
};

export default SearchBox;