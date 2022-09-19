import {
  IconButton,
  InputAdornment,
  TextField
} from "@mui/material";
import {
  ClearRounded
} from "@mui/icons-material";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const TextInput = styled(TextField)`
&& {
  margin: 0 8px;
  width: 100%;
  max-width: ${props => props.styles && props.styles.width ? props.styles.width : "325px"};
}
`;

const SearchBox = props => {
  const {
    searchBy,
    setSearch,
    styles
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
      key={"searchBox"}
      label="Search"
      margin="normal"
      name="outlined-SearchBox-input"
      onChange={event => setSearch(event.target.value)}
      styles={styles}
      variant="outlined"
      value={searchBy}
    />
  );
};

SearchBox.propTypes = {
  searchBy: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  styles: PropTypes.any
};

export default SearchBox;