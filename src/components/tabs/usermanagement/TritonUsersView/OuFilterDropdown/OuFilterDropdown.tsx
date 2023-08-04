import {
  Label,
  Wrapper
} from "./OuFilterDropdown.Styles";
import {
  Dropdown
} from "components";
import {
  useAdminState, useAdminDispatch
} from "context";
import React from "react";
import { getOperatingUnits } from "services";
import { OperatingUnit } from "globals";

export interface DropdownOption {
  label: string,
  value: any
}

const OuFilterDropdown = () => {

  const [operatingUnitList, setOperatingUnitList] = React.useState([]);

  const filterBy = useAdminState().userManagementTableFilters.ouFilterArray;
  const dispatch = useAdminDispatch();

  if(!operatingUnitList.length) {
    getOperatingUnits().then((allOUs: OperatingUnit[])  => {
      setOperatingUnitList(allOUs);
    }).catch(error => console.error(error.msg));
  }

  const options: DropdownOption[] = [
    {
      label: "Show All",
      value: "show-all"
    },
    {
      label: "divider",
      value: "divider"
    },
    ...operatingUnitList.map(ou => ({
      label: ou.ou_name,
      value: ou.ou_sid
    }))
  ];

  const DropdownOption = (props: any) => {
    const {
      option
    } = props;

    return (
      <Wrapper>
        { option.label === "Show All" || option.label === "divider"
          ? option.label
          : <Wrapper>
            <Label>
              {option.label}
            </Label>
          </Wrapper>
        }
      </Wrapper>
    );
  };

  return (
    <Wrapper>
      <Dropdown
        label="OU Dropdown"
        options={options}
        styles={{
          width: "400px",
          margin: "10px 0px"
        }}
        multiple={true}
        value={filterBy}
        updateValue={(event: any, optionsArray: any[]) => {
          if (optionsArray.length === 0 || optionsArray.find( (o: any) => o.value === "show-all")) {
            dispatch({
              type: "updateOuFilter",
              payload: []
            });
          } else if (optionsArray.find( (o: any) => o.value !== "divider")) {
            dispatch({
              type: "updateOuFilter",
              payload: optionsArray
            });
          }
        }}
        CustomRender={DropdownOption}
      />
    </Wrapper>
  );
};

export default OuFilterDropdown;