import {
  CenteredH2,
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
} from "@material-ui/icons";
import {
  PriorityDropDown,
  SkillDropDown
} from "components";
import { useAdminState } from "context";
import {
  TaskRouterSkill,
  WorkerSkills
} from "globals";
import PropTypes from "prop-types";
import React, {
  useState
} from "react";
import { findTaskRouterSkill } from "utils";


const DashDiv = <div>-</div>;
interface DefaultSkillSelectorProps {
  defaultSkills: WorkerSkills,
  setDefaultSkills: (defaultSkills: WorkerSkills) => void;
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

  const {
    skillContext: {
      taskrouterSkills
    }
  } = useAdminState();

  const taskrouterSkillsForDropDown = taskrouterSkills.filter((skillObj: TaskRouterSkill) => !defaultSkills.skills.includes(skillObj.skill));

  const defaultNewSkill: NewTwilioWorkerSkill = {
    levels: [],
    levelSelected: null,
    skill: ""
  };

  const [newSkill, setNewSkill] = useState<NewTwilioWorkerSkill>(defaultNewSkill);

  const newSkillChanged = (skill: any) => {
    const skillObj = findTaskRouterSkill(skill.value, taskrouterSkills);
    setNewSkill({
      levels: skillObj.levels,
      levelSelected: skillObj.levels.length > 0 ? skillObj.levels[0] : null,
      skill: skillObj.skill
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
    updatedDefaultSkills.skills = updatedDefaultSkills.skills.filter((existingSkill: any) => existingSkill !== skill);
    delete updatedDefaultSkills.levels[skill];
    setDefaultSkills(updatedDefaultSkills);
  };

  const skillHasPriorities = newSkill.levels.length > 0;
  const addSkillButtonDisabled = newSkill.skill === "" || (skillHasPriorities && !newSkill.levelSelected);

  return (
    <DefaultSkillsWrapper>
      <CenteredH2>Default Skills</CenteredH2>
      <SkillRow>
        <SkillRowItem>
          <SkillDropDown
            taskrouterSkills={taskrouterSkillsForDropDown}
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
        {defaultSkills.skills.sort().map((skill: any, index: number) => {
          const taskrouterSkill = findTaskRouterSkill(skill, taskrouterSkills);
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