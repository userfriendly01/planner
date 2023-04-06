import {
  Content,
  DropdownContainer,
  StyledLink,
  StyledTab,
  StyledTabContainer
} from "./NavTabs.Styles";
import React from "react";
import { useAdminState } from "context";
import { useNavigate } from "react-router-dom";

const NavTabs = () => {
  const state = useAdminState();
  const navigate = useNavigate();
  const authenticationProfiles = state.userContext.authenticationProfiles;

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
                data-testid="dropdown-action"
                onMouseEnter={() => handleDropdownOpen(t.value)}
                onMouseLeave={() => handleDropdownClosed(t.value)}
              >
                <StyledTab
                  key={t.value}
                  id={`nav-tab-${t.value}`}
                  aria-controls={`nav-tabpanel-${t.value}`}
                  onClick={() => navigate(t.route)}
                >
                  {t.label}
                </StyledTab>
                {t.dropdown && dropdownOpen[t.value] &&
                  <DropdownContainer>
                    { t.dropdown.map((d: any) => (
                      <StyledLink to={d.route}>{d.label}</StyledLink>
                    ))
                    }
                  </DropdownContainer>
                }
              </div>
            )) }
        </StyledTabContainer>
    </Content>
  );
};

export default NavTabs;