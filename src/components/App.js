import React from "react";
import AppDrawer from "./AppDrawer/AppDrawerContainer";
import '@material/drawer/dist/mdc.drawer.css';
import '@material/list/dist/mdc.list.css';
import "@material/top-app-bar/dist/mdc.top-app-bar.css";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="flexColumn">
        <div className="flexRow">
          <AppDrawer />
        </div>
      </div>
    );
  }
}

export default App;
