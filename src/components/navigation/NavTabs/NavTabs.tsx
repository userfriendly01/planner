import { Typography } from "@mui/material";
import {
  Content,
  StyledTabs,
  StyledTab,
  StyledTabContainer
} from "./NavTabs.Styles";
import {
  TabPanelProps,
  TabNames
} from "./NavTabs.Interfaces";
import {
  CallFlowContainer,
  ManagementWrapper,
  ProfileSettingsContainer
} from "components";
import React from "react";

const TabPanel = (props: TabPanelProps) => {
  const {
    children,
    tabName,
    value,
    index,
    ...other
  } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${tabName}`}
      aria-labelledby={`nav-tab-${tabName}`}
      {...other}
    >
      {children && children}
    </Typography>
  );
};

const NavTabs = () => {
  const [value, setValue] = React.useState(0);

  //We should test to see if the "other" makes a difference
  console.log("ENVIRONMENT AD GROUPS - TRITON_AUTH_AD_GROUPS", process.env.TRITON_AUTH_AD_GROUPS);
  console.log("ENVIRONMENT AD GROUPS - ALOHA_AUTH_AD_GROUPS", process.env.ALOHA_AUTH_AD_GROUPS);

  function handleChange(event: any, newValue: number) {
    setValue(newValue);
    window.scrollTo(0, 0);
  }

  return (
    <Content >
      <StyledTabContainer>
        <StyledTabs variant="fullWidth" value={value} onChange={handleChange}>
          <StyledTab label="User Management" id="nav-tab-userManagement" aria-controls="nav-tabpanel-userManagement" onClick={event => event.preventDefault()}/>
          <StyledTab label="Profile Settings" id="nav-tab-profileSettings" aria-controls="nav-tabpanel-profileSettings" onClick={event => event.preventDefault()}/>
          <StyledTab label="Call Flow Management" id="nav-tab-callFlowManagement" aria-controls="nav-tabpanel-callFlowManagement" onClick={event => event.preventDefault()}/>
        </StyledTabs>
      </StyledTabContainer>
      <TabPanel value={value} tabName={TabNames.USER_MANAGEMENT} index={0}>
        <ManagementWrapper />
      </TabPanel>
      <TabPanel value={value} tabName={TabNames.PROFILE_SETTINGS} index={1}>
        <ProfileSettingsContainer />
      </TabPanel>
      <TabPanel value={value} tabName={TabNames.CALL_FLOW_MANAGEMENT} index={2}>
        <CallFlowContainer />
      </TabPanel>
    </Content>
  );
};

export default NavTabs;
