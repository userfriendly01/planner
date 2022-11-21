/* eslint-disable react/prop-types */


import React from "react";
import {
  Modal, ModalHeader, ModalBody, ModalFooter
} from "@lmig/lmds-react-modal";
import {
  HeadingStyled
} from "../../AlohaFlow.Styles";
import "./index.scss";

const CACHE_FILTER_FLOW = "SEARCH_FILTER_FLOW";

const AdvanceSearchModal = (props:any) => {
  const {
    isOpen, onClose, handleChange, masterData = [], selection, openModal, applyFilter
  } = props;

  const saveFilter = (search:any) => {
    console.log("search", search);
    console.log("sele", selection);
    console.log("master", masterData);
    localStorage.setItem(CACHE_FILTER_FLOW, JSON.stringify(search));
    applyFilter();
    openModal(false, search);
  };

  const resetSavedFilter = () => {
    localStorage.removeItem(CACHE_FILTER_FLOW);
    applyFilter();
    openModal(false, null);
  };

  if (masterData.length === 0) {
    return null;
  }

  return (
    <div>
      <Modal isOpen={isOpen} onClose={() => onClose(false)}>
        <ModalHeader id="my-awesome-header">
          <HeadingStyled type="h4-light"> Advance Search Selection </HeadingStyled>
        </ModalHeader>

        <div className="route-table-advance-search-modal-wrapper">
          <ModalBody>
            <div className="advance-search-container">
              <div className="heading">
                <div>Please select search items to filter Routing Rules</div>
              </div>
              <div className="drop-down-item" id="brand" key="brand">
                <div className="drop-down-label">Brand</div>
                <div className="select-container">
                  <select value={selection.brand} onChange={e => handleChange(e)} name="brand">
                    <option value="">Select Brand</option>
                    {masterData.brand.map((option:any) => (
                      <option value={option} key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="drop-down-item" id="channel" key="channel">
                <div className="drop-down-label">Channel</div>
                <div className="select-container">
                  <select value={selection.channel} onChange={e => handleChange(e)} name="channel">
                    <option value="">Select Channel</option>
                    {masterData.channel.map((option:string|number) => (
                      <option value={option} key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="drop-down-item" id="dialed" key="dialed">
                <div className="drop-down-label">Dialed#</div>
                <div className="input-container">
                  <input value={selection.pkey} onChange={e => handleChange(e)} name="pkey" />
                </div>
              </div>
              <div className="drop-down-item" id="template" key="template">
                <div className="drop-down-label">Template</div>
                <div className="select-container">
                  <select value={selection.callFlowTemplate} onChange={e => handleChange(e)} name="callFlowTemplate">
                    <option value="">Select Template</option>
                    {masterData?.callFlowTemplate?.map((option:string|number) => (
                      <option value={option} key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="drop-down-item" id="route" key="route">
                <div className="drop-down-label">Route</div>
                <div className="select-container">
                  <select value={selection.callFlowRoute} onChange={e => handleChange(e)} name="callFlowRoute">
                    <option value="">Select Template</option>
                    {masterData?.callFlowRoute?.map((option:string|number) => (
                      <option value={option} key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter >
            <div className="modal-item buttons search-item-modal">
              <button
                type="button"
                value="Save Filter"
                onClick={() => saveFilter(selection)}
              >
                Save Filter
              </button>

              <button
                type="button"
                value="Save"
                onClick={() => resetSavedFilter()}
              >
                Reset Filter
              </button>
            </div>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
};
export default AdvanceSearchModal;
