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
  skill: string,
  skills?: any[]
}

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
    const shouldRemoveFromList = skillGr.skills.every((sk: Skill) => defaultSkills.skills.includes(sk.name));
    if (shouldRemoveFromList) {
      return false;
    }
    return true;
  });

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
    console.log("SKILL IN NEWSKILLCHANGED", skill);
    const skillObj = skills.find(skillObj => skillObj.name === skill.value);
    if (skill.isSkillGroup) {
      // find the skill group, match up the skills and fill in?
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
    const {
      levelSelected,
      skill,
      skills
    } = newSkill;
    console.log("addSkillClicked newSkill", newSkill)
    const updatedDefaultSkills = { ...defaultSkills };
    // a skill group will have multiple skills to add, loop through those skills and add each
    if (skills) {
      skills.forEach((skill: any) => {
        // don't add a duplicate skill
        if (!updatedDefaultSkills.skills.find(s => s === skill.name)) {
          updatedDefaultSkills.skills.push(skill.name);
          if (skill.levels.length > 0) {
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
  console.log("defaultSkills", defaultSkills)
  return (
    <DefaultSkillsWrapper>
      <SkillRow>
        <SkillRowItem>
          <SkillDropDown
            skillGroups={skillGroupsForDropDown}
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
          const taskrouterSkill: any = skills.find(skillObj => skillObj.name === skill) || {
            name: skill,
            levels: []
          };
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