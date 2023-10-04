import { logger } from "utils";
import {
  ProgressBarContainer,
  ProgressBarWrapper,
  ProgressBarFiller,
  TextWrapper
} from "../BulkChanges.Styles";
import { jokes } from "../BulkTemplates";
import React from "react";

const ProgressBar = (props: any) => {
  const {
    totalRowCount,
    completedRows
  } = props;

  const jokesIndexLength = jokes.length - 1;
  const [ selectedJokeIndex, setSelectedJokeIndex ] = React.useState(Math.floor((Math.random() * jokesIndexLength)));
  const percentageComplete =  Math.floor((completedRows/totalRowCount) * 100);

  logger.log("***Progress Bar", {
    percentageComplete,
    totalRowCount,
    completedRows
  });

  React.useEffect(() => {
    const updateJoke = () => {
      const newJoke = Math.floor((Math.random() * jokesIndexLength));
      setSelectedJokeIndex(newJoke);
    };
    setInterval(updateJoke, 20000);
  }, []);

  return (
    <ProgressBarContainer>
      <TextWrapper styles={{
        size: "26px"
      }}>{jokes[selectedJokeIndex]}</TextWrapper>
      <ProgressBarWrapper>
        <ProgressBarFiller progress={`${percentageComplete}%`}/>
      </ProgressBarWrapper>
    </ProgressBarContainer>
  );
};

export default ProgressBar;