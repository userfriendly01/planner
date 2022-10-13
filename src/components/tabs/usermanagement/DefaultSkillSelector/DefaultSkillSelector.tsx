import {
  DefaultSkillsWrapper,
  IconButtonWrapper,
  SkillRow,
  SkillRowItem,
  SkillRowSeperator,
  SkillsWrapper
} from "./DefaultSkillSelector.Styles";
import {
  Add,
  Delete
} from "@mui/icons-material";
import {
  PriorityDropDown,
  SkillDropDown
} from "components";
import { useAdminState } from "context";
import {
  Skill,
  WorkerAttributeSkills
} from "globals";
import PropTypes from "prop-types";
import React, {
  useState
} from "react";


const DashDiv = <div>-</div>;
interface DefaultSkillSelectorProps {
  defaultSkills: WorkerAttributeSkills,
  setDefaultSkills: (defaultSkills: WorkerAttributeSkills) => void;
}
interface NewTwilioWorkerSkill {
  levels: number[],
  levelSelected: number,
  skill: string
}

const DefaultSkillSelector = (props: DefaultSkillSelectorProps) => {
  const {
    defaultSkills,
    setDefaultSkills
  } = props;

  const skills = useAdminState().skillContext.skills.slice().filter(s => s.levels);

  const skillsForDropDown = skills.filter((skillObj: Skill) => !defaultSkills.skills.includes(skillObj.name) && skillObj.levels);

  const defaultNewSkill: NewTwilioWorkerSkill = {
    levels: [],
    levelSelected: null,
    skill: ""
  };

  const [newSkill, setNewSkill] = useState<NewTwilioWorkerSkill>(defaultNewSkill);
  console.log("NEW SKILL", newSkill);

  const newSkillChanged = (skill: {
    [index: string]: any,
    value: string
  }) => {
    const skillObj = skills.find(skillObj => skillObj.name === skill.value);
    setNewSkill({
      levels: skillObj.levels,
      levelSelected: skillObj.levels.length > 0 ? skillObj.levels[0] : null,
      skill: skillObj.name
    });
  };

  const newSkillLevelChanged = (level: string) => setNewSkill({
    ...newSkill,
    levelSelected: parseInt(level)
  });

  const existingSkillLevelChanged = (skill: string) => (level: string) => {
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
      updatedDefaultSkills.levels[skill] = levelSelected;
    }
    setDefaultSkills(updatedDefaultSkills);
    setNewSkill(defaultNewSkill);
  };

  const removeSkillClicked = (skill: string) => () => {
    const updatedDefaultSkills = { ...defaultSkills };
    updatedDefaultSkills.skills = updatedDefaultSkills.skills.filter((existingSkill: string) => existingSkill !== skill);
    delete updatedDefaultSkills.levels[skill];
    setDefaultSkills(updatedDefaultSkills);
  };

  const skillHasPriorities = newSkill.levels.length > 0;
  const addSkillButtonDisabled = newSkill.skill === "" || (skillHasPriorities && !newSkill.levelSelected);

  return (
    <DefaultSkillsWrapper>
      <SkillRow>
        <SkillRowItem>
          <SkillDropDown
            skills={skillsForDropDown}
            skill={newSkill.skill}
            updateSkill={newSkillChanged} />
        </SkillRowItem>
        <SkillRowItem>
          {skillHasPriorities ?
            <PriorityDropDown
              availablePriorities={newSkill.levels}
              priorityValue={newSkill.levelSelected}
              updatePriority={newSkillLevelChanged}
            /> : DashDiv}
        </SkillRowItem>
        <SkillRowItem>
          <IconButtonWrapper disabled={addSkillButtonDisabled} onClick={addSkillClicked} data-testid="add-skill-button">
            <Add fontSize={"inherit"}/>
          </IconButtonWrapper>
        </SkillRowItem>
      </SkillRow>
      <SkillRowSeperator/>
      <SkillsWrapper>
        {defaultSkills.skills.sort().map((skill: string, index: number) => {
          const taskrouterSkill = skills.find(skillObj => skillObj.name === skill);
          return (
            // @ts-ignore
            <SkillRow highlightOnHover={true} key={`default-skill-row-${index}`}>
              <SkillRowItem>{skill}</SkillRowItem>
              <SkillRowItem>
                {defaultSkills.levels.hasOwnProperty(skill) === true ?
                  <PriorityDropDown
                    availablePriorities={taskrouterSkill.levels}
                    priorityValue={defaultSkills.levels[skill]}
                    updatePriority={existingSkillLevelChanged(skill)}
                  /> : DashDiv}
              </SkillRowItem>
              <SkillRowItem>
                <IconButtonWrapper onClick={removeSkillClicked(skill)} data-testid="delete-skill-button">
                  <Delete fontSize="inherit"/>
                </IconButtonWrapper>
              </SkillRowItem>
            </SkillRow>
          );
        })}
      </SkillsWrapper>
    </DefaultSkillsWrapper>
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