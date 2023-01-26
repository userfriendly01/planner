import React from "react";
import {
  ProgressBarContainer,
  ProgressBarWrapper,
  ProgressBarFiller,
  TextWrapper
} from "../BulkChanges.Styles";
import { getJokes } from "services";

const ProgressBar = (props: any) => {
  const {
    totalRowCount,
    completedRows
  } = props;

  const [ jokes, setJokes ] = React.useState(null);
  const [ activeJoke, setActiveJokes ] = React.useState(jokes ? jokes[0] : null);
  const percentageComplete =  Math.floor((completedRows/totalRowCount) * 100);
  console.log("in progressbar", percentageComplete);

  React.useEffect(() => {
    if(!jokes){
      try {
        const jokes = getJokes();
        setJokes(jokes);
      } catch(err){
        console.error("Aww no jokes", err);
      }
    }
  }, []);

  return (
    <ProgressBarContainer>
      { jokes && <TextWrapper styles={{
        size: "26px"
      }}> {jokes[0].joke} </TextWrapper>
      }
      <ProgressBarWrapper>
        <ProgressBarFiller progress={`${percentageComplete}%` || "34%"}/>
      </ProgressBarWrapper>
    </ProgressBarContainer>
  );
};

export default ProgressBar;