import { Typography } from "@material-ui/core";
import {
  Content,
  StyledTabs,
  StyledTab,
  StyledTabContainer
} from "./NavTabs.Styles";
import {
  TabPanelProps
} from "./NavTabs.Interfaces";
import {
  ManagementWrapper,
  ProfileSettingsContainer,
  MessageContainer
} from "components";
import { tabNames } from "authentication";
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
          <StyledTab label="Flash Message"  id="nav-tab-flashMessage" aria-controls="nav-tabpanel-flashMessage" onClick={event => event.preventDefault()}/>
          <StyledTab label="Closed Message" id="nav-tab-closedMessage" aria-controls="nav-tabpanel-closedMessage" onClick={event => event.preventDefault()}/>
        </StyledTabs>
      </StyledTabContainer>
      <TabPanel value={value} tabName={tabNames.USER_MANAGEMENT} index={0}>
        <ManagementWrapper />
      </TabPanel>
      <TabPanel value={value} tabName={tabNames.PROFILE_SETTINGS} index={1}>
        <ProfileSettingsContainer />
      </TabPanel>
      <TabPanel value={value} tabName={tabNames.FLASH_MESSAGE} index={2}>
        <MessageContainer value="flash" />
      </TabPanel>
      <TabPanel value={value} tabName={tabNames.CLOSED_MESSAGE} index={3}>
        <MessageContainer value="closed" />
      </TabPanel>
    </Content>
  );
};

export default NavTabs;
