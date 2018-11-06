import { connect } from "react-redux";
import MainAppBar from "./MainAppBar";
import { toggleDrawer } from "../../redux/actions/actions";

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
      toggleSideNav: (state) => dispatch(toggleDrawer(state))
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(MainAppBar);