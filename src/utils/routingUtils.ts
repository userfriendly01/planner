import {
  RoutingStateVariables, RoutingDropDownList, AddPageFieldConfigProps as AddRoutingFieldConfigProps, CctSharedCallRoutingDb
} from "../components/tabs/alohaRouting/AlohaRouting.Interfaces";
import { FormValidationRule } from "./interfaces";

export const ROUTING_CACHE_MASTER_DATA = "ROUTING_MASTER_DATA";

export const CACHE_FILTER_ROUTING = "SEARCH_FILTER_ROUTING";

export const CACHED_CALL_ROUTING_PAGE_NO = "CALL_ROUTING_PAGE_NO";

export const CACHED_CALL_ROUTING_PER_PAGE = "CALL_ROUTING_PER_PAGE";

export const numbersOnlyFields: string[] = ["percentOfCallers"];

export const emptyInitFields: string[] = ["transferMessage", "twilioSkill", "dayOfWeek", "transferDestination"];

export const dayOfWeek: string[] = ["ALL", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY", "WEEKDAY", "WEEKEND", "HOLIDAY"];

export const priority: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

export const callerState: string[] = ["State", "OF", "HI"];

export const routingDropDownList: RoutingDropDownList = {
  brand: [],
  callerState,
  language: [],
  dayOfWeek,
  channel: [],
  policyType: [],
  priority
};

export const routingInitState: RoutingStateVariables = {
  data: [],
  filteredItems: [],
  advanceFilter: {},
  fetching: true,
  selectedRow: undefined,
  isEditModalOpen: false,
  isAddModalOpen: false,
  isAdvanceSearchModalOpen: false,
  idStart: 0,
  idEnd: 0,
  maxId: 0,
  minId: 0,
  saveSuccess: false
};

export const routingFields: AddRoutingFieldConfigProps[] = [
  {
    label: "ID",
    key: "id",
    control: "input",
    required: true,
    disableEdit: true,
    disableAdd: true,
    valueGetter: (params: CctSharedCallRoutingDb) => `${params?.id || ""}`,
    valueSetter: (currentValue: CctSharedCallRoutingDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })

  },
  {
    label: "Partition Key",
    key: "pkey",
    control: "input",
    disableAdd: true,
    disableEdit: true,
    valueGetter: (params: CctSharedCallRoutingDb) => `${params?.pkey || ""}`,
    valueSetter: (currentValue: CctSharedCallRoutingDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })

  },
  {
    label: "Sort Key",
    key: "skey",
    control: "input",
    disableAdd: true,
    disableEdit: true,
    valueGetter: (params: CctSharedCallRoutingDb) => `${params?.skey || ""}`,
    valueSetter: (currentValue: CctSharedCallRoutingDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Brand",
    key: "brand",
    control: "select",
    required: true,
    disableEdit: true,
    valueGetter: (params: CctSharedCallRoutingDb) => `${params?.brand || ""}`,
    valueSetter: (currentValue: CctSharedCallRoutingDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Caller State",
    key: "callerState",
    control: "input",
    required: true,
    valueGetter: (params: CctSharedCallRoutingDb) => `${params?.callerState || ""}`,
    valueSetter: (currentValue: CctSharedCallRoutingDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Caller Type",
    key: "callerType",
    control: "input",
    required: true,
    valueGetter: (params: CctSharedCallRoutingDb) => `${params?.callerType || ""}`,
    valueSetter: (currentValue: CctSharedCallRoutingDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Call Intent",
    key: "callIntent",
    control: "input",
    required: true,
    disableEdit: true,
    valueGetter: (params: CctSharedCallRoutingDb) => `${params?.callIntent || ""}`,
    valueSetter: (currentValue: CctSharedCallRoutingDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Channel",
    key: "channel",
    control: "select",
    required: true,
    disableEdit: true,
    valueGetter: (params: CctSharedCallRoutingDb) => `${params?.channel || ""}`,
    valueSetter: (currentValue: CctSharedCallRoutingDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Day Of Week",
    key: "dayOfWeek",
    control: "select",
    required: true,
    valueGetter: (params: CctSharedCallRoutingDb) => `${params?.dayOfWeek || ""}`,
    valueSetter: (currentValue: CctSharedCallRoutingDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Transfer Destination",
    key: "transferDestination",
    control: "input",
    valueGetter: (params: CctSharedCallRoutingDb) => `${params?.transferDestination || ""}`,
    valueSetter: (currentValue: CctSharedCallRoutingDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Twilio Skill",
    key: "twilioSkill",
    control: "input",
    valueGetter: (params: CctSharedCallRoutingDb) => `${params?.twilioSkill || ""}`,
    valueSetter: (currentValue: CctSharedCallRoutingDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "CRC Skill",
    key: "crcSkill",
    control: "input",
    valueGetter: (params: CctSharedCallRoutingDb) => `${params?.crcSkill || ""}`,
    valueSetter: (currentValue: CctSharedCallRoutingDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    }),
    dynamicFieldConditionCheck: (params?: FormValidationRule): boolean=>{
      return params["channel"]?.value === "Service" && params["brand"]?.value === "Liberty Mutual";
    }
  },
  {
    label: "Percent Of Callers",
    key: "percentOfCallers",
    control: "input",
    required: true,
    valueGetter: (params: CctSharedCallRoutingDb) => `${params?.percentOfCallers || ""}`,
    valueSetter: (currentValue: CctSharedCallRoutingDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Start Time - EST",
    key: "startTime",
    control: "timePicker",
    required: true,
    valueGetter: (params: CctSharedCallRoutingDb, defaultValue: any) => `${params?.startTime ? params.startTime : defaultValue}`,
    valueSetter: (currentValue: CctSharedCallRoutingDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "End Time",
    key: "endTime",
    control: "timePicker",
    required: true,
    valueGetter: (params: CctSharedCallRoutingDb, defaultValue: any) => `${params?.endTime ? params.endTime : defaultValue}`,
    valueSetter: (currentValue: CctSharedCallRoutingDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Policy Type",
    key: "policyType",
    control: "select",
    required: true,
    disableEdit: true,
    valueGetter: (params: CctSharedCallRoutingDb) => `${params?.policyType || ""}`,
    valueSetter: (currentValue: CctSharedCallRoutingDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Transfer Message",
    key: "transferMessage",
    control: "input",
    valueGetter: (params: CctSharedCallRoutingDb) => `${params?.transferMessage || ""}`,
    valueSetter: (currentValue: CctSharedCallRoutingDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Priority",
    key: "priority",
    control: "select",
    isBlankFirstValue: true,
    valueGetter: (params: CctSharedCallRoutingDb) => `${params?.priority || ""}`,
    valueSetter: (currentValue: CctSharedCallRoutingDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Occupancy Check",
    key: "occupancyCheck",
    control: "multiField",
    valueGetter: (params: CctSharedCallRoutingDb) => params?.occupancyCheck || [],
    valueSetter: (currentValue: CctSharedCallRoutingDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    }),
    formFields: [
      {
        label: "Team",
        name: "team",
        type: "text"
      },
      {
        label: "Percentage (%)",
        name: "percentage",
        type: "number",
        helperText: "min: 1,  max: 100"
      }
    ]
  },
  {
    label: "Routing Steps",
    key: "routingSteps",
    control: "multiField",
    valueGetter: (params: CctSharedCallRoutingDb) => params?.routingSteps || [],
    valueSetter: (currentValue: CctSharedCallRoutingDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    }),
    formFields: [
      {
        label: "Teams",
        name: "teams",
        type: "multiValueText",
        helperText: "Please use Enter to add team"
      },
      {
        label: "Time",
        name: "time",
        type: "number",
        helperText: "min: 1,  max: 100"
      },
      {
        label: "Caller State",
        name: "callerState",
        type: "select",
        helperText: "Caller's State or Overflow (OF)"
      }
    ]
  },
  {
    label: "Alternate Transfer Destination",
    key: "alternateTransferDestination",
    control: "input",
    valueGetter: (params: CctSharedCallRoutingDb) => `${params?.alternateTransferDestination || ""}`,
    valueSetter: (currentValue: CctSharedCallRoutingDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }
];



export const routingInitRule: FormValidationRule = routingFields.reduce((a: FormValidationRule, v: AddRoutingFieldConfigProps) => ({
  ...a,
  [v.key]: {
    error: false,
    value: "",
    required: v.required || false
  }
}), {});

export const convertTime12to24 = (time12h: string): string => {
  const [time, modifier] = time12h.split(" ");
  const timeSplit: string[] = time.split(":");
  timeSplit[0] = timeSplit[0].padStart(2, "0");
  if (timeSplit[0] === "12") {
    timeSplit[0] = "00";
  }
  if (modifier === "PM") {
    timeSplit[0] = (parseInt(timeSplit[0], 10) + 12).toString();
  }
  const todayDate = new Date().toISOString().split("T")[0];
  const hmsTime = `${timeSplit[0]}:${timeSplit[1]}:${timeSplit[2] || "00"}`;
  const targetStartTime: Date = new Date(`${todayDate}T${hmsTime}`);
    return targetStartTime.toISOString();
};

export const convertTime24to12 = (time24h: string): string =>{
  const time = new Date(time24h);
  let hours:number = time.getHours();
  let minutes:string = time.getMinutes().toString();
  let seconds: string = time.getSeconds().toString();
  let ampm = "AM";
  if (hours === 12) {
    ampm = "PM";
  } else if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
    ampm = "PM";
  }
  minutes = minutes.padStart(2, "0");
  seconds = seconds.padStart(2, "0");
  return `${hours}:${minutes}:${seconds} ${ampm}`;
};