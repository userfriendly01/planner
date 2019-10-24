import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import {
  ManagementWrapper,
  SettingsWrapper
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
  && {
    font-size: 1.1em;
  }
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
  }

  return (
    <Content >
      <StyledTabs variant="fullWidth" value={value} onChange={handleChange}>
        <StyledTab label="User Management" href="/userManagement" id="nav-tab-userManagement" aria-controls="nav-tabpanel-userManagement" onClick={event => event.preventDefault()}/>
        {/* <StyledTab disabled label="Settings" href="/settings" id="nav-tab-settings" aria-controls="nav-tabpanel-settings" onClick={event => event.preventDefault()}/> */}
      </StyledTabs>
      <TabPanel value={value} tabName="userManagement" index={0}>
        <ManagementWrapper  />
      </TabPanel>
      <TabPanel value={value} tabName="settings" index={1}>
        <SettingsWrapper />
      </TabPanel>
    </Content>
  );
};

export default NavTabs;
