import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./TeamRolesMainStyles";

class TeamRolesMain extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
          This is the Team Roles Page
      </div>
    );
  }
}

TeamRolesMain.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(TeamRolesMain);
