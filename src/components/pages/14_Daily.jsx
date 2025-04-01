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
  margin: 15px 1px 15px 8px;
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
      color: colors[0],
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
    margin: "0px 15px"
  }}>
    <div style={{
      width: "42%",
      fontSize: "13px"
    }}> {meal} </div>
    {includeHeaders &&
    <>
      <MiniHeader>Calories</MiniHeader>
      <MiniHeader>Protein</MiniHeader>
      <MiniHeader>Carbs</MiniHeader>
      <MiniHeader>Sugar</MiniHeader>
      <MiniHeader>Fat</MiniHeader>
      <MiniHeader>Sodium</MiniHeader>
    </>
    }
  </div>
));

const DrinkHeaderRow = ({
  meal, includeHeaders = false
}) => ((
  <div style={{
    display: "flex",
    alignContent: "center",
    width: "100%",
    fontFamily: "Optima, sans-serif",
    marginRight: "100px"
  }}>
    <div style={{
      width: "60%",
      fontSize: "13px"
    }}> {meal} </div>
    {includeHeaders &&
    <>
      <MiniHeader>Martinis</MiniHeader>
      <MiniHeader>Beers</MiniHeader>
      <MiniHeader>Mixed</MiniHeader>
      <MiniHeader>Wine</MiniHeader>
    </>
    }
  </div>
));

const EntryRow = ({ text, extra }) => {
  return (
  <div style={{
    display: "flex",
    width: "100%",
    fontFamily: "Optima, sans-serif",
  }}>
    <div style={{
      margin: extra ? "10px" : "10px 50px 10px 10px",
      width: "38%",
      textAlign: "center"
    }}>
      {text}
    </div>
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
     {extra && 
      <>
      <Divider style={{
      margin: "10px 5px",
      width: "7%"
    }}/>
      <Divider style={{
        margin: "10px 5px",
        width: "7%"
      }}/>
    </>
    }
  </div>
)};

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
        <EntryRow text="Meals" extra={true}/>
        <DrinkHeaderRow meal="" includeHeaders={true}/>
        <EntryRow text="Drinks"/>
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
        <Line/>
        <Line/>
        <Line/>
        <div style={{ height: "30px" }}></div>
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