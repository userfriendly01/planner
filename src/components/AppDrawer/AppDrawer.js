import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Assignment from "@material-ui/icons/Assignment";
import People from "@material-ui/icons/People";
import Settings from "@material-ui/icons/Settings";

const drawerWidth = 220;

const styles = theme => ({
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9
    }
  },
  sideNav: {
    marginTop: 48
  }
});

class AppDrawer extends React.Component {
  render() {
    const { classes, sideNav } = this.props;
    return (
      <Drawer
        variant="permanent"
        classes={{
          paper: classNames(
            classes.drawerPaper,
            !sideNav && classes.drawerPaperClose
          )
        }}
        open={sideNav}
      >
        <List className={classes.sideNav}>
          <ListItem button>
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary="Team Roles" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <Assignment />
            </ListItemIcon>
            <ListItemText primary="Role Capabilities" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Triton Settings" />
          </ListItem>
        </List>
      </Drawer>
    );
  }
}

AppDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  sideNav: PropTypes.bool.isRequired
};

export default withStyles(styles, { withTheme: true })(AppDrawer);
