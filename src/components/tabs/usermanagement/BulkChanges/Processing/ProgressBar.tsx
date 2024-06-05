import { logger } from "utils/logger";
import {
  ProgressBarContainer,
  ProgressBarWrapper,
  ProgressBarFiller,
  TextWrapper
} from "usermanagement/BulkChanges.Styles";
import { jokes } from "usermanagement/consts";
import React from "react";

export const ProgressBar = (props: any) => {
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