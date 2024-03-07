"use strict";
exports.__esModule = true;
exports.CustomFlowGridToolBar = void 0;
var material_1 = require("@mui/material");
var react_1 = require("react");
var utils_1 = require("utils");
var icons_material_1 = require("@mui/icons-material");
var context_1 = require("context");
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
var CustomFlowGridToolBar = function (_a) {
    var matchedGroups = _a.matchedGroups, openPreviewModal = _a.openPreviewModal;
    var env = (0, context_1.useAdminState)().userContext.pingIdentity.environment;
    var enableFlow = (0, react_1.useMemo)(function () { return (0, utils_1.readWriteAccess)(matchedGroups, "aloha-flow", env); }, []);
    var handleChange = function (event) {
        var value = event.target.value;
        switch (value) {
            case "bulkAddFlow":
                openPreviewModal(true, "add");
                break;
            default:
                break;
        }
    };
    return (<material_1.Grid container>
      <material_1.Grid item key="flow-action-box" xs={2}>
        <material_1.FormControl sx={{
            marginTop: "16px",
            marginBottom: "8px",
            marginLeft: "calc(40%)"
        }}>
          <material_1.InputLabel>Actions</material_1.InputLabel>
          <material_1.Select inputProps={{
            sx: {
                width: 120
            }
        }} label="Actions" value="" disabled={enableFlow} onChange={handleChange} variant="filled" size="small" displayEmpty>
            <material_1.MenuItem key="bulkAddFlow" value="bulkAddFlow">
              <icons_material_1.PlaylistAdd />&nbsp;&nbsp; Multi Add Flow
            </material_1.MenuItem>
          </material_1.Select>
        </material_1.FormControl>
      </material_1.Grid>
    </material_1.Grid>);
};
exports.CustomFlowGridToolBar = CustomFlowGridToolBar;
