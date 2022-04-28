import { calabrioGroupLevels } from "globals";
import { CalabrioGroup } from "../components/usermanagement/CallRecording/CallRecording.Interfaces";

export const formatCalabrioTenant = (groupsArray: CalabrioGroup[]): CalabrioGroup => {
  const tenants: CalabrioGroup[] = groupsArray.filter((group: CalabrioGroup) => group.groupLevel === calabrioGroupLevels.TENANT);
  if(tenants.length > 1){
    console.warn("Multiple Tenants found for Calabrio! This is unexpected and may require code changes for the scope component in the Call Recording Folder");
  }
  return tenants[0];
};

export const formatCalabrioTeams = (groupsArray: CalabrioGroup[]): CalabrioGroup[] => {
  const teams =  groupsArray.filter((group: CalabrioGroup) => group.groupLevel === calabrioGroupLevels.TEAM);
  return teams.map(team => {
    return {
      ...team,
      checked: false
    };
  });
};

export const formatCalabrioGroups = (groupsArray: CalabrioGroup[]): CalabrioGroup[] => {
  const groups = groupsArray.filter((group: CalabrioGroup) => group.groupLevel === calabrioGroupLevels.GROUP);
  return groups.map(group => {
    return {
      ...group,
      partial: false,
      checked: false
    };
  });
};

export const formatCalabrioUsers = (groupsArray: CalabrioGroup[]): any[] => {
  const users: any[] = [];
  groupsArray.forEach((group: CalabrioGroup) => {
    if(group.agents){
      group.agents.forEach(agent => {
        users.push(agent);
      });
    }
  });
  return users;
};

/*
[
    {
        "groupId": 208,
        "name": "LibertyMutual",
        "displayId": null,
        "parentGroupId": 0,
        "parentGroupName": null,
        "groupLevel": "TENANT"
    },
    {
        "groupId": 209,
        "name": "Default Group",
        "displayId": null,
        "parentGroupId": 208,
        "parentGroupName": "LibertyMutual",
        "groupLevel": "GROUP"
    },
    {
        "groupId": 225,
        "name": "Default Team",
        "displayId": null,
        "parentGroupId": 209,
        "parentGroupName": "Default Group",
        "groupLevel": "TEAM",
        "agents": [
            {
                "personId": 103,
                "firstName": "Network",
                "lastName": "Testing",
                "groupId": 225,
                "tenantId": 208,
                "email": "net.test@libertymutual.com",
                "skillId": "n02354654",
                "timeZone": 173
            },
            {
                "personId": 24,
                "firstName": "Randy",
                "lastName": "Seperich",
                "groupId": 225,
                "tenantId": 208,
                "email": "randy.seperich@libertymutual.com",
                "skillId": "randy.seperich@libertymutual.com",
                "timeZone": 99
            },
            {
                "personId": 53,
                "firstName": "Paolo",
                "lastName": "Manalo",
                "groupId": 225,
                "tenantId": 208,
                "email": "Paolo.Manalo@libertymutual.com",
                "skillId": "n0318970",
                "timeZone": 151,
                "adLogin": "Paolo.Manalo@libertymutual.com"
            },
            {
                "personId": 102,
                "firstName": "Faith",
                "lastName": "Cuneo",
                "groupId": 225,
                "tenantId": 208,
                "email": "bubbles@libertymutual.com",
                "skillId": "n0002222",
                "timeZone": 173
            },
            {
                "personId": 84,
                "firstName": "Gurpreet",
                "lastName": "Singh",
                "groupId": 225,
                "tenantId": 208,
                "email": "gurpreet.singh01@libertymutual.com",
                "skillId": "n1525939",
                "timeZone": 173,
                "adLogin": "lm\\n1525939"
            },
            {
                "personId": 75,
                "firstName": "Zachary",
                "lastName": "Schmidt",
                "groupId": 225,
                "tenantId": 208,
                "email": "Zachary.Schmidt@LibertyMutual.com",
                "skillId": "n0217643",
                "timeZone": 173,
                "adLogin": "LM\\n0217643"
            },
            {
                "personId": 61,
                "firstName": "Joseph",
                "lastName": "Ebert",
                "groupId": 225,
                "tenantId": 208,
                "email": "Joseph.Ebert@LibertyMutual.com",
                "skillId": "n0251975",
                "timeZone": 99,
                "adLogin": "Joseph.Ebert@LibertyMutual.com"
            },
            {
                "personId": 87,
                "firstName": "Don",
                "lastName": "Sutton",
                "groupId": 225,
                "tenantId": 208,
                "email": "don.sutton@libertymutual.com",
                "skillId": "n1515160",
                "timeZone": 173,
                "adLogin": "lm\\n1515160"
            },
            {
                "personId": 32,
                "firstName": "Kyle",
                "lastName": "Libby",
                "groupId": 225,
                "tenantId": 208,
                "email": "Kyle.Libby@LibertyMutual.com",
                "skillId": "n0269913",
                "timeZone": 173,
                "adLogin": "Kyle.Libby@LibertyMutual.com"
            },
            {
                "personId": 38,
                "firstName": "Derek",
                "lastName": "Rydin",
                "groupId": 225,
                "tenantId": 208,
                "email": "Derek.Rydin@LibertyMutual.com",
                "skillId": "n0194977",
                "timeZone": 173,
                "adLogin": "LM\\n0194977"
            },
            {
                "personId": 72,
                "firstName": "Jacob",
                "lastName": "Radke",
                "groupId": 225,
                "tenantId": 208,
                "email": "jacob.radke@libertymutual.com",
                "skillId": "n0183277",
                "timeZone": 151,
                "adLogin": "lm\\n0183277"
            },
            {
                "personId": 64,
                "firstName": "Thomas",
                "lastName": "Tseng",
                "groupId": 225,
                "tenantId": 208,
                "email": "Thomas.Tseng@libertymutual.com",
                "skillId": "n0317496",
                "timeZone": 151,
                "adLogin": "Thomas.Tseng@libertymutual.com"
            },
            {
                "personId": 26,
                "firstName": "Steve",
                "lastName": "Bi",
                "groupId": 225,
                "tenantId": 208,
                "email": "Steve.Bi@LibertyMutual.com",
                "skillId": "n0179822",
                "timeZone": 151,
                "adLogin": "Steve.Bi@LibertyMutual.com"
            },
            {
                "personId": 25,
                "firstName": "Bill",
                "lastName": "Lumbergh",
                "groupId": 225,
                "tenantId": 208,
                "email": "bill.lumbergh@libertymutual.com",
                "skillId": "bill.lumbergh@libertymutual.com",
                "timeZone": 99
            },
            {
                "personId": 60,
                "firstName": "Jan",
                "lastName": "Gentille",
                "groupId": 225,
                "tenantId": 208,
                "email": "Jan.Gentille@LibertyMutual.com",
                "skillId": "n0111557",
                "timeZone": 173,
                "adLogin": "Jan.Gentille@LibertyMutual.com"
            },
            {
                "personId": 40,
                "firstName": "Rebecca",
                "lastName": "Miller",
                "groupId": 225,
                "tenantId": 208,
                "email": "rebecca.miller@libertymutual.com",
                "skillId": "n0116796",
                "timeZone": 173,
                "adLogin": "LM\\n0116796"
            },
            {
                "personId": 62,
                "firstName": "Kristen",
                "lastName": "Tsakiris",
                "groupId": 225,
                "tenantId": 208,
                "email": "Kristen.J.Tsakiris@LibertyMutual.com",
                "skillId": "n0050114",
                "timeZone": 173,
                "adLogin": "Kristen.J.Tsakiris@LibertyMutual.com"
            },
            {
                "personId": 58,
                "firstName": "Benjamin",
                "lastName": "Redman",
                "groupId": 225,
                "tenantId": 208,
                "email": "Benjamin.Redman@LibertyMutual.com",
                "skillId": "n0156733",
                "timeZone": 173,
                "adLogin": "Benjamin.Redman@LibertyMutual.com"
            },
            {
                "personId": 7,
                "firstName": "Dana",
                "lastName": "Doolittle",
                "groupId": 225,
                "tenantId": 208,
                "email": "dana.doolittle@libertymutual.com",
                "skillId": "n0175024",
                "timeZone": 173
            },
            {
                "personId": 30,
                "firstName": "Kenneth",
                "lastName": "Sicard",
                "groupId": 225,
                "tenantId": 208,
                "email": "Kenneth.Sicard@LibertyMutual.com",
                "skillId": "n0147198",
                "timeZone": 173,
                "adLogin": "Kenneth.Sicard@LibertyMutual.com"
            },
            {
                "personId": 63,
                "firstName": "Michael",
                "lastName": "Wilcox",
                "groupId": 225,
                "tenantId": 208,
                "email": "Michael.Wilcox@LibertyMutual.com",
                "skillId": "n0196231",
                "timeZone": 173,
                "adLogin": "Michael.Wilcox@LibertyMutual.com"
            },
            {
                "personId": 55,
                "firstName": "David",
                "lastName": "Klimaszewski",
                "groupId": 225,
                "tenantId": 208,
                "email": "david.klimaszewski@libertymutual.com",
                "skillId": "n0204972",
                "timeZone": 173,
                "adLogin": "david.klimaszewski@libertymutual.com"
            },
            {
                "personId": 23,
                "firstName": "David",
                "lastName": "Jones",
                "groupId": 225,
                "tenantId": 208,
                "email": "david.jones@libertymutual.com",
                "skillId": "david.jones@libertymutual.com",
                "timeZone": 99
            },
            {
                "personId": 74,
                "firstName": "Faith",
                "lastName": "Cuneo",
                "groupId": 225,
                "tenantId": 208,
                "email": "faith.cuneo@libertymutual.com",
                "skillId": "n0263786",
                "timeZone": 173,
                "adLogin": "LM\\n0263786"
            },
            {
                "personId": 56,
                "firstName": "Al",
                "lastName": "Leitao",
                "groupId": 225,
                "tenantId": 208,
                "email": "Al.Leitao@LibertyMutual.com",
                "skillId": "n0147313",
                "timeZone": 173,
                "adLogin": "Al.Leitao@LibertyMutual.com"
            },
            {
                "personId": 54,
                "firstName": "Michael",
                "lastName": "Nieman",
                "groupId": 225,
                "tenantId": 208,
                "email": "Michael.Nieman@LibertyMutual.com",
                "skillId": "n0274027",
                "timeZone": 173,
                "adLogin": "lm\\n0274027"
            },
            {
                "personId": 76,
                "firstName": "Patricia",
                "lastName": "Au",
                "groupId": 225,
                "tenantId": 208,
                "email": "patricia.au@libertymutual.com",
                "skillId": "n0311084",
                "timeZone": 173,
                "adLogin": "lm\\n0311084"
            },
            {
                "personId": 109,
                "firstName": "Aaron",
                "lastName": "Arsenault",
                "groupId": 225,
                "tenantId": 208,
                "email": "Aaron.Arsenault@libertymutual.com",
                "skillId": "n0304837",
                "timeZone": 173,
                "adLogin": "LM/n0304837"
            },
            {
                "personId": 59,
                "firstName": "Debjit",
                "lastName": "Dutta",
                "groupId": 225,
                "tenantId": 208,
                "email": "Debjit.Dutta@LibertyMutual.com",
                "skillId": "n0301580",
                "timeZone": 173,
                "adLogin": "Debjit.Dutta@LibertyMutual.com"
            },
            {
                "personId": 33,
                "firstName": "Krista",
                "lastName": "Officer",
                "groupId": 225,
                "tenantId": 208,
                "email": "Krista.Officer@LibertyMutual.com",
                "skillId": "n0203898",
                "timeZone": 173,
                "adLogin": "Krista.Officer@LibertyMutual.com"
            }
        ]
    },
    {
        "groupId": 210,
        "name": "Default Team2",
        "displayId": null,
        "parentGroupId": 209,
        "parentGroupName": "Default Group",
        "groupLevel": "TEAM",
        "agents": [
            {
                "personId": 98,
                "firstName": "",
                "lastName": "",
                "groupId": 210,
                "tenantId": 208,
                "skillId": "n0057256",
                "timeZone": 173
            },
            {
                "personId": 77,
                "firstName": "",
                "lastName": "",
                "groupId": 210,
                "tenantId": 208,
                "skillId": "n0146945",
                "timeZone": 173
            },
            {
                "personId": 78,
                "firstName": "Kimberly",
                "lastName": "Haynes",
                "groupId": 210,
                "tenantId": 208,
                "email": "kimberly.haynes@libertymutual.com",
                "skillId": "n0088625",
                "timeZone": 173
            },
            {
                "personId": 83,
                "firstName": "Nolan",
                "lastName": "Price",
                "groupId": 210,
                "tenantId": 208,
                "email": "nolan.price@libertymutual.com",
                "skillId": "n1511718",
                "timeZone": 173,
                "adLogin": "lm\\n1511718"
            },
            {
                "personId": 35,
                "firstName": "",
                "lastName": "",
                "groupId": 210,
                "tenantId": 208,
                "skillId": "unknown",
                "timeZone": 99
            },
            {
                "personId": 71,
                "firstName": "",
                "lastName": "",
                "groupId": 210,
                "tenantId": 208,
                "skillId": "n0274027?ConferenceSid=undefined",
                "timeZone": 99
            },
            {
                "personId": 81,
                "firstName": "",
                "lastName": "",
                "groupId": 210,
                "tenantId": 208,
                "skillId": "n0098916",
                "timeZone": 173
            },
            {
                "personId": 70,
                "firstName": "",
                "lastName": "",
                "groupId": 210,
                "tenantId": 208,
                "skillId": "n0274027?ConferenceSid=hardCodedConfSid",
                "timeZone": 99
            },
            {
                "personId": 68,
                "firstName": "",
                "lastName": "",
                "groupId": 210,
                "tenantId": 208,
                "skillId": "Read timed out",
                "timeZone": 99
            },
            {
                "personId": 69,
                "firstName": "",
                "lastName": "",
                "groupId": 210,
                "tenantId": 208,
                "skillId": "n0274027?ConferenceSid=HARDCODEDCONFERENCESID",
                "timeZone": 99
            },
            {
                "personId": 96,
                "firstName": "",
                "lastName": "",
                "groupId": 210,
                "tenantId": 208,
                "skillId": "undefined",
                "timeZone": 173
            },
            {
                "personId": 80,
                "firstName": "",
                "lastName": "",
                "groupId": 210,
                "tenantId": 208,
                "skillId": "n0179676",
                "timeZone": 173
            },
            {
                "personId": 97,
                "firstName": "",
                "lastName": "",
                "groupId": 210,
                "tenantId": 208,
                "skillId": "n1523256",
                "timeZone": 173
            },
            {
                "personId": 65,
                "firstName": "",
                "lastName": "",
                "groupId": 210,
                "tenantId": 208,
                "skillId": "n0111111",
                "timeZone": 99
            },
            {
                "personId": 82,
                "firstName": "",
                "lastName": "",
                "groupId": 210,
                "tenantId": 208,
                "skillId": "n0061043",
                "timeZone": 173
            },
            {
                "personId": 67,
                "firstName": "APIuserImPOC",
                "lastName": "NA",
                "groupId": 210,
                "tenantId": 208,
                "email": "apiuserlmpoc@libertymutual.com",
                "skillId": null,
                "timeZone": 173
            },
            {
                "personId": 79,
                "firstName": "",
                "lastName": "",
                "groupId": 210,
                "tenantId": 208,
                "skillId": "n0191080",
                "timeZone": 173
            },
            {
                "personId": 104,
                "firstName": "",
                "lastName": "",
                "groupId": 210,
                "tenantId": 208,
                "skillId": "n1545747",
                "timeZone": 173
            }
        ]
    }
]

*/