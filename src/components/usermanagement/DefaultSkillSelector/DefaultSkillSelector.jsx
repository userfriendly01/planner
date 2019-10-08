import {
  AddCircleOutlineRounded,
  DeleteRounded
} from "@material-ui/icons";
import {
  AddPriorityDropDown,
  AddSkillDropDown,
  DefaultPriorityDropDown
} from "components";
import { theme } from "globals";
import PropTypes from "prop-types";
import React, {
  useState
} from "react";
import styled from "styled-components";

const AddDefaultSkill = styled.div`
  display: flex;
  align-items: center;
`;

const EmptyDiv = styled.div`
  width: 20%
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
    availableSkills,
    defaultSkills
    // setDefaultSkills
  } = props;

  const [opts, setOpts] = useState({
    skillValue: "",
    priorityValue: ""
  });

  const skillChanged = skill => {
    setOpts({
      ...opts,
      skillValue: skill,
      priorityValue: ""
    });
  };

  const priorityChanged = priority => {
    setOpts({
      ...opts,
      priorityValue: priority
    });
  };

  return (
    <div>
      <Text>Default Profile</Text>
      <AddDefaultSkill>
        <AddSkillDropDown availableSkills={availableSkills} skillValue={opts.skillValue} updateSkill={skillChanged} />
        <AddPriorityDropDown availableSkills={availableSkills} disabled={opts.skillValue.length === 0} priorityValue={opts.priorityValue} max={10} updatePriority={priorityChanged} />
        <AddCircleOutlineRounded />
      </AddDefaultSkill>
      <ExistingDefaultSkills>
        {defaultSkills.skills.map((skill, index) => {
          const priority = defaultSkills.levels[skill];
          return (
            <SkillRowContainer key={`default-skill-row-${index}`}>
              <Skill>{skill}</Skill>
              <Priority>
                {priority ? <DefaultPriorityDropDown defaultPriorityDisplay={priority} max={priority} /> : <EmptyDiv />}
              </Priority>
              <DeleteRounded />
            </SkillRowContainer>
          );
        })}
      </ExistingDefaultSkills>
    </div>
  );
};

DefaultSkillSelector.propTypes = {
  availableSkills: PropTypes.array.isRequired,
  defaultSkills: PropTypes.shape({
    levels: PropTypes.object.isRequired,
    skills: PropTypes.array.isRequired
  })
  // setDefaultSkills: PropTypes.func.isRequired
};

export default DefaultSkillSelector;