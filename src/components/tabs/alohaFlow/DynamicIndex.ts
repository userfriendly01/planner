
export enum TYPE {
  PHONE_NUMBER = "PHONENUMBER",
  ACTION = "ACTION",
}

export enum TYPENAME {
  MENU = "Menu",
  MENU_OPTIONS = "MenuOptions",
  ANNOUNCEMENT = "Announcement",
  PHONE_NUMBER = "PhoneNumber",
}

export enum ACTION_TYPE {
  MENU = "MENU",
  MENU_OPTIONS = "MENUOPTIONS",
  TRANSFER = "TRANSFER",
  HANGUP = "HANGUP",
  ANNOUNCEMENT = "ANNOUNCEMENT",
}

export type DynamicCallFlowItem = {
  callFlowName: string;
  createTime: number;
  updateTime: number;
};

export type DBExclusiveProps<T extends TYPE> = {
  pkey: string;
  skey: string;
  type: T;
  all: typeof ALL;
};

export type GraphQLExclusivePhoneNumberProps = {
  phoneNumber: string;
};

export type GraphQLExclusiveProps<T extends TYPENAME> = {
  __typename: T;
};



export const ALL = "ALL";