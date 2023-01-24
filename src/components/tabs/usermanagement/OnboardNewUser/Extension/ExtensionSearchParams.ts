// This module returns a function that returns a structure, rather 
// than simply returning a structure.  This is done so that this module
// can be mocked for unit testing.
const data: any = {
  MinExtensionNum: 10000,
  ExtensionNumRange: 89995,
  MaxRetries: 5,
  ReservedExtensions: []
};

export const SearchParams = {
  getValues: () => data
};
