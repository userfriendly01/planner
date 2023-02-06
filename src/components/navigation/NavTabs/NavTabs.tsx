import { Typography } from "@mui/material";
import {
  Content,
  StyledTabs,
  StyledTab,
  StyledTabContainer
} from "./NavTabs.Styles";
import { TabPanelProps } from "./NavTabs.Interfaces";
import React from "react";
import { useAdminState } from "context";

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
  const state = useAdminState();
  const authenticationProfiles = state.userContext.authenticationProfiles;
  const [value, setValue] = React.useState(0);
  const [ tabs, setTabs ] = React.useState([]);
  console.log("STATE", state);

  React.useEffect(() => {
    const allowedTabs: any[] = [];
    authenticationProfiles.forEach(p => {
      p.tabs.forEach((t: any) => {
        allowedTabs.push(t);
      });
    });
    setTabs(allowedTabs);
  }, []);


  function handleChange(event: any, newValue: number) {
    setValue(newValue);
    window.scrollTo(0, 0);
  }

  return (
    <Content>
      <>
        <StyledTabContainer>
          <StyledTabs variant="fullWidth" value={value} onChange={handleChange}>
            { tabs.map((t: any) => (
              <StyledTab label={t.label} key={t.value} id={`nav-tab-${t.value}`} aria-controls={`nav-tabpanel-${t.value}`} onClick={(event: any) => event.preventDefault()}/>
            )) }
          </StyledTabs>
        </StyledTabContainer>
        {
          tabs.map((t: any, index: number) => {
            const Component = t.component;
            return <TabPanel key={t.value} value={value} tabName={t.label} index={index}>
              <Component/>
            </TabPanel>;
          })
        }
      </>
    </Content>
  );
};

export default NavTabs;