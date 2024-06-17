import React from "react";
import { SkillsContainerProps } from "../Skills.Interfaces";
import {
  SkillsTableWrapper,
  SkillsWrapper
} from "../Skills.Styles";
import { SkillsTable } from "callflowmanagement/SkillsTable";
import { SkillsHeader } from "callflowmanagement/SkillsHeader";
import { getTimeOfDays } from "services/timeOfDays";
import { getTaskQueues } from "services/taskQueues";
import { getApplications } from "services/applications";

export const SkillsContainer = (props: SkillsContainerProps) => {

  const {
    tableState,
    setTableState
  } = props;


  const [ taskQueues, setTaskQueues ] = React.useState([]);
  const [ applications, setApplications ] = React.useState([]);
  const [ timeOfDays, setTimeOfDays ] = React.useState([]);

  React.useEffect(() => {
    getTaskQueueOptions();
    getApplicationOptions();
    getTimeOfDaysOptions();
  }, []);

  const getTaskQueueOptions = async () => {
    const results = await getTaskQueues();
    setTaskQueues(results);
  };

  const getApplicationOptions = async () => {
    const results = await getApplications();
    setApplications(results);
  };

  const getTimeOfDaysOptions = async () => {
    const results = await getTimeOfDays();
    setTimeOfDays(results);
  };

  return (
    <SkillsWrapper>
      <SkillsHeader
        tableState={tableState}
        setTableState={setTableState}
        taskQueues={taskQueues}
        applications={applications}
        timeOfDays={timeOfDays}
      />
      <SkillsTableWrapper>
        <SkillsTable
          tableState={tableState}
          setTableState={setTableState}
        />
      </SkillsTableWrapper>
    </SkillsWrapper>
  );
};