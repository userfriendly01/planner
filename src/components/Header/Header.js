import React from "react";
import { Icon } from "@rmwc/icon";
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarNavigationIcon,
  TopAppBarActionItem,
  TopAppBarTitle
} from "@rmwc/top-app-bar";
import "./header.css";
import tritonLogo from "../../images/triton_logo.ico";

class Header extends React.Component {
  render() {
    return (
      <TopAppBar dense={true} fixed={true}>
        <TopAppBarRow>
          <TopAppBarSection alignStart>
            <TopAppBarNavigationIcon icon="menu" />
            <TopAppBarTitle className="appTitle">
              <img src={tritonLogo} />
              Triton Admin
            </TopAppBarTitle>
          </TopAppBarSection>
          <TopAppBarSection alignEnd>
            <TopAppBarActionItem
              aria-label="Bookmark this page"
              alt="Bookmark this page"
            >
              David Klimaszewski
            </TopAppBarActionItem>
          </TopAppBarSection>
        </TopAppBarRow>
      </TopAppBar>
    );
  }
}

export default Header;
