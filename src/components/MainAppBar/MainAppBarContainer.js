import { connect } from "react-redux";
import MainAppBar from "./MainAppBar";
import { toggleDrawer } from "../../redux/actions";

const mapStateToProps = (state) => {
  return {
    drawerState: state.navigation.drawerOpen
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
      toggleSideNav: (state) => dispatch(toggleDrawer(state))
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(MainAppBar);