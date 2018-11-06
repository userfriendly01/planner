import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./TritonSettingsMainStyles";

class TritonSettingsMain extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
          This is the Triton Settings Page
      </div>
    );
  }
}

TritonSettingsMain.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(TritonSettingsMain);
