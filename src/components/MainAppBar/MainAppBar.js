import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import tritonLogo from "../../images/triton.png";

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    display: 'flex',
    backgroundColor: '#335182'
  },
  menuButton: {
    marginLeft: '12px',
    marginRight: '12px'
  },
  titleName: {
    display: 'flex',
    fontFamily: `'Comfortaa', cursive`
  },
  titleText: {
    alignItems: 'center',
    display: 'flex',
    fontSize: '1.6em',
  },
  tritonLogo: {
    height: '32px',
    marginLeft: '12px',
    marginRight: '5px',
    width: '32px',
  }
});

class MainAppBar extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar disableGutters={true} variant="dense">
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={() => this.props.toggleSideNav()}
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
  toggleSideNav: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(MainAppBar);
