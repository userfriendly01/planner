import React from "react";
import Header from "./Header/Header";
import "@material/top-app-bar/dist/mdc.top-app-bar.css";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="flexColumn">
        <div className="flexRow">
          <Header />
        </div>
      </div>
    );
  }
}

export default App;
