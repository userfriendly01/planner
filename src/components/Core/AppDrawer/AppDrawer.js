import React from "react";
import PropTypes from "prop-types";
import compose from 'recompose/compose';
import { withStyles } from "@material-ui/core/styles";
import withWidth from '@material-ui/core/withWidth';
import classNames from "classnames";
import Drawer from "@material-ui/core/Drawer";
import Hidden from '@material-ui/core/Hidden';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Assignment from "@material-ui/icons/Assignment";
import People from "@material-ui/icons/People";
import Settings from "@material-ui/icons/Settings";
import { styles } from "./AppDrawerStyles";
import { Link } from "react-router-dom";

class AppDrawer extends React.Component {

  handleClick = () => {
    if (this.props.width === "xs") {
      this.props.toggleMobileSideNav();
    }
  }

  render() {
    const { classes, drawerState, mobileDrawerState, width } = this.props;
    const drawer = (
      <List className={classes.sideNav}>
        <Link className={classes.link} to="/">
          <ListItem onClick={() => this.handleClick()} button>
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary="Team Roles" />
          </ListItem>
        </Link>
        <Link className={classes.link} to="/capabilities/">
          <ListItem onClick={() => this.handleClick()} button>
            <ListItemIcon>
              <Assignment />
            </ListItemIcon>
            <ListItemText primary="Role Capabilities" />
          </ListItem>
        </Link>
        <Link className={classes.link} to="/settings/">
          <ListItem onClick={() => this.handleClick()} button>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Triton Settings" />
          </ListItem>
        </Link>
      </List>
    );
    return (
      <nav>
        {/* The implementation can be swap with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={this.props.container}
            variant="temporary"
            anchor={'left'}
            open={mobileDrawerState}
            onClose={() => this.props.toggleMobileSideNav()}
            classes={{
              paper: classes.drawerPaperModal,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(
                classes.drawerPaper,
                !drawerState && classes.drawerPaperClose
              )
            }}
            open={drawerState}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    );
  }
}

AppDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  drawerState: PropTypes.bool.isRequired,
  mobileDrawerState: PropTypes.bool.isRequired,
  toggleMobileSideNav: PropTypes.func.isRequired,
  width: PropTypes.string.isRequired
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withWidth()
)(AppDrawer);
