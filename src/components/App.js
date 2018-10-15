import React from "react";
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarNavigationIcon
} from "@rmwc/top-app-bar";
import { SimpleTopAppBar } from "@rmwc/top-app-bar";
import "@rmwc/top-app-bar/node_modules/@material/top-app-bar/dist/mdc.top-app-bar.css";

class App extends React.Component {
  render() {
    return (
      <SimpleTopAppBar
        title="test"
        navigationIcon={{ onClick: () => console.log("Navigate") }}
        actionItems={[
          { onClick: () => console.log("Do Something"), use: "bookmark" }
        ]}
      />
    );
  }
}

export default App;
