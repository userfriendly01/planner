import {
  IconButton,
  InputAdornment,
  TextField
} from "@mui/material";
import {
  ClearRounded
} from "@mui/icons-material";
import React from "react";
import styled from "styled-components";
import { GenericObject } from "globals/interfaces";

const TextInput = styled(TextField)<{ styles: GenericObject }>`
  && {
    margin: 0 8px;
    width: 100%;
    max-width: ${props => props.styles && props.styles.width ? props.styles.width : "325px"};
  }
`;

interface SearchBoxProps {
  searchBy: string,
  setSearch: (search: string) => void,
  styles?: GenericObject
}

export const SearchBox = (props: SearchBoxProps) => {
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