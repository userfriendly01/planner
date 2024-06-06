import {
  Label,
  Wrapper
} from "usermanagement/OuFilterDropdown.Styles";
import {
  Dropdown
} from "components/Dropdown";
import {
  useAdminState, useAdminDispatch
} from "context/appContext";
import React from "react";
import { getOperatingUnits } from "services/operatingUnits";
import {
  DropdownOption, OperatingUnit
} from "globals/interfaces";
import { logger } from "utils/logger";

export const OuFilterDropdown = () => {

  const [operatingUnitList, setOperatingUnitList] = React.useState([]);

  const filterBy = useAdminState().userManagementTableFilters.ouFilterArray;
  const dispatch = useAdminDispatch();

  if(!operatingUnitList.length) {
    getOperatingUnits().then((allOUs: OperatingUnit[])  => {
      setOperatingUnitList(allOUs);
    }).catch(error => logger.error(error.msg, { error }, false));
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