import {
  Add,
  Delete
} from "@material-ui/icons";
import {
  PriorityDropDown,
  SkillDropDown
} from "components";
import {
  TwilioWorkerSkills,
  useAdminState
} from "context";
import PropTypes from "prop-types";
import React, {
  useState
} from "react";
import styled from "styled-components";
import {  findTaskRouterSkill } from "utils";

const CenteredH2 = styled.h2`
  margin: 8px 0;
  text-align: center;
`;

const DashDiv = <div>-</div>;

const DefaultSkillsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
  padding: 8px;
`;

const IconButtonWrapper = styled.button`
  all: unset;
  align-items: center;
  color: ${props => props.disabled ? props.theme.button.icon.disabledColor : "inherit"};
  cursor: pointer;
  display: flex;
  font-size: 20px;
  height: ${props => props.theme.button.icon.diameter}px;
  justify-content: center;
  width: ${props => props.theme.button.icon.diameter}px;
  &:hover:enabled {
    border-radius: ${props => props.theme.button.icon.diameter/2}px;
    background-color: ${props => props.theme.button.icon.backgroundHoverColor};
  }
`;

const SkillRow = styled.div`
  align-items: center;
  display: flex;
  height: 32px;
  &:hover { ${/* @ts-ignore */""}
    background-color: ${props => props.highlightOnHover ? props.theme.tableRow.hoverColor : null}
  }
`;

const SkillsWrapper = styled.div`
  max-height: 50vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    background-color: #F5F5F5;
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 6px;
    background: rgba(0,0,0,0.1);
    border: 1px solid #ccc;
  }
  
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #aaa;
    border: 1px solid #aaa;
  }
`;

const SkillRowItem = styled.div`
  &:nth-child(1) {
    display: flex;
    padding-right: 8px;
    width: 60%;
  }
  &:nth-child(2) {
    display: flex;
    justify-content: center;
    width: 20%;
  }
  &:nth-child(3) {
    display: flex;
    justify-content: flex-end;
    width: 20%;
  }
`;
const SkillRowSeperator = styled.div`
  border-bottom: 1px solid ${props => props.theme.lineSeperatorColor};
  margin-top: 8px;
`;

interface DefaultSkillSelectorProps {
  defaultSkills: TwilioWorkerSkills,
  setDefaultSkills: (defaultSkills: TwilioWorkerSkills) => void;
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

  const taskrouterSkillsForDropDown = taskrouterSkills.filter(skillObj => !defaultSkills.skills.includes(skillObj.skill));

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
    updatedDefaultSkills.skills = updatedDefaultSkills.skills.filter(existingSkill => existingSkill !== skill);
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
        {defaultSkills.skills.sort().map((skill, index) => {
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