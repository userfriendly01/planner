import {
  DefaultPriorityDropDown,
  DefaultSkillDropDown
} from "components";
import { theme } from "globals";
// import PropTypes from "prop-types";
// import React, {
//   useState
// } from "react";
import React from "react";
import styled from "styled-components";


const SkillRowContainer = styled.div`
  display: flex;
`;

const Text = styled.div`
  align-self: center;
  color: ${theme.textColor};
  font-family: 'Roboto', sans-serif;
  font-size: 1.3rem;
  font-weight: 400;
  letter-spacing: 0rem;l
  line-height: 1.30357em;
  margin: 2% 2% 0% 2%;
`;

// setDefaultSkills sets default skills object to something like:
const defaultSkills = {
  skills: ["psu-l1", "psu-l2", "466"],
  levels: {
    "psu-l1": 3,
    "psu-l2": 4
  }
};

const DefaultSkillSelector = () => {
  // const {
  //   defaultSkills,
  //   setDefaultSkills
  // } = props;

  // const addSkillsRow = (
  //   <div>
  //     {
  //       /**
  //        * TODO
  //        * Dropdown of all the skills available in availableSkills
  //        * Dropdown of priorities per skill once selected
  //        * ADD button to add record
  //        *   fires setDefaultSkills
  //        */
  //     }
  //   </div>
  // );

  // const getAvailPriorities = max => {
  //   for (let i = 1; i <= max; i++) {
  //   // create an entry in the drop down
  //   }
  // };

  return (

    // Default Profile
    // <AddSkill /> <AvailablePriorities /> // ?????
    // <DefaultSkillDropDown /> <AvailablePriorities max = 3 />
    <div>
      <Text>DefaultProfile</Text>
      {defaultSkills.skills.map((skill, index) => {
        const priority = defaultSkills.levels[skill];
        return (
          <SkillRowContainer key={`default-skill-row-${index}`}>
            <DefaultSkillDropDown defaultSkills={defaultSkills} defaultSkillDisplay={skill} />
            {priority ? <DefaultPriorityDropDown defaultPriorityDisplay={priority} max={priority} /> : null}
            {/** TODO - Add a REMOVE button to remove this skill from object */}
          </SkillRowContainer>
        );
      })}
    </div>


  // <div>
  //   <Text>Default Profile</Text>
  //   <CustomSelect
  //     label={"Add Skill"}
  //     labelWidth={30}
  //     optionsList={availableSkills}
  //     optionsDisplayFunc={option => {
  //       return {
  //         display: option.skill_num,
  //         key: option.skill_num,
  //         value: option.skill_num
  //       };
  //     }}
  //   />
  //   {/* <CustomSelect
  //     label={"Priorities"}
  //     optionsList={getAvailablePriorities(skillz)}
  //     optionsDisplayFunc={option => {
  //       return {
  //         display: option.skill_num,
  //         key: ,
  //         value: 
  //       };
  //     }}
  //   /> */}
  //   {/* {defaultSkillRows} */}
  // </div>
  );
};

// DefaultSkillSelector.propTypes = {
//   defaultSkills: PropTypes.shape({
//     levels: PropTypes.object.isRequired,
//     skills: PropTypes.array.isRequired
//   }),
//   setDefaultSkills: PropTypes.func.isRequired
// };

export default DefaultSkillSelector;