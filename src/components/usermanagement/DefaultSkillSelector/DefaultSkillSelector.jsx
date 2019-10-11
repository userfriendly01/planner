import {
  AddCircleOutlineRounded,
  DeleteRounded
} from "@material-ui/icons";
import {
  AddPriorityDropDown,
  AddSkillDropDown
} from "components";
import { useAdminState } from "context";
import { theme } from "globals";
import PropTypes from "prop-types";
import React, {
  useState
} from "react";
import styled from "styled-components";
import {
  findTaskRouterSkill
} from "utils";

const AddDefaultSkill = styled.div`
  display: flex;
  align-items: center;
`;

const ExistingDefaultSkills = styled.div`

`;

const Priority = styled.div`
  width: 20%;
`;

const Skill = styled.div`
  width: 55%
`;

const SkillRowContainer = styled.div`
  align-items: center;
  display: flex;
  margin: 2%;
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

const DefaultSkillSelector = props => {
  const {
    defaultSkills,
    setDefaultSkills
  } = props;

  const {
    skillContext: {
      taskrouterSkills
    }
  } = useAdminState();

  const taskrouterSkillsForDropDown = taskrouterSkills.filter(skillObj => !defaultSkills.skills.includes(skillObj.skill));

  const defaultNewSkill = {
    levels: [],
    levelSelected: null,
    skill: ""
  };

  const [newSkill, setNewSkill] = useState(defaultNewSkill);

  const newSkillChanged = skill => {
    const skillObj = findTaskRouterSkill(skill, taskrouterSkills);
    setNewSkill({
      levels: skillObj.levels,
      levelSelected: skillObj.levels.length > 0 ? skillObj.levels[0] : null,
      skill: skillObj.skill
    });
  };

  const newSkillLevelChanged = level => setNewSkill({
    ...newSkill,
    levelSelected: parseInt(level)
  });

  const existingSkillLevelChanged = skill => level => {
    const updatedDefaultSkills = { ...defaultSkills };
    updatedDefaultSkills.levels[skill] = parseInt(level);
    setDefaultSkills(updatedDefaultSkills);
  };

  const addSkillClicked = () => {
    const {
      levelSelected,
      skill
    } = newSkill;
    const updatedDefaultSkills = { ...defaultSkills };
    updatedDefaultSkills.skills.push(skill);
    if (newSkill.levelSelected) {
      updatedDefaultSkills.levels[skill] = parseInt(levelSelected);
    }
    setDefaultSkills(updatedDefaultSkills);
    setNewSkill(defaultNewSkill);
  };

  const removeSkillClicked = skill => () => {
    const updatedDefaultSkills = { ...defaultSkills };
    updatedDefaultSkills.skills = updatedDefaultSkills.skills.filter(existingSkill => existingSkill !== skill);
    delete updatedDefaultSkills.levels[skill];
    setDefaultSkills(updatedDefaultSkills);
  };

  // TODO remove logs before commit
  // console.log("newSkill", newSkill);
  // console.log("defaultSkills", defaultSkills);
  // console.log("taskrouterSkills", taskrouterSkills);

  const skillHasPriorities = newSkill.levels.length > 0 ? true : false;
  const displayAddSkillButton = newSkill.skill !== "" && ((skillHasPriorities && newSkill.levelSelected) || (!skillHasPriorities)) ? true : false;
  const addSkillButtonColorDisabled = newSkill.skill === "" || (skillHasPriorities && !newSkill.levelSelected) ? true : false;

  return (
    <div>
      <Text>Default Profile</Text>
      <AddDefaultSkill>
        <AddSkillDropDown
          skillValue={newSkill.skill}
          taskrouterSkills={taskrouterSkillsForDropDown}
          updateSkill={newSkillChanged} />
        {skillHasPriorities ?
          <AddPriorityDropDown
            availablePriorities={newSkill.levels}
            priorityValue={newSkill.levelSelected}
            updatePriority={newSkillLevelChanged}
          /> : null}
        <AddCircleOutlineRounded
          color={addSkillButtonColorDisabled ? "disabled" : "inherit"}
          onClick={displayAddSkillButton ? addSkillClicked : null} />
      </AddDefaultSkill>
      <ExistingDefaultSkills>
        {defaultSkills.skills.map((skill, index) => {
          const taskrouterSkill = findTaskRouterSkill(skill, taskrouterSkills);
          return (
            <SkillRowContainer key={`default-skill-row-${index}`}>
              <Skill>{skill}</Skill>
              <Priority>
                {defaultSkills.levels.hasOwnProperty(skill) === true ?
                  <AddPriorityDropDown
                    availablePriorities={taskrouterSkill.levels}
                    priorityValue={defaultSkills.levels[skill]}
                    updatePriority={existingSkillLevelChanged(skill)}
                  /> : null}
              </Priority>
              <DeleteRounded onClick={removeSkillClicked(skill)}/>
            </SkillRowContainer>
          );
        })}
      </ExistingDefaultSkills>
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