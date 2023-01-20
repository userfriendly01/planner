import { Dropdown } from "components";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";


const SkillDropDown = props => {
  const {
    skills,
    updateSkill,
    skill,
    skillGroups
  } = props;

  const SubText = styled.div`
  font-size: 10px;
  font-weight: bold
`;

  const getSkillAndSkillGroupOptions = () => {
    const optionsList = [];

    // skill groups
    skillGroups.forEach(option => {
      optionsList.push({
        value: option.skillGroupId,
        label: option.skillGroupNme,
        isSkillGroup: true,
        skills: option.skills
      });
    });

    optionsList.push({
      label: "divider",
      value: "divider"
    });
    // skills
    skills.forEach(skill => {
      optionsList.push({
        label: skill.name,
        value: skill.name
      });
    });

    return optionsList;
  };

  // const getSkillOptions = optionsList => {
  //   return optionsList.map(option => ({
  //     value: option.name,
  //     label: option.name
  //   }));
  // };

  // const getSkillGroupOptions = optionsList => {
  //   return optionsList.map(option => {
  //     return {
  //       value: option.skillGroupId,
  //       label: option.skillGroupNme,
  //       isSkillGroup: true,
  //       skills: option.skills
  //     }; });
  // };

  const DropdownOption = props => {
    const {
      option
    } = props;

    return (
      <div>
        {  option.label === "divider"
          ? <hr /> :
          !option.isSkillGroup ? (
            <>
              <div>
                {option.label}
              </div>
            </>
          )
            :          <>
              <div>
                {option.label}
              </div>
              <SubText>
                Default Skill Grouping
              </SubText>
            </>
        }
      </div>
    );
  };

  return (
    <Dropdown
      styles={{
        small: true,
        height: "40px",
        width: "210px"
      }}
      CustomRender={DropdownOption}
      // options={[...getSkillGroupOptions(skillGroups), {
      //   label: "divider",
      //   value: "divider"
      // }, ...getSkillOptions(skills)]}
      options={[...getSkillAndSkillGroupOptions()]}
      value={{
        label: skill,
        value: skill
      }}
      updateValue={(event, newInputValue) => updateSkill(newInputValue)}
    />
  );
};

SkillDropDown.propTypes = {
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      skill: PropTypes.string.isRequired,
      levels: PropTypes.arrayOf(PropTypes.number)
    })
  ).isRequired,
  skill: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }),
    PropTypes.string.isRequired
  ]),
  skillGroups: PropTypes.arrayOf(
    PropTypes.shape({
      skill_group_id: PropTypes.number.isRequired,
      skill_group_nme: PropTypes.string.isRequired
    })
  ).isRequired,
  updateSkill: PropTypes.func.isRequired
};

export default SkillDropDown;