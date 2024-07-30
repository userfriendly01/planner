import ActionDataGridComponent from "dynamicCallFlowAction/DataGrid/Action.DataGrid.Component";
import React from "react";
import { DynamicCallFlowActionContext } from "dynamicCallFlowAction/DynamicCallFlow.Action.Container";
import { render } from "testUtils";
import { DynamicCallFlowADGroupPermission } from "dynamicCallFlowCommon/DynamicCallFlow.Authentication";
import { MODAL_NOT_IN_USE } from "dynamicCallFlowCommon/Modal.Controller";

// const renderComponent = () => {
//   return render(
//     <DynamicCallFlowActionContext.Provider value={{
//       accessTokenGraph: "mockToken",
//       permissions: [DynamicCallFlowADGroupPermission],
//       currentOpenModal: MODAL_NOT_IN_USE,
//       modalController
//     }}>
//       <ActionDataGridComponent/>
//     </DynamicCallFlowActionContext.Provider>
//   );
// };

