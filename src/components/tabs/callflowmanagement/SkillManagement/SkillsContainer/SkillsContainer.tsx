import React from "react";
import { SkillsContainerProps } from "../Skills.Interfaces";
import {
  SkillsTableWrapper,
  SkillsWrapper
} from "../Skills.Styles";
import {
  SkillsHeader,
  SkillsTable
} from "components";
import {
  SkillFormStateProvider
} from "context";
import {
  getTaskQueues,
  getApplications,
  getTimeOfDays
} from "services";

const SkillsContainer = (props: SkillsContainerProps) => {

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
    console.log("RESULTS TASK QUEUES", results);
    setTaskQueues(results);
  };

  const getApplicationOptions = async () => {
    const results = await getApplications();
    console.log("RESULTS FOR GET APPLICATIONS", results);
    setApplications(results);
  };

  const getTimeOfDaysOptions = async () => {
    const results = await getTimeOfDays();
    console.log("RESULTS FOR GET APPLICATIONS", results);
    setTimeOfDays(results);
  };

  return (
    <SkillFormStateProvider>
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
    </SkillFormStateProvider>
  );
};

export default SkillsContainer;

