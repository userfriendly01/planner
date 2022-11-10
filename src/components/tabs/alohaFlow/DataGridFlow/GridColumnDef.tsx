const GridColumnDef = [
  {
    name: 'Dialed#',
    selector: (row:any) => row.pkey,
    sortable: true,
  },
  {
    name: 'Description',
    selector: (row:any) => row.dialedDescription,
    sortable: true,
    reorder: true,
  },
  {
    name: 'Template',
    selector: (row:any) => row.callFlowTemplate,
    sortable: true,
    reorder: true,
  },
  {
    name: 'Channel',
    selector: (row:any) => row.channel,
    sortable: true,
    reorder: true,
  },
  {
    name: 'Brand',
    selector: (row:any) => row.brand,
    sortable: true,
    reorder: true,
  },
  {
    name: 'Language Offer',
    selector: (row:any) => row.content?.languageOffer,
    sortable: true,
    reorder: true,
  },
  {
    name: 'Data Requests',
    selector: (row:any) => {
      if (row.content?.dataRequests) {
        return row.content?.dataRequests?.join(',');
      }

      return '';
    },
    sortable: true,
    reorder: true,
  },
  {
    name: 'Caller Type',
    selector: (row:any) => row.content?.callerType,
    sortable: true,
    reorder: true,
    grow: 2,
  },
  {
    name: 'Transfer#',
    selector: (row:any) => row.content?.transferNumber,
    sortable: true,
    reorder: true,
  },
  {
    name: 'Route',
    selector: (row:any) => row.content?.callFlowRoute,
    sortable: true,
    reorder: true,
    grow: 2,
  },
  {
    name: 'Greeting',
    selector: (row:any) => row.content?.greetingMessages,
    sortable: true,
    reorder: true,
  },
  {
    name: 'Agent ID',
    selector: (row:any) => row.agentId,
    sortable: true,
    reorder: true,
  },
  {
    name: 'Employee ID',
    selector: (row:any) => row.employeeId,
    sortable: false,
    reorder: true,
    grow: 3,
  },
  {
    name: 'Create Time',
    selector: (row:any) => row.createTime,
    sortable: false,
    reorder: true,
    grow: 3,
  },
  {
    name: 'User Destination',
    selector: (row:any) => row.userDestination,
    sortable: true,
    reorder: true,
  },
];

export default GridColumnDef;
