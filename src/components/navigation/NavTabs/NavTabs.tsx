import {
  Content,
  StyledTabNew,
  StyledTabContainer
} from "./NavTabs.Styles";
import React from "react";
import { useAdminState } from "context";
 import { Link, useNavigate } from "react-router-dom";


const NavTabs = () => {
  const state = useAdminState();
  const navigate = useNavigate();
  const authenticationProfiles = state.userContext.authenticationProfiles;

  const [ value, setValue ] = React.useState(0);
  const [ tabs, setTabs ] = React.useState([]);
  const [ dropdownOpen, setDropdownOpen ] = React.useState<any>({});

  const handleDropdownOpen = (value: string) => {
    setDropdownOpen((originalValue: any) => {
      return {
        ...originalValue,
        [value]: true
      }
    });
  }

  const handleDropdownClosed = (value: string) => {
    setDropdownOpen((originalValue: any) => {
      return {
        ...originalValue,
        [value]: false
      }
    });
  }

  console.log("STATE", state);
  console.log("tabs", tabs);
  console.log("dropdownOpen", dropdownOpen);
  console.log("value", value);

  React.useEffect(() => {
    const allowedTabs: any[] = [];
    const tabsOpen: any = {}
    authenticationProfiles.forEach(p => {
      p.tabs.forEach((t: any) => {
        const value = t.value;
        allowedTabs.push(t);
        tabsOpen[value] = false;
      });
    });
    setTabs(allowedTabs);
    setDropdownOpen(tabsOpen)
  }, []);

  return (
      <Content>
        <StyledTabContainer>
          { tabs.map((t: any) => (
              <div
                onMouseEnter={() => handleDropdownOpen(t.value)}
                onMouseLeave={() => handleDropdownClosed(t.value)}
              >
                <StyledTabNew
                  key={t.value}
                  id={`nav-tab-${t.value}`}
                  aria-controls={`nav-tabpanel-${t.value}`}
                  onClick={() => navigate(t.route)}
                >
                  {t.label}
                </StyledTabNew>
                {t.dropdown && dropdownOpen[t.value] &&
                <div>
                  { t.dropdown.map((d: any) => (
                    <Link to={d.route}>{d.label}</Link>
                  ))
                  }
                </div>
                }
              </div>
            )) }
        </StyledTabContainer>
    </Content>
  );
};

export default NavTabs;