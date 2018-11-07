import { connect } from "react-redux";
import AppDrawer from "./AppDrawer";
import { toggleMobileDrawer } from "../../../redux/actions/actions";

const mapStateToProps = (state) => {
  return {
    drawerState: state.navigation.drawerOpen,
    mobileDrawerState: state.navigation.mobileDrawerOpen
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleMobileSideNav: () => dispatch(toggleMobileDrawer())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppDrawer);