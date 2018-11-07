import React from "react";
import PropTypes from "prop-types";
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import tritonLogo from "../../../images/triton.png";
import { styles } from "./MainAppBarStyles";

class MainAppBar extends React.Component {

  handleClick = () => {
    if (this.props.width === "xs") {
      this.props.toggleMobileSideNav();
    } else {
      this.props.toggleSideNav();
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar disableGutters={true} variant="dense">
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={() => this.handleClick()}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.titleName} variant="h5" color="inherit" noWrap>
            <img className={classes.tritonLogo} src={tritonLogo} />
            <div className={classes.titleText}>
              Triton Admin
            </div>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

MainAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  toggleMobileSideNav: PropTypes.func.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  width: PropTypes.string.isRequired
};

export default compose(
  withStyles(styles),
  withWidth(),
)(MainAppBar);
