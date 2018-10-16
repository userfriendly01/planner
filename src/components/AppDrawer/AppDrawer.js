import {
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerTitle,
  DrawerSubtitle,
  DrawerAppContent
} from "@rmwc/drawer";
import AppBar from "../AppBar/AppBarContainer";
import { List, ListItem, ListItemPrimaryText } from "@rmwc/list";
import React from "react";
import "./appDrawer.css";

export class AppDrawer extends React.Component {
  render() {
    return (
      <div>
        <Drawer dismissible open={this.props.drawerState}>
          <DrawerContent>
            <List>
              <ListItem>Team Management</ListItem>
              <ListItem>Role Configuration</ListItem>
              <ListItem>Triton Settings</ListItem>
            </List>
          </DrawerContent>
        </Drawer>
        <DrawerAppContent>
          <div className="flexRow">
            <AppBar />
          </div>
        </DrawerAppContent>
      </div>
    );
  }
}
