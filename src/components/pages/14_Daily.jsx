/* eslint-disable react/prop-types */
import React from "react";
import { Page } from "../planner/Page";
import { Header } from "../planner/Header";
import { Divider } from "@mui/material";
import styled from "styled-components";
import { Bookmark } from "@mui/icons-material";
import { CheckBoxOutlineBlank } from "@mui/icons-material";

const Text = styled.div`
  font-family: Optima, sans-serif;
  display: flex;
  margin: 5px 1px 15px 8px;
  text-align: center;
  font-size: 13px;
`;

const SubText = styled.div`
  font-family: Optima, sans-serif;
  display: flex;
  margin: 5px 1px 15px 8px;
  text-align: center;
  font-size: 10px;
`;

const colors = ["#d3d2ff", "#d5f4fe", "#c5f7cd", "#ffdec7", "#e1c4f8", "#ffc9cf", "#f7d1e8"];

const DayMarker = () => ((
  <>
    <Bookmark sx={{
      position: "absolute",
      color: colors[6],
      fontSize: "117px",
      left: "0",
      top: "-15px"
    }}/>
    <Divider sx={{
      position: "absolute",
      width: "40px",
      left: "39",
      top: "18px"
    }}/>
    <Divider sx={{
      position: "absolute",
      width: "30px",
      left: "44",
      top: "34px"
    }}/>
    <Divider sx={{
      position: "absolute",
      width: "20px",
      left: "49",
      top: "52px"
    }}/>
  </>

));

const MiniHeader = styled.div`
  margin: 10px 5px;
  width: 7%;
  font-size: 8px;
  align-content: end;
  text-align: center;
  font-family: Optima, sans-serif;
`;

const SingleHeader = styled.div`
  margin: 10px 5px;
  width: 30%;
  font-size: 8px;
  align-content: end;
  text-align: center;
  font-family: Optima, sans-serif;
`;
const FoodHeaderRow = ({
  meal, includeHeaders = false
}) => ((
  <div style={{
    display: "flex",
    alignContent: "center",
    width: "100%",
    fontFamily: "Optima, sans-serif",
    marginBottom: "9px"
  }}>
    <div style={{
      margin: "0px 10px",
      width: "60%",
      fontSize: "13px"
    }}> {meal} </div>
    {includeHeaders &&
    <>
      <MiniHeader>Calories</MiniHeader>
      <MiniHeader>Protein</MiniHeader>
      <MiniHeader>Carbs</MiniHeader>
      <MiniHeader>Fat</MiniHeader>
    </>
    }
  </div>
));

const TotalsRow = () => ((
  <div style={{
    display: "flex",
    alignContent: "center",
    width: "100%",
    fontFamily: "Optima, sans-serif"
  }}>
    <div style={{
      margin: "0px 10px",
      width: "60%",
      fontSize: "13px"
    }}> Totals</div>
    <Divider style={{
      margin: "10px 5px",
      width: "7%"
    }}/>
    <Divider style={{
      margin: "10px 5px",
      width: "7%"
    }}/>
    <Divider style={{
      margin: "10px 5px",
      width: "7%"
    }}/>
    <Divider style={{
      margin: "10px 5px",
      width: "7%"
    }}/>
  </div>
));

const StepsHeaderRow = () => ((
  <div style={{
    display: "flex",
    alignContent: "center",
    width: "100%",
    fontFamily: "Optima, sans-serif"
  }}>
    <div style={{
      margin: "0px 10px",
      width: "60%",
      fontSize: "13px"
    }}> Steps </div>
    <MiniHeader>Count</MiniHeader>
  </div>
));

const WorkoutHeaderRow = () => ((
  <div style={{
    display: "flex",
    alignContent: "center",
    width: "100%",
    fontFamily: "Optima, sans-serif"
  }}>
    <div style={{
      margin: "0px 10px",
      width: "60%",
      fontSize: "13px"
    }}> Workouts </div>
    <MiniHeader>Time</MiniHeader>
    <MiniHeader>Weight</MiniHeader>
    <MiniHeader>Reps</MiniHeader>
    <MiniHeader>Sets</MiniHeader>
  </div>
));

const EntryRow = () => ((
  <div style={{
    display: "flex",
    width: "100%"
  }}>
    <Divider style={{
      margin: "10px",
      width: "60%"
    }}/>
    <Divider style={{
      margin: "10px 5px",
      width: "7%"
    }}/>
    <Divider style={{
      margin: "10px 5px",
      width: "7%"
    }}/>
    <Divider style={{
      margin: "10px 5px",
      width: "7%"
    }}/>
    <Divider style={{
      margin: "10px 5px",
      width: "7%"
    }}/>
  </div>
));

const StepsEntryRow = () => ((
  <div style={{
    display: "flex",
    width: "100%"
  }}>
    <Divider style={{
      margin: "10px",
      width: "60%"
    }}/>
    <Divider style={{
      margin: "10px 5px",
      width: "7%"
    }}/>
  </div>
));

const Line = () => ((
  <div style={{
    display: "flex",
    width: "100%",
    marginLeft: "20px"
  }}>
    <Divider style={{
      margin: "10px",
      width: "90%"
    }}/>
  </div>
));

const WakeupRow = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  margin-top: 20px;
`;

export const Daily = ({ side }) => {
  if(side === "L"){
    return (
      <Page>
        <DayMarker/>
        <Header>DAILY PLANNER</Header>
        <WakeupRow>
          <SingleHeader style={{
            width: "100px",
            justifySelf: "center"
          }}>WAKE UP<Divider style={{ marginTop: "20px" }}/></SingleHeader>
          <SingleHeader style={{ width: "100px" }}>
            <div style={{ width: "100%" }}>STAYED AWAKE</div>
            <CheckBoxOutlineBlank/>
          </SingleHeader>
        </WakeupRow>
        <Text>FOOD LOG</Text>
        <FoodHeaderRow meal="" includeHeaders={true}/>
        <FoodHeaderRow meal="Breakfast"/>
        <EntryRow/>
        <FoodHeaderRow meal="Lunch"/>
        <EntryRow/>
        <FoodHeaderRow meal="Dinner"/>
        <EntryRow/>
        <FoodHeaderRow meal="Snacks"/>
        <EntryRow/>
        <EntryRow/>
        <FoodHeaderRow meal="Drinks"/>
        <EntryRow/>
        <EntryRow/>
        <TotalsRow/>
        <Text style={{ marginTop: "20px" }}>EXERCISE LOG</Text>
        <div style={{ display: "flex" }}>
          <WakeupRow style={{ marginTop: 0 }}>
            <SingleHeader style={{
              width: "100px",
              display: "flex",
              flexDirection: "column"
            }}>
              <CheckBoxOutlineBlank style={{
                marginBottom: "10px",
                alignSelf: "center"
              }}/>
            Stretch
              <Divider style={{ marginTop: "25px" }}/>
            </SingleHeader>
          </WakeupRow>
          <WakeupRow style={{ marginTop: 0 }}>
            <SingleHeader style={{
              width: "100px",
              display: "flex",
              flexDirection: "column"
            }}>
              <CheckBoxOutlineBlank style={{
                marginBottom: "10px",
                alignSelf: "center"
              }}/>
            10K Steps
              <Divider style={{ marginTop: "25px" }}/>
            </SingleHeader>
          </WakeupRow>
          <WakeupRow style={{ marginTop: 0 }}>
            <SingleHeader style={{
              width: "100px",
              display: "flex",
              flexDirection: "column"
            }}>
              <CheckBoxOutlineBlank style={{
                marginBottom: "10px",
                alignSelf: "center"
              }}/>
            50
              <Divider style={{ marginTop: "25px" }}/>
            </SingleHeader>
          </WakeupRow>
          <WakeupRow style={{ marginTop: 0 }}>
            <SingleHeader style={{
              width: "100px",
              display: "flex",
              flexDirection: "column"
            }}>
              <CheckBoxOutlineBlank style={{
                marginBottom: "10px",
                alignSelf: "center"
              }}/>
            50
              <Divider style={{ marginTop: "25px" }}/>
            </SingleHeader>
          </WakeupRow>
        </div>
      </Page>
    );
  }

  if(side === "R"){
    return (
      <Page>
        <div style={{
          height: "61px"
        }}/>
        <Text>DREAMS</Text>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
        <Text>NOTES</Text>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
        <Line/>
        <Text>SUMMARY</Text>
        <div style={{ display: "flex" }}>
          <WakeupRow style={{ marginTop: 0 }}>
            <SingleHeader style={{
              width: "100px",
              display: "flex",
              flexDirection: "column"
            }}>
            CALORIES IN
              <Divider style={{ marginTop: "20px" }}/>
            </SingleHeader>
          </WakeupRow>
          <WakeupRow style={{ marginTop: 0 }}>
            <SingleHeader style={{
              width: "100px",
              display: "flex",
              flexDirection: "column"
            }}>
            CALORIES OUT
              <Divider style={{ marginTop: "20px" }}/>
            </SingleHeader>
          </WakeupRow>
          <WakeupRow style={{ marginTop: 0 }}>
            <SingleHeader style={{
              width: "100px",
              display: "flex",
              flexDirection: "column"
            }}>
            OVER/UNDER
              <Divider style={{ marginTop: "20px" }}/>
            </SingleHeader>
          </WakeupRow>
        </div>
        <SubText>MOOD</SubText>
        <div style={{ height: "60px" }}></div>
        <WakeupRow style={{ marginTop: 0 }}>
          <SingleHeader style={{
            fontSize: "10px",
            width: "50%"
          }}>I AM GRATEFUL FOR<Divider style={{
              marginTop: "25px"
            }}/></SingleHeader>
          <SingleHeader style={{
            fontSize: "10px",
            width: "50%"
          }}>I WILL MAKE TOMORROW BETTER BY<Divider style={{
              marginTop: "25px"
            }}/></SingleHeader>
        </WakeupRow>
      </Page>
    );
  }
};