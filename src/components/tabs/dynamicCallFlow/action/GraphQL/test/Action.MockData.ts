import {
  Announcement, Menu, MenuOption, MenuOptions
} from "dynamicCallFlowAction/GraphQL/Action.Interfaces";
import { ActionTypeEnum } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";

export const AnnouncementOne: Announcement = {
  actionId: "1",
  actionType: ActionTypeEnum.ANNOUNCEMENT,
  speech: "This is announcement one",
  nextActionId: "3",
  nextActionType: ActionTypeEnum.MENU
};

export const AnnouncementTwo: Announcement = {
  actionId: "2",
  actionType: ActionTypeEnum.ANNOUNCEMENT,
  speech: "This is announcement two",
  nextActionId: "3",
  nextActionType: ActionTypeEnum.MENU
};

export const MenuOne: Menu = {
  actionId: "3",
  actionType: ActionTypeEnum.MENU,
  speech: "This is menu one",
  allowBargeIn: true,
  finishOnKey: "#",
  minDigits: 1,
  maxDigits: 1,
  timeout: 10,
  repeat: {
    callerContextAttributes: "Repeat",
    loop: 3,
    nextActionId: "3",
    nextActionType: ActionTypeEnum.MENU
  },
  nextActionId: "5",
  nextActionType: ActionTypeEnum.MENUOPTIONS
};

export const MenuOptionsOne: MenuOptions = {
  actionId: "5",
  actionType: ActionTypeEnum.MENU_OPTIONS,
  options: [
    {
      digit: "1",
      callerContextAttributes: "Option 1",
      nextActionId: "7",
      nextActionType: ActionTypeEnum.HANGUP
    } as MenuOption,
    {
      digit: "2",
      callerContextAttributes: "Option 2",
      nextActionId: "8",
      nextActionType: ActionTypeEnum.TRANSFER
    } as MenuOption
  ]
};

export const CallFlowConfigOne = [
  AnnouncementOne,
  MenuOne,
  MenuOptionsOne
];