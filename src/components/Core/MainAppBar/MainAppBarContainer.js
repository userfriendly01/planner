import { connect } from "react-redux";
import MainAppBar from "./MainAppBar";
import { toggleDrawer, toggleMobileDrawer } from "../../../redux/actions/actions";

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
      toggleSideNav: () => dispatch(toggleDrawer()),
      toggleMobileSideNav: () => dispatch(toggleMobileDrawer())
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(MainAppBar);