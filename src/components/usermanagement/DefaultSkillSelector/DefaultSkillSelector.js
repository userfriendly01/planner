import React, {
  useState
} from "react";

import PropTypes from "prop-types";

// TODO get this from context
const availableSkills = [
  {
    skill_num: "psu-l1",
    max_priority: 3
  },
  {
    skill_num: "psu-l2",
    max_priority: 3
  },
  {
    skill_num: "466",
    max_priority: null
  }
];

/* 
setDefaultSkills sets default skills object to something like:
{
  skills: ["psu-l1", "466"]
  levels: {
    "psu-l1": 3
  }
}
*/

const DefaultSkillSelector = props => {
  const {
    defaultSkills,
    setDefaultSkills
  } = props;

  const addSkillsRow = (
    <div>
      {
        /**
         * TODO
         * Dropdown of all the skills available in availableSkills
         * Dropdown of priorities per skill once selected
         * ADD button to add record
         *   fires setDefaultSkills
         */
      }
    </div>
  );

  const defaultSkillRows = defaultSkills.skills.map((skill, index) => {
    const priority = defaultSkills.levels[skill] || "-";
    return (
      <div key={`default-skill-row-${index}`}>
        <div>{skill}</div>
        <div>{priority}</div> {/* TODO make priority an dropdown */}
        {/** TODO - Add a REMOVE button to remove this skill from object */}
      </div>
    );
  });

  return (
    <div>
      {defaultSkillRows}
    </div>
  );
};

DefaultSkillSelector.propTypes = {
  defaultSkills: PropTypes.shape({
    levels: PropTypes.object.isRequired,
    skills: PropTypes.array.isRequired
  }),
  setDefaultSkills: PropTypes.func.isRequired
};

export default DefaultSkillSelector;