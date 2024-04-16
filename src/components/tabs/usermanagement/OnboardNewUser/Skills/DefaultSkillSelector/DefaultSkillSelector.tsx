import {
  DashDiv,
  DefaultSkillsWrapper,
  IconButtonWrapper,
  SkillRow,
  SkillRowItem,
  SkillRowSeperator,
  SkillsWrapper
} from "./DefaultSkillSelector.Styles";
import {
  DefaultSkillSelectorProps,
  NewTwilioWorkerSkill
} from "./DefaultSkillSelector.Interfaces";
import {
  SkillsList,
  SkillLevels
} from "components";
import { useAdminState } from "context";
import { Skill } from "globals";
import React from "react";
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
  const skillGroups = useAdminState().skillContext.skillGroups.slice();

  const skillsForDropDown = skills.filter((skillObj: Skill) => !defaultSkills.skills.includes(skillObj.name));

  const skillGroupsForDropDown = skillGroups.filter((skillGr: any) => {
    // if all skills in a skill group are in the defaultSkills, remove the skillGr from the dropdown list
    const allSkillsInGroupSelected = skillGr.skills.every((sk: Skill) => defaultSkills.skills.includes(sk.name));
    if (allSkillsInGroupSelected) {
      return false;
    }
    return true;
  });

  const defaultNewSkill: NewTwilioWorkerSkill = {
    levels: [],
    levelSelected: null,
    skill: ""
  };

  const [newSkill, setNewSkill] = React.useState<NewTwilioWorkerSkill>(defaultNewSkill);

  const newSkillChanged = (skill: {
    [index: string]: any,
    value: string
  }) => {
    const skillObj = skills.find(skillObj => skillObj.name === skill.value);
    if (skill.isSkillGroup) {
      setNewSkill({
        levels: [],
        levelSelected: null,
        skill: skill.label,
        skills: skill.skills
      });
    } else if(skillObj){
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
    console.log(newSkill);

    const {
      levelSelected,
      skill,
      skills
    } = newSkill;
    const updatedDefaultSkills = { ...defaultSkills };
    // a skill group will have multiple skills to add, loop through those skills and add each
    if (skills) {
      skills.forEach((skill: any) => {
        // don't add a duplicate skill
        if (!updatedDefaultSkills.skills.find(s => s === skill.name)) {
          updatedDefaultSkills.skills.push(skill.name);
          if (skill.levels?.length) {
            updatedDefaultSkills.levels[skill.name] = skill.levels[0];
          }
        }
      });
    } else {
      updatedDefaultSkills.skills.push(skill);
    }
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
          <SkillsList
            skillGroups={skillGroupsForDropDown}
            skills={skillsForDropDown}
            skill={newSkill.skill}
            updateSkill={newSkillChanged} />
        </SkillRowItem>
        <SkillRowItem>
          {skillHasPriorities ?
            <SkillLevels
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
                  <SkillLevels
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