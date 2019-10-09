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
  disablePriorityDropDown,
  getDefaultPriorityValueForSkill,
  getPriorityOptionsList
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
  width: 20%
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

  const taskrouterSkillsNotInDefaultSkills = taskrouterSkills.filter(skillObj => !defaultSkills.skills.includes(skillObj.name));

  // TODO I think this may need to be tweaked? not sure...
  const getDefaultNewSkillValues = () => ({
    skill: taskrouterSkillsNotInDefaultSkills[0].name,
    level: getDefaultPriorityValueForSkill(taskrouterSkills, taskrouterSkillsNotInDefaultSkills[0].name)
  });

  const [newSkill, setNewSkill] = useState(getDefaultNewSkillValues());

  const newSkillChanged = skill => setNewSkill({
    ...newSkill,
    skill,
    level: getDefaultPriorityValueForSkill(taskrouterSkills, skill)
  });

  const newSkillLevelChanged = level => {
    setNewSkill({
      ...newSkill,
      level
    });
  };

  const existingSkillLevelChanged = skill => level => {
    const updatedDefaultSkills = { ...defaultSkills };
    updatedDefaultSkills.levels[skill] = level;
    setDefaultSkills(updatedDefaultSkills);
  };

  const addSkillClicked = () => {
    const {
      level,
      skill
    } = newSkill;
    const updatedDefaultSkills = { ...defaultSkills };
    updatedDefaultSkills.skills.push(skill);
    if (newSkill.level) {
      updatedDefaultSkills.levels[skill] = level;
    }
    setDefaultSkills(updatedDefaultSkills);
    setNewSkill(getDefaultNewSkillValues());
  };

  const removeSkillClicked = skill => () => {
    const updatedDefaultSkills = { ...defaultSkills };
    updatedDefaultSkills.skills = updatedDefaultSkills.skills.filter(existingSkill => existingSkill !== skill);
    delete updatedDefaultSkills.levels[skill];
    setDefaultSkills(updatedDefaultSkills);
  };

  // TODO remove logs before commit
  console.log(defaultSkills);
  console.log(taskrouterSkills);

  return (
    <div>
      <Text>Default Profile</Text>
      <AddDefaultSkill>
        <AddSkillDropDown taskrouterSkills={taskrouterSkillsNotInDefaultSkills} skillValue={newSkill.skill} updateSkill={newSkillChanged} />
        <AddPriorityDropDown
          availablePriorities={getPriorityOptionsList(taskrouterSkills, newSkill.skill)}
          disabled={disablePriorityDropDown(taskrouterSkills, newSkill.skill)}
          priorityValue={newSkill.level}
          updatePriority={newSkillLevelChanged}
        />
        {/*TODO make sure add skill button is disabled if no priority is selected when we need one!!!*/}
        <AddCircleOutlineRounded onClick={addSkillClicked} />
      </AddDefaultSkill>
      <ExistingDefaultSkills>
        {defaultSkills.skills.map((skill, index) => {
          return (
            <SkillRowContainer key={`default-skill-row-${index}`}>
              <Skill>{skill}</Skill>
              <Priority>
                <AddPriorityDropDown
                  availablePriorities={getPriorityOptionsList(taskrouterSkills, skill)}
                  disabled={disablePriorityDropDown(taskrouterSkills, skill)}
                  priorityValue={defaultSkills.levels[skill] || "-"}
                  updatePriority={existingSkillLevelChanged(skill)}
                />
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