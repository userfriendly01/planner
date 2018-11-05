import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import MainAppBar from "./MainAppBar/MainAppBarContainer";
import AppDrawer from "./AppDrawer/AppDrawerContainer";
// import Main from "./Main/Main";
import { BrowserRouter as Router, Route } from "react-router-dom";

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex"
  }
});

class App extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Router>
        <div className={classes.root}>
          <MainAppBar />
          <AppDrawer />
          {/* <Route exact path="/" component={Main} /> */}
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(App);
