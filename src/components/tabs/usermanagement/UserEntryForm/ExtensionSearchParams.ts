// This module returns a function that returns a structure, rather 
// than simply returning a structure.  This is done so that this module
// can be mocked for unit testing.
const data = {
  MinExtensionNum: 10000,
  ExtensionNumRange: 89995,
  MaxRetries: 5,
  ReservedExtensions: [
    13378, 13379, 13380, 13381, 13382, 15729, 16235, 19204, 19206, 19207,
    19208, 19209, 19210, 19211, 19212, 19213, 19214, 19215, 19216, 19217,
    19222, 19224, 19225, 19226, 19227, 19230, 19235, 19236, 19237, 19238,
    19239, 19241, 19243, 19282, 19284, 19285, 19294, 23344, 23381, 26881,
    26944, 29231, 29244, 44375, 48174, 48176, 48178, 48180, 48181, 48182,
    48184, 48185, 48188, 48191, 48193, 48443, 52278, 52279, 52280, 52281,
    52282, 52286, 52287, 54253, 56381, 76137, 76139, 76141, 87687
  ]
};

export const SearchParams = {
  getValues: () => data
};
