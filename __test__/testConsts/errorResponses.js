export const basicErrorOptions = [
  {
    message: "I'm a response"
  },
  {
    response: {
      status: 400,
      data: "I'm a response"
    }
  }
];
export const callFlowDBSQLError = {
  "error": "StatementCallback; SQL [DELETE FROM skill_t WHERE skill_nme = 'blSalesL1';]; Cannot delete or update a parent row: a foreign key constraint fails (`cicct_callflow`.`phone_num_t`, CONSTRAINT `fk_phone_num_skill` FOREIGN KEY (`default_skill`) REFERENCES `skill_t` (`skill_nme`)); nested exception is com.mysql.jdbc.exceptions.jdbc4.MySQLIntegrityConstraintViolationException: Cannot delete or update a parent row: a foreign key constraint fails (`cicct_callflow`.`phone_num_t`, CONSTRAINT `fk_phone_num_skill` FOREIGN KEY (`default_skill`) REFERENCES `skill_t` (`skill_nme`))"
};

export const apolloError = {
  "name": "ApolloError",
  "graphQLErrors": [
    {
      "path": [
        "user"
      ],
      "data": null,
      "errorType": "INTERNAL_SERVER_ERROR",
      "errorInfo": null,
      "locations": [
        {
          "line": 2,
          "column": 3,
          "sourceName": null
        }
      ],
      "message": "An error occurred while updating Twilio Worker. The requested resource /Workspaces/WSde21cfcdde7bcb69cd82f1c060e5dba0/Workers/WK0765478d43121836fcef3fa5b0effa4c was not found"
    }
  ],
  "protocolErrors": [],
  "clientErrors": [],
  "networkError": null,
  "message": "An error occurred while updating Twilio Worker. The requested resource /Workspaces/WSde21cfcdde7bcb69cd82f1c060e5dba0/Workers/WK0765478d43121836fcef3fa5b0effa4c was not found"
};

export const graphQlError = {
  "data": {
    "user": null
  },
  "errors": [
    {
      "path": [
        "user"
      ],
      "data": null,
      "errorType": "INTERNAL_SERVER_ERROR",
      "errorInfo": null,
      "locations": [
        {
          "line": 2,
          "column": 3,
          "sourceName": null
        }
      ],
      "message": "An error occurred while updating Twilio Worker. The requested resource /Workspaces/WSde21cfcdde7bcb69cd82f1c060e5dba0/Workers/WK0765478d43121836fcef3fa5b0effa4c was not found"
    }
  ]
};
