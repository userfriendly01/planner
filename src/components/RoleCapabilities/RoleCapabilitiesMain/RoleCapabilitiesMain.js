import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./RoleCapabilitiesMainStyles";

class RoleCapabilitiesMain extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
          This is the Role Capabilities Page
      </div>
    );
  }
}

RoleCapabilitiesMain.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(RoleCapabilitiesMain);
