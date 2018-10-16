import { connect } from "react-redux";
import { AppBar } from "./AppBar";
import { toggleDrawer } from "../../redux/actions"

const mapStateToProps = (state) => {
  return {
    drawerState: state.navigation.drawerOpen
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
      toggleDrawer: (state) => dispatch(toggleDrawer(state))
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(AppBar);