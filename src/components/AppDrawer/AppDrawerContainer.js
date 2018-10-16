import { connect } from "react-redux";
import { AppDrawer } from "./AppDrawer";
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

export default connect(mapStateToProps, mapDispatchToProps)(AppDrawer);