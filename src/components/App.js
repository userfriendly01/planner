import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import MainAppBar from "./Core/MainAppBar/MainAppBarContainer";
import AppDrawer from "./Core/AppDrawer/AppDrawerContainer";
import CapabilitiesMain from "./RoleCapabilities/RoleCapabilitiesMain/RoleCapabilitiesMain";
import TeamRolesMain from "./TeamRoles/TeamRolesMain/TeamRolesMain";
import Settings from "./TritonSettings/TritonSettingsMain/TritonSettingsMain";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { styles } from "./AppStyles";

class App extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Router>
        <div className={classes.root}>
          <MainAppBar />
          <AppDrawer />
          <main className={classes.main}>
            <Route exact path="/" component={TeamRolesMain} />
            <Route path="/capabilities/" component={CapabilitiesMain} />
            <Route path="/settings/" component={Settings} />
          </main>
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(App);
