import * as XLSX from "xlsx";
import {
  CsvReader,
  validateActionRow
} from "../CsvReader";

jest.mock("xlsx",() => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn()
  }
}));

describe("CSV reader component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  const mockSetUploadedForm = jest.fn();
  const readAsArrayBufferMock = jest.fn();
  test("if no e.target.files, does nothing", () => {
    const event = {
      target: {
        nope: "no"
      },
      preventDefault: jest.fn()
    };
    jest.spyOn(window, "FileReader").mockImplementation(function () {
      const self = this;
      this.readAsArrayBuffer = readAsArrayBufferMock.mockImplementation(() => {
        self.onload(event);
      });
    });
    CsvReader(event, mockSetUploadedForm, "FLOW");
    expect(event.preventDefault).toBeCalledTimes(1);
    expect(readAsArrayBufferMock).toBeCalledTimes(0);
    expect(mockSetUploadedForm).toBeCalledTimes(0);
  });
  test("e.target files to be callflow", () => {
    const sheetData =  [{
      dataRequests: "clasisfy",
      pkey: "12341234",
      callIntent: "testIntent",
      callerType: "testType",
      greetingMessages: null,
      id: null,
      officeNumbers: "1,2,3",
      predictiveCaller: true,
      selfServiceIndicator: true
    }];
    XLSX.read.mockReturnValue({
      SheetNames: ["thing1"],
      Sheets: {
        thing1: {
          boo: {
            dataRequests: "clasisfy",
            pkey: "12341234"
          }
        }
      }
    });
    XLSX.utils.sheet_to_json.mockReturnValue(sheetData);
    const mockFile ={
      name: "call-flow-123.csv",
      data: ["yoo"]
    };

    const event = {
      target: {
        files: [mockFile],
        result: {
          SheetNames: ["stuff"],
          Sheets: {
            stuff: sheetData
          }
        }
      },
      preventDefault: jest.fn()
    };
    jest.spyOn(window, "FileReader").mockImplementation(function () {
      const self = this;
      this.readAsArrayBuffer = readAsArrayBufferMock.mockImplementation(() => {
        self.onload(event);
      });
    });
    CsvReader(event, mockSetUploadedForm, "FLOW");

    expect(event.preventDefault).toBeCalledTimes(1);
    expect(readAsArrayBufferMock).toBeCalledTimes(1);
    expect(readAsArrayBufferMock).toBeCalledWith(mockFile);
    expect(mockSetUploadedForm).toBeCalledTimes(1);
  });
  test("if e.target.files, it reads the ROUTING file and sets uploaded form", () => {
    const sheetData = [{
      boo: "hi",
      "__rowNum__": 1,
      occupancyCheck: "",
      routingSteps: ""
    }];
    XLSX.read.mockReturnValue({
      SheetNames: ["thing1"],
      Sheets: {
        thing1: {
          boo: "hi",
          occupancyCheck: [],
          routingSteps: []
        }
      }
    });
    XLSX.utils.sheet_to_json.mockReturnValue(sheetData);
    const mockFile = new File(["yo"], "yo.xlsx");

    const event = {
      target: {
        files: [mockFile],
        result: {
          SheetNames: ["stuff"],
          Sheets: {
            stuff: sheetData
          }
        }
      },
      preventDefault: jest.fn()
    };
    jest.spyOn(window, "FileReader").mockImplementation(function () {
      const self = this;
      this.readAsArrayBuffer = readAsArrayBufferMock.mockImplementation(() => {
        self.onload(event);
      });
    });
    CsvReader(event, mockSetUploadedForm, "ROUTING");
    expect(event.preventDefault).toBeCalledTimes(1);
    expect(readAsArrayBufferMock).toBeCalledTimes(1);
    expect(readAsArrayBufferMock).toBeCalledWith(mockFile);
    expect(mockSetUploadedForm).toBeCalledTimes(1);

  });
  test("if e.target.files, it reads the DYNFLOW file and sets uploaded form", () => {
    const sheetData = [{
      actionId: "1",
      actionType: "ANNOUNCEMENT",
      callFlowName: "MYFlow",
      id: "id1",
      options: "[{\"option\": \"one\"}]",
      repeat: "{\"a\": \"b\"}",
      routingSteps: ""
    },{
      actionId: "2",
      actionType: "ANNOUNCEMENT",
      callFlowName: "MYFlow",
      id: "id1",
      routingSteps: ""
    }];
    XLSX.read.mockReturnValue({
      SheetNames: ["thing1"],
      Sheets: {
        thing1: {
          actionId: "1",
          actionType: "ANNOUNCEMENT",
          callFlowName: "MYFlow",
          id: "id2",
          options: "",
          repeat: "",
          routingSteps: ""
        }
      }
    });
    XLSX.utils.sheet_to_json.mockReturnValue(sheetData);
    const mockFile = new File(["yo"], "yo.xlsx");

    const event = {
      target: {
        files: [mockFile],
        result: {
          SheetNames: ["stuff"],
          Sheets: {
            stuff: sheetData
          }
        }
      },
      preventDefault: jest.fn()
    };
    jest.spyOn(window, "FileReader").mockImplementation(function () {
      const self = this;
      this.readAsArrayBuffer = readAsArrayBufferMock.mockImplementation(() => {
        self.onload(event);
      });
    });
    CsvReader(event, mockSetUploadedForm, "DYNFLOW");
    expect(event.preventDefault).toBeCalledTimes(1);
    expect(readAsArrayBufferMock).toBeCalledTimes(1);
    expect(readAsArrayBufferMock).toBeCalledWith(mockFile);
    expect(mockSetUploadedForm).toBeCalledTimes(1);

  });
});

describe("validateActionRow", () => {
  describe("common", () => {
    const menuRow = {
      actionId: "X",
      actionType: "MENU",
      callFlowName: "MyCallFlow",
      speech: "Main menu, please choose one of the following"
    };
    describe("success", () => {
      expect(validateActionRow(menuRow)).toEqual("");
    });
    describe("fail", () => {
      expect(validateActionRow( {
        ...menuRow,
        actionId: ""
      })).toEqual("* Field actionId is required.");
      expect(validateActionRow( {
        ...menuRow,
        actionType: ""
      })).toEqual("* Field actionType is required.  * Field actionType must be one of MENU, MENUOPTIONS, ANNOUNCEMENT");
      expect(validateActionRow( {
        ...menuRow,
        actionType: "TRANSFER"
      })).toEqual("* Field actionType must be one of MENU, MENUOPTIONS, ANNOUNCEMENT");
      expect(validateActionRow( {
        ...menuRow,
        callFlowName: ""
      })).toEqual("* Field callFlowName is required.");
    });
  });
  describe("menu", () => {
    const menuRow = {
      actionId: "X",
      actionType: "MENU",
      callFlowName: "MyCallFlow",
      speech: "Main menu, please choose one of the following"
    };
    describe("success", () => {
      expect(validateActionRow(menuRow)).toEqual("");
    });
    describe("fail", () => {

      expect(validateActionRow( {
        ...menuRow,
        speech: ""
      })).toEqual("* Field speech is required.");
    });
  });
  describe("announcement", () => {
    const announcement = {
      actionId: "XZ",
      actionType: "ANNOUNCEMENT",
      callFlowName: "MyCallFlow",
      speech: "Hello there!"
    };
    describe("success", () => {
      expect(validateActionRow(announcement)).toEqual("");
    });
    describe("fail", () => {

      expect(validateActionRow( {
        ...announcement,
        speech: ""
      })).toEqual("* Field speech is required.");
    });
  });
  describe("menuoptions", () => {
    const menuOptions = {
      actionId: "XZ",
      actionType: "MENUOPTIONS",
      callFlowName: "MyCallFlow",
      options: [{
        first: "option"
      }]
    };
    describe("success", () => {
      expect(validateActionRow(menuOptions)).toEqual("");
    });
    describe("fail", () => {

      expect(validateActionRow( {
        ...menuOptions,
        options: ""
      })).toEqual("* Field options is required.");
    });
  });
});