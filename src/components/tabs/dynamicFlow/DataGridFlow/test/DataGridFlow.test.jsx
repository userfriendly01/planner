jest.mock("@mui/x-data-grid",()=>({
  __esModule: true,
  DataGrid: jest.fn(),
  GridToolbar: jest.fn(),
  GridRenderCellParams: jest.fn(),
  useGridApiRef: jest.fn().mockReturnValue({
    current: {
      setRowSelectionModel: jest.fn().mockReturnValue({
        failure: [],
        success: [],
        flag: false
      })
    }
  })
}));

jest.mock("components", ()=>({
  __esModule: true,
  CustomToast: jest.fn()
}));

jest.mock("../../CustomActions", () => ({
  __esModule: true,
  AdvanceSearchModal: jest.fn()
}));

jest.mock("context", () => ({
  useAdminState: jest.fn()
}));

jest.mock("../../PreviewModal", ()=>({
  __esModule: true,
  PreviewModal: jest.fn()
}));

describe("<DataGridFlow />", () => {

  describe("Data Table Footer", ()=>{
    it("should equal 1", () => {
      expect(1).toBeTruthy();
    });
  });

  describe("Different Data Load", ()=>{
  });
});

