import {
  deleteDirectory,
  insertDirectory,
  updateDirectory
} from "../directory";
import MockAdapter from "axios-mock-adapter";
import { apiPaths } from "globals";
import { myAxios } from "utils";

jest.mock("globals", () => ({
  __esModule: true,
  apiPaths: {
    DIRECTORY: jest.fn(),
    DIRECTORY_ENTRY: jest.fn()
  }
}));

const axiosMock = new MockAdapter(myAxios);

describe("directory", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
  });

  describe("deleteDirectory", () => {
    const directoryId = 48;
    const deleteRes = { result: "bye bye" };
    beforeEach(() => {
      axiosMock.onDelete("/service/directory/48").reply(200, deleteRes);
      apiPaths.DIRECTORY_ENTRY("/service/directory/48");
    });
    test("should resolve with formatted data", done => {
      deleteDirectory(directoryId).then(resolvedVal => {
        expect(axiosMock.history.delete[0].url).toBe("/service/directory/48");
        expect(resolvedVal).toEqual(deleteRes);
        done();
      });
    });
  });
});