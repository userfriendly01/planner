import {
  DashDiv,
  DefaultSkillsWrapper,
  IconButtonWrapper,
  SkillRow,
  SkillRowItem,
  SkillRowSeperator,
  SkillsWrapper
} from "usermanagement/DefaultSkillSelector.Styles";
import {
  DefaultSkillSelectorProps,
  NewTwilioWorkerSkill
} from "usermanagement/DefaultSkillSelector.Interfaces";
import { SkillLevels } from "usermanagement/SkillLevels";
import { useSkillState } from "context/appContext";
import {
  Skill, SkillGroup
} from "callflowmanagement/Skills.Interfaces";
import React from "react";
import {
  Add,
  Delete
} from "@mui/icons-material";
import { SkillsList } from "../SkillsList/SkillsList";

export const DefaultSkillSelector = (props: DefaultSkillSelectorProps): JSX.Element => {
  const {
    defaultSkills,
    setDefaultSkills
  } = props;

  const { skills } = useSkillState();
  const skillGroups = useSkillState().skillGroups.slice();

  const skillsForDropDown = skills.filter((skillObj: Skill) => !defaultSkills.skills.includes(skillObj.name));

  const skillGroupsForDropDown = skillGroups.filter((skillGr: SkillGroup) => {
    // if all skills in a skill group are in the defaultSkills, remove the skillGr from the dropdown list
    const allSkillsInGroupSelected = skillGr.skills?.every((sk: Skill) => defaultSkills.skills.includes(sk.name));
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
    if (skill.isSkillGroup) {
      setNewSkill({
        levels: [],
        levelSelected: null,
        skill: skill.label,
        skills: skill.skills
      });
      return;
    }

    const skillObj: Skill = skills.find(sk => sk.name === skill.value);

    if (skillObj) {
      setNewSkill({
        levels: skillObj.levels,
        levelSelected: skillObj.levels?.length ? skillObj.levels[0] : null,
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
    const updatedDefaultSkills = { ...defaultSkills };
    // a skill group will have multiple skills to add, loop through those skills and add each
    if (newSkill.skills) {
      newSkill.skills.forEach((skillName: string) => {
        const skillObj: Partial<Skill> = skills.find(skillObj => skillObj.name === skillName) || {};
        if (!updatedDefaultSkills.skills.find(s => s === skillName)) {
          updatedDefaultSkills.skills.push(skillName);
          if (skillObj.levels?.length) {
            updatedDefaultSkills.levels[skillName] = skillObj.levels[0];
          }
        }
      });
    } else {
      updatedDefaultSkills.skills.push(newSkill.skill);
    }
    if (newSkill.levelSelected) {
      updatedDefaultSkills.levels[newSkill.skill] = newSkill.levelSelected;
    }

    setDefaultSkills(updatedDefaultSkills);
    setNewSkill(defaultNewSkill);
  };

  const removeSkillClicked = (skill: string) => () => {
    const updatedDefaultSkills = { ...defaultSkills };
    delete updatedDefaultSkills.levels[skill];

    setDefaultSkills({
      ...updatedDefaultSkills,
      skills: updatedDefaultSkills.skills.filter((existingSkill: string) => existingSkill !== skill)
    });
  };

  const skillHasPriorities = !!newSkill.levels?.length;
  const addSkillButtonDisabled = newSkill.skill === "" || (skillHasPriorities && !newSkill.levelSelected);
  console.warn("Faith", addSkillButtonDisabled, newSkill);
  console.warn("Faithhh", skillsForDropDown);
  return (
    <DefaultSkillsWrapper>
      <SkillRow>
        <SkillRowItem>
          <SkillsList
            skillGroups={skillGroupsForDropDown}
            skills={skillsForDropDown}
            skill={newSkill.skill}
            updateSkill={newSkillChanged}
          />
        </SkillRowItem>
        <SkillRowItem>
          {skillHasPriorities && (
            <SkillLevels
              availablePriorities={newSkill.levels}
              priorityValue={newSkill.levelSelected}
              updatePriority={newSkillLevelChanged}
            />
          )}
          {!skillHasPriorities && DashDiv}
        </SkillRowItem>
        <SkillRowItem>
          <IconButtonWrapper disabled={addSkillButtonDisabled} onClick={addSkillClicked} data-testid="add-skill-button">
            <Add fontSize={"inherit"}/>
          </IconButtonWrapper>
        </SkillRowItem>
      </SkillRow>
      <SkillRowSeperator/>
      <SkillsWrapper>
        {[...defaultSkills.skills].sort().map((skill: string, index: number) => {
          const taskrouterSkill: any = skills.find(skillObj => skillObj.name === skill) || {
            name: skill,
            levels: []
          };
          const hasLevels = !!taskrouterSkill.levels?.length;

          return (
            <SkillRow highlightOnHover={true} key={`default-skill-row-${index}`}>
              <SkillRowItem>{skill}</SkillRowItem>
              <SkillRowItem>
                {hasLevels && (
                  <SkillLevels
                    availablePriorities={taskrouterSkill.levels}
                    priorityValue={defaultSkills.levels[skill]}
                    updatePriority={existingSkillLevelChanged(skill)}
                  />
                )}
                {!hasLevels && DashDiv}
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