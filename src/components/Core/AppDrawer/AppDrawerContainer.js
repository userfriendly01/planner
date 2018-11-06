import { connect } from "react-redux";
import AppDrawer from "./AppDrawer";

const mapStateToProps = (state) => {
  return {
    sideNav: state.navigation.drawerOpen
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(AppDrawer);