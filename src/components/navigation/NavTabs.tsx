import {
  Content,
  DropdownContainer,
  StyledLink,
  StyledTab,
  StyledTabContainer
} from "./NavTabs.Styles";
import React from "react";
import {
  useAdminState, useSkillState
} from "context/appContext";
import { useNavigate } from "react-router-dom";
import { logger } from "utils/logger";

const NavTabs = () => {
  const state = useAdminState();
  const { permissions } = state.userContext;

  logger.log("STATE", state);
  logger.log("SKILL STATE", useSkillState());

  const navigate = useNavigate();

  const [ tabs, setTabs ] = React.useState([]);
  const [ dropdownOpen, setDropdownOpen ] = React.useState<any>({});

  const handleDropdownOpen = (value: string) => {
    setDropdownOpen((originalValue: any) => {
      return {
        ...originalValue,
        [value]: true
      };
    });
  };

  const handleDropdownClosed = (value: string) => {
    setDropdownOpen((originalValue: any) => {
      return {
        ...originalValue,
        [value]: false
      };
    });
  };

  React.useEffect(() => {
    const allowedTabs: any[] = [];
    const tabsOpen: any = {};
    permissions.forEach(({ authenticationProfile }: any) => {
      authenticationProfile.tabs.forEach((tab:any) => {
        if(!allowedTabs.includes(tab)){
          allowedTabs.push(tab);
          tabsOpen[tab.value] = false;

        }
      });
    });
    setTabs(allowedTabs);
    setDropdownOpen(tabsOpen);
  }, []);

  return (
    <Content>
      <StyledTabContainer>
        { tabs.map((t: any) => (
          <div
            data-testid="dropdown-action"
            onMouseEnter={() => handleDropdownOpen(t.value)}
            onMouseLeave={() => handleDropdownClosed(t.value)}
            key={t.value}
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
                      <StyledLink key={d.label} to={d.route}>{d.label}</StyledLink>
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