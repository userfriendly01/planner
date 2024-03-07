"use strict";
exports.__esModule = true;
var react_1 = require("react");
var AzureAuth_1 = require("../../core/AzureAuth");
var DataGridFlow_1 = require("./DataGridFlow/DataGridFlow");
var DynamicFlowContainer = function (props) {
    var accessToken = props.accessToken, matchedGroups = props.matchedGroups;
    return (<DataGridFlow_1["default"] accessToken={accessToken} matchedGroups={matchedGroups}/>);
};
exports["default"] = (0, AzureAuth_1.authWrapper)(DynamicFlowContainer);
