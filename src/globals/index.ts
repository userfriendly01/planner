import {
  ModalOverlayStatuses,
  FormModes
} from "globals";

const CONTACT_MANAGER_BASE_URI = "/contact-manager";
const SERVICE_BASE_URI = "/service";

export * from "./interfaces";
export * from "./theme";
export * from "./styles";

export const nNumMatcher = /[n,N]\d{7}/g;
export const extensionMatcher = /^\d{4,5}$/;
export const workersPerPage = 15;

export const modalOverlayStatuses: ModalOverlayStatuses = {
  FAIL: "fail",
  SAVING: "saving",
  SUCCESS: "success"
};

export const formModes: FormModes = {
  INSERT: "insert",
  UPDATE: "update"
};

export const timeouts = {
  AUTH: 3600 * 1000,
  MODAL_OVERLAY: 2000
};

export const resetResponses = {
  SKILLS_WERE_EQUAL: "Worker default_skills is equal to currently assigned skills"
};

export const apiPaths = {
  AUTH: `${SERVICE_BASE_URI}/admin-login`,
  CHECK_EXTENSION: `${SERVICE_BASE_URI}/checkextension`,
  CLOSED_MESSAGE: `${SERVICE_BASE_URI}/closedmessage`,
  CREATE_WORKER: `${SERVICE_BASE_URI}/createworker`,
  DELETE_WORKER: (workerSid: string): string => `${SERVICE_BASE_URI}/deleteworker/${workerSid}`,
  DIAL_LIST: `${CONTACT_MANAGER_BASE_URI}/diallist`,
  DIAL_LIST_ENTRY: (dialListId: number): string => `${CONTACT_MANAGER_BASE_URI}/diallist/${dialListId}`,
  DIRECTORY: `${CONTACT_MANAGER_BASE_URI}/directory`,
  DIRECTORY_ENTRY: (directoryId: string | number): string => `${CONTACT_MANAGER_BASE_URI}/directory/${directoryId}`,
  EMPLOYEE_LOOKUP: (nNumber: string): string => `${SERVICE_BASE_URI}/employeelookup/${nNumber}`,
  FLASH_MESSAGE: `${SERVICE_BASE_URI}/flashmessage`,
  GET_PROFILE_DATA: (profileId: string | number): string => `${CONTACT_MANAGER_BASE_URI}/triton/${profileId}`,
  GET_PROFILES: `${CONTACT_MANAGER_BASE_URI}/profiles`,
  GET_TASKROUTER_SKILLS: `${SERVICE_BASE_URI}/taskrouterskills`,
  GET_WORKERS: `${SERVICE_BASE_URI}/workers`,
  MANAGERS: `${CONTACT_MANAGER_BASE_URI}/managers`,
  OFFICES: `${CONTACT_MANAGER_BASE_URI}/offices`,
  RESET_WORKER_SKILLS: `${SERVICE_BASE_URI}/resetworkerskills`,
  UPDATE_WORKER: (workerSid: string): string => `${SERVICE_BASE_URI}/updateworker/${workerSid}`
};

export const profileConfigs = {
  PROFILE_SKILL_MAP: [
    {
      "profileId": 0,
      "skills": ["466", "aisgConsumer", "aisgEcliq", "aisgL1", "aisgPassword", "blSalesAmazonQuote", "blSalesAmazonTriage", "blSalesL1", "blSalesLargePolicy",
        "bookxferAgentSupp", "bookxferGeicoSupp", "bscAgencyBill", "bscBlSafeco", "bscCbs", "bscCbsHelpDesk", "bscCertainly", "bscCommissions", "bscCOVID19",
        "bscLnwL1", "bscLnwOnlineReporting", "bscMajescoHelpDesk", "bscMajescoL1", "bscOcgPl", "bscPls", "bscSafecoHelpDesk", "bscYwpL1", "ccAuxMisc87",
        "ccAuxPAL88", "ccAuxWC89", "ccBLAGLFNOLSP29", "ccBLDefaultSP46", "ccBLPFNOLSP30", "ccBLStatusSP31", "ccCaMAA61", "ccComcastConcierge36",
        "ccCovid93", "ccDisability32", "ccGeneralSkill12", "ccGeneralSkillSP19", "ccGMDisSP33", "ccGMIdmSP35", "ccGrmBLAGLFNOL26", "ccGrmBLDefault44",
        "ccGrmBLPFNOL27", "ccGrmBLStatus28", "ccGrmSuperAssist69", "ccGroupInqSP37", "ccIDM34", "ccIronHealth78", "ccLyft96", "ccNASInquiry97", "ccNASPropertyCAT98",
        "ccNationalAL22", "ccNationalALSP23", "ccNationalInq24", "ccNationalInqSP25", "ccNationalWC20", "ccNationalWCSP21", "ccPALInquiry82", "ccPALInquirySP84",
        "ccPortalSP54", "ccPortalSupport53", "ccRoutetoAux80", "ccSharedAGLFNOL38", "ccSharedAGLFNOLSP41", "ccSharedDefault45", "ccSharedDefaultSP47",
        "ccSharedPFNOL39", "ccSharedPFNOLSP42", "ccSharedStatus40", "ccSharedStatusSP43", "ccSuperAssist63", "ccUber92", "ccUpsGL58", "ccUPSInquiry57",
        "ccWCInquiry81", "ccWCInquirySP83", "csoBilling", "csoPortal", "csoService", "grscollections-l1", "lscAgentSales", "lscBookTransfer", "lscDirectSales",
        "lscHomeInsDotCom", "lscMass", "lscOBDialer1", "lscPriorityAgent", "lscPriorityCampaigns", "lscUSAA", "overflowBLAPD", "overflowGrsCasualty",
        "overflowNAS", "overflowNFSIU", "overflowPropertyMarine", "overflowSSCCST", "overflowSSCS", "overflowSSLRU", "overflowWC", "palL1"]
    },
    {
      "profileId": 1,
      "skills": ["466"]
    },
    {
      "profileId": 2,
      "skills": ["psu-l1", "psu-l2", "psu-um"]
    },
    {
      "profileId": 3,
      "skills": ["blSalesL1", "blSalesAmazonQuote", "blSalesAmazonTriage"]
    },
    {
      "profileId": 4,
      "skills": ["aisgL1", "aisgConsumer", "aisgEcliq", "aisgPassword"]
    },
    {
      "profileId": 5,
      "skills": ["premaudit-l1"]
    },
    {
      "profileId": 6,
      "skills": ["grscollections-l1"]
    },
    {
      "profileId": 7,
      "skills": ["csoService", "csoBilling", "csoPortal"]
    },
    {
      "profileId": 8,
      "skills": ["sbscCertificates", "sbscFarm", "sbscPolicy", "sbscPreferred", "sbscSafeco", "sbscPolicyCopies"]
    },
    {
      "profileId": 9,
      "skills": ["palL1"]
    },
    {
      "profileId": 10,
      "skills": ["bscCbs", "bscCbsL2", "bscCbsHelpDesk", "bscAgencyBill", "bscCommissions", "bscMajescoL1", "bscMajescoHelpDesk", "bscBlSafeco",
        "bscSafecoHelpDesk", "bscLnwL1", "bscPls", "bscLnwOnlineReporting", "bscOcgPl", "bscYwpL1", "bscCOVID19", "bscCertainly"]
    },
    {
      "profileId": 11,
      "skills": ["ccGeneralSkill12", "ccGeneralSkillSP19", "ccNationalWC20", "ccNationalWCSP21", "ccNationalAL22", "ccNationalALSP23", "ccNationalInq24",
        "ccNationalInqSP25",  "ccDisability32", "ccGMDisSP33", "ccIDM34", "ccGMIdmSP35",  "ccComcastConcierge36", "ccGroupInqSP37", "ccSharedAGLFNOL38",
        "ccSharedPFNOL39", "ccSharedStatus40", "ccSharedAGLFNOLSP41", "ccSharedPFNOLSP42","ccSharedStatusSP43", "ccSharedDefault45", "ccSharedDefaultSP47",
        "ccAgencyMarkets48", "ccPortalSupport53","ccPortalSP54","ccUPSInquiry57", "ccUpsGL58", "ccCaMAA61", "ccCatTEAM62", "ccSuperAssist63",
        "ccDefaultCC76","ccIronHealth78", "ccWCInquiry81","ccPALInquiry82", "ccWCInquirySP83", "ccPALInquirySP84","ccAuxMisc87","ccAuxPAL88",
        "ccAuxWC89", "ccUber92","ccCovid93","ccLyft96", "ccNASInquiry97", "ccNASPropertyCAT98"]
    }
  ]
};