import { CustomSelect } from "components";
import PropTypes from "prop-types";
import React, {
  useState
} from "react";

const DefaultPriorityDropDown = props => {
  const {
    defaultPriorityDisplay,
    max
  } = props;

  const [form, setForm] = useState({
    defaultPriority: defaultPriorityDisplay
  });

  const getOptionsList = max => {
    const options = [];
    for (let i = 1; i <= max; i++) {
      options.push(i);
    }
    return options;
  };

  return (
    <CustomSelect
      label={""}
      labelWidth={0}
      optionsList={getOptionsList(max)}
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