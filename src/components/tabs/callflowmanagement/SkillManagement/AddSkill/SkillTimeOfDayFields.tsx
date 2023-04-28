import React from "react";
import styled from "styled-components";
import TimePickerComponent from "components/core/SharedComponents/TimepickerComponent";
import { Dropdown, StyledButton } from "components";
import {
  FormControlLabel,
  Switch
} from "@mui/material";

const FieldContainter = styled.div`
  display: flex;
  flex-direction: row;
`;

const ToggleContainer = styled.div`
  display:flex;
  flex-direction: column;
`;

// TODO:  I need to think through this more.  
// If skill time of days will always follow the groupings of weekend and weekdays, then I can just have these grouped that way and won't even need toggles...
// But if we need complete flexibility (like any day could have different times from a different day)
// then this will need to get smarter...

const SkillTimeOfDayFields = (props: any) => {
//   const { availableDays } = props;

  const [ days, setDays ] = React.useState([]);
  const [startTime, setStartTime ] = React.useState(null);
  const [endTime, setEndTime ] = React.useState(null);

  React.useEffect(() => {
    if (startTime && endTime) {

      const start = `${startTime.hour()}:${startTime.minute()}:${startTime.second() < 10 ? "0" + startTime.second() : startTime.second()}`;
      const end = `${endTime.hour()}:${endTime.minute()}:${endTime.second() < 10 ? "0" + endTime.second() : endTime.second()}`;
      const timeObj: any = {};
      days.forEach((day: string) => {
        timeObj[day] = {
          startTime: start,
          endTime: end
        };
      });
      console.log("LOOK HERE", timeObj);
    }
  }, [startTime, endTime, days]);

//   console.log("OPTIONS", availableDays);
  return (
    <FieldContainter>
      {/* <Dropdown
        options={availableDays}
        multiple={true}
        value={days}
        updateValue={(e: any, values: any[]) => {
            setDays(values)
            
        }}
      /> */}
      <ToggleContainer>
        <FormControlLabel
          label={"Sunday"}
          labelPlacement="end"
          control={<Switch
            //   inputProps={{ "aria-label": "toggle-zero-out" }}
            //   checked={form[control.fieldKey].value}
            onChange={(e: any, isChecked: any) => {
              if (isChecked) {
                setDays([...days, "sunday"]);
              } else {
                setDays(days.filter((day: string) => day !== "sunday"));
              }
            }}
          />} />
        <FormControlLabel
          label={"Monday"}
          labelPlacement="end"
          control={<Switch
            //   inputProps={{ "aria-label": "toggle-zero-out" }}
            //   checked={form[control.fieldKey].value}
            onChange={(e: any, isChecked: any) => {
              if (isChecked) {
                setDays([...days, "monday"]);
              } else {
                setDays(days.filter((day: string) => day !== "monday"));
              }
            }}
          />} />
        <FormControlLabel
          label={"Tuesday"}
          labelPlacement="end"
          control={<Switch
            //   inputProps={{ "aria-label": "toggle-zero-out" }}
            //   checked={form[control.fieldKey].value}
            onChange={(e: any, isChecked: any) => {
              if (isChecked) {
                setDays([...days, "tuesday"]);
              } else {
                setDays(days.filter((day: string) => day !== "tuesday"));
              }
            }}
          />} />
        <FormControlLabel
          label={"Wednesday"}
          labelPlacement="end"
          control={<Switch
            //   inputProps={{ "aria-label": "toggle-zero-out" }}
            //   checked={form[control.fieldKey].value}
            onChange={(e: any, isChecked: any) => {
              if (isChecked) {
                setDays([...days, "wednesday"]);
              } else {
                setDays(days.filter((day: string) => day !== "wednesday"));
              }
            }}
          />} />
        <FormControlLabel
          label={"Thursday"}
          labelPlacement="end"
          control={<Switch
            //   inputProps={{ "aria-label": "toggle-zero-out" }}
            //   checked={form[control.fieldKey].value}
            onChange={(e: any, isChecked: any) => {
              if (isChecked) {
                setDays([...days, "thursday"]);
              } else {
                setDays(days.filter((day: string) => day !== "thursday"));
              }
            }}
          />} />
        <FormControlLabel
          label={"Friday"}
          labelPlacement="end"
          control={<Switch
            //   inputProps={{ "aria-label": "toggle-zero-out" }}
            //   checked={form[control.fieldKey].value}
            onChange={(e: any, isChecked: any) => {
              if (isChecked) {
                setDays([...days, "friday"]);
              } else {
                setDays(days.filter((day: string) => day !== "friday"));
              }
            }}
          />} />
        <FormControlLabel
          label={"Saturday"}
          labelPlacement="end"
          control={<Switch
            //   inputProps={{ "aria-label": "toggle-zero-out" }}
            //   checked={form[control.fieldKey].value}
            onChange={(e: any, isChecked: any) => {
              if (isChecked) {
                setDays([...days, "saturday"]);
              } else {
                setDays(days.filter((day: string) => day !== "saturday"));
              }
            }}
          />} />
      </ToggleContainer>
      <TimePickerComponent
        label="startTime"
        name="startTime"
        value={startTime}
        withSeconds={true}
        onChange={(e: any) => {
          console.log("timechange", e);
          setStartTime(e);
          // setSkillForm({
          //   ...skillForm,
          //   startTime: e
          // });
        }}
      />
      <TimePickerComponent
        label="endTime"
        name="endTime"
        value={endTime}
        withSeconds={true}
        onChange={(e: any) => {
          console.log("timechange", e);
          setEndTime(e);
          // setSkillForm({
          //   ...skillForm,
          //   endTime: e
          // });
        }}
      />
    </FieldContainter>
  );
};

export default SkillTimeOfDayFields;