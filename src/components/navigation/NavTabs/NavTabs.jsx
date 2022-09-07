import {
  Tab,
  Tabs,
  Typography
} from "@mui/material";
import {
  ManagementWrapper,
  ProfileSettingsContainer,
  MessageContainer
} from "components";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTabs = styled(Tabs)`
  background-color: ${props => props.theme.libertyLightYellow};
  color: ${props => props.theme.textColor};
`;

const StyledTab = styled(Tab)`
  .Mui-selected {
    color: black;
  };
  && {
    font-size: 1.1em;
  }
`;

const StyledTabContainer = styled.div`
  position: sticky;
  top: 48px;
  z-index: 99;
`;

function TabPanel(props) {
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
      {children}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  tabName: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

const NavTabs = () => {
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
    window.scrollTo(0, 0);
  }

  return (
    <Content >
      <StyledTabContainer>
        <StyledTabs variant="fullWidth" value={value} onChange={handleChange}>
          <StyledTab label="User Management" href="/userManagement" id="nav-tab-userManagement" aria-controls="nav-tabpanel-userManagement" onClick={event => event.preventDefault()}/>
          <StyledTab label="Profile Settings" href="/profileSettings" id="nav-tab-profileSettings" aria-controls="nav-tabpanel-profileSettings" onClick={event => event.preventDefault()}/>
          <StyledTab label="Flash Message" href="/flashMessage" id="nav-tab-flashMessage" aria-controls="nav-tabpanel-flashMessage" onClick={event => event.preventDefault()}/>
          <StyledTab label="Closed Message" href="/closedMessage" id="nav-tab-closedMessage" aria-controls="nav-tabpanel-closedMessage" onClick={event => event.preventDefault()}/>
        </StyledTabs>
      </StyledTabContainer>
      <TabPanel value={value} tabName="userManagement" index={0}>
        <ManagementWrapper />
      </TabPanel>
      <TabPanel value={value} tabName="profileSettings" index={1}>
        <ProfileSettingsContainer />
      </TabPanel>
      <TabPanel value={value} tabName="flashMessage" index={2}>
        <MessageContainer value="flash" />
      </TabPanel>
      <TabPanel value={value} tabName="closedMessage" index={3}>
        <MessageContainer value="closed" />
      </TabPanel>
    </Content>
  );
};

export default NavTabs;
