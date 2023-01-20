import {
  DashDiv,
  DefaultSkillsWrapper,
  IconButtonWrapper,
  SkillRow,
  SkillRowItem,
  SkillRowSeperator,
  SkillsWrapper,
  SkillHeaderText
} from "./DefaultSkillSelector.Styles";
import {
  DefaultSkillSelectorProps,
  NewTwilioWorkerSkill
} from "./DefaultSkillSelector.Interfaces";
import {
  PriorityDropDownButts,
  SkillDropdown
} from "components";
import { useAdminState } from "context";
import { Skill } from "globals";
import React, {
  useState
} from "react";
import {
  Add,
  Delete
} from "@mui/icons-material";

const DefaultSkillSelector = (props: DefaultSkillSelectorProps) => {
  const {
    defaultSkills,
    setDefaultSkills
  } = props;

  const skills = useAdminState().skillContext.skills.slice().filter(s => s.levels);

  const skillsForDropDown = skills.filter((skillObj: Skill) => !defaultSkills.skills.includes(skillObj.name));

  const defaultNewSkill: NewTwilioWorkerSkill = {
    levels: [],
    levelSelected: null,
    skill: ""
  };

  const [newSkill, setNewSkill] = useState<NewTwilioWorkerSkill>(defaultNewSkill);

  const newSkillChanged = (skill: {
    [index: string]: any,
    value: string
  }) => {
    const skillObj = skills.find(skillObj => skillObj.name === skill.value);
    if(skillObj){
      setNewSkill({
        levels: skillObj.levels,
        levelSelected: skillObj.levels.length > 0 ? skillObj.levels[0] : null,
        skill: skillObj.name
      });
    }
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
      <SkillHeaderText>Default Skill Profile (Optional)</SkillHeaderText>
      <SkillRow>
        <SkillRowItem>
          <SkillDropdown
            skills={skillsForDropDown}
            skill={newSkill.skill}
            updateSkill={newSkillChanged} />
        </SkillRowItem>
        <SkillRowItem>
          {skillHasPriorities ?
            <PriorityDropDownButts
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
          const taskrouterSkill: any = skills.find(skillObj => skillObj.name === skill) || {
            name: skill,
            levels: []
          };
          return (
            <SkillRow highlightOnHover={true} key={`default-skill-row-${index}`}>
              <SkillRowItem>{skill}</SkillRowItem>
              <SkillRowItem>
                {defaultSkills.levels[skill] ?
                  <PriorityDropDownButts
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

export default DefaultSkillSelector;