import React from "react";
import { Dropdown } from "components";
import { getOperatingUnits } from "services";
import { OperatingUnit } from "globals";
import { ProfileOperatingUnitFieldProps } from "./ProfileEntryForm.Interfaces";

const ProfileOperatingUnitField = (props: ProfileOperatingUnitFieldProps) => {

  const { setOperatingUnit } = props;

  const [ouDropDownOptions, setOuDropDownOptions] = React.useState([]);
  const [selectedOu, setSelectedOu] = React.useState<OperatingUnit>();
  const [operatingUnitList, setOperatingUnitList] = React.useState([]);

  React.useEffect(() => {
    if(!operatingUnitList.length) {
      getOperatingUnits().then((allOUs: OperatingUnit[])  => {
        setOperatingUnitList(allOUs);
        setOuDropDownOptions(getOperatingUnitDropDownOptions(allOUs));
      }).catch(error => console.error(error.msg));
    }
  }, []);

  const getOperatingUnitDropDownOptions = (optionsList: OperatingUnit[]) => {
    return optionsList.map(ou => ({
      label: ou.ou_name,
      value: ou.ou_sid
    }));
  };

  const updateSelectedOu = (event: any, selectedOption: { label: string; value: string; }) => {
    const selectedOU = operatingUnitList.find(ou => selectedOption.value === ou.ou_sid);
    setSelectedOu(selectedOU);
    setOperatingUnit(selectedOU);
  };

  return (
    <div>
      <Dropdown
        label="Operating Unit *"
        styles={{
          "width": "385px",
          "margin": "5px 0"
        }}
        options={ouDropDownOptions}
        multiple={false}
        value={selectedOu}
        updateValue={updateSelectedOu}
      />
    </div>
  );
};

export default ProfileOperatingUnitField;