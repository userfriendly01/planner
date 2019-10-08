import { CustomSelect } from "components";
import PropTypes from "prop-types";
import React, {
  useState
} from "react";
import { getPriorityOptionsList } from "utils";

const DefaultPriorityDropDown = props => {
  const {
    defaultPriorityDisplay,
    max
  } = props;

  const [form, setForm] = useState({
    defaultPriority: defaultPriorityDisplay
  });

  return (
    <CustomSelect
      label={""}
      labelWidth={0}
      optionsList={getPriorityOptionsList(max)}
      optionsDisplayFunc={option => {
        return {
          display: option,
          key: option,
          value: option
        };
      }}
      updateValue={newValue => setForm({
        ...form,
        defaultPriority: newValue
      })}
      value={form.defaultPriority}
    />
  );
};

DefaultPriorityDropDown.propTypes = {
  defaultPriorityDisplay: PropTypes.number,
  max: PropTypes.number.isRequired
};

export default DefaultPriorityDropDown;