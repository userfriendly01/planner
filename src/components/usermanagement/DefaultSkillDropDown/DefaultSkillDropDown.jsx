import { CustomSelect } from "components";
import PropTypes from "prop-types";
import React, {
  useState
} from "react";

const DefaultSkillDropDown = props => {
  const {
    defaultSkills,
    defaultSkillDisplay
  } = props;

  const [form, setForm] = useState({
    defaultSkill: defaultSkillDisplay
  });

  return (
    <CustomSelect
      label={""}
      labelWidth={0}
      optionsList={defaultSkills.skills}
      optionsDisplayFunc={option => {
        return {
          display: option,
          key: option,
          value: option
        };
      }}
      updateValue={newValue => setForm({
        ...form,
        defaultSkill: newValue
      })}
      value={form.defaultSkill}
    />
  );
};

DefaultSkillDropDown.propTypes = {
  defaultSkills: PropTypes.shape({
    levels: PropTypes.object.isRequired,
    skills: PropTypes.array.isRequired
  }),
  defaultSkillDisplay: PropTypes.string.isRequired
};

export default DefaultSkillDropDown;