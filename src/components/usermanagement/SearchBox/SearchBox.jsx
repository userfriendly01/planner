import {
  IconButton,
  InputAdornment,
  TextField
} from "@material-ui/core";
import {
  ClearRounded
} from "@material-ui/icons";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const TextInput = styled(TextField)`
  && {
    margin: 0 8px;
    width: 100%;
    max-width: 275px;
  }
`;

const SearchBox = props => {
  const {
    searchBy,
    setSearch
  } = props;

  const clearComponent = searchBy === "" ? null :
    <InputAdornment position="end">
      <IconButton
        data-testid="clearButton"
        edge="end"
        aria-label="clear the search field"
        onClick={() => setSearch("")}
      >
        <ClearRounded />
      </IconButton>
    </InputAdornment>;

  return (
    <TextInput
      InputProps={{
        endAdornment: (
          clearComponent
        )
      }}
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