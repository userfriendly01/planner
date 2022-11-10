/* eslint-disable no-console, max-len,  no-return-assign */

const CACHE_MASTER_DATA = 'FLOW_MASTER_DATA';
const masterDataItems = ['channel', 'brand', 'callerType', 'callFlowTemplate', 'callFlowRoute', 'pkey'];
const masterDataItemsFromContent = ['callFlowRoute'];
const filteredItems = [null, 'null', ''];

const clearGridMasterData = () => localStorage.removeItem(CACHE_MASTER_DATA);

const getValueFromKeyPath = (element:any, key:any) => {
  if (element == null) {
    return null;
  } if (masterDataItemsFromContent.includes(key)) {
    return element.content ? element.content[key] : element.content;
  }
  return element[key];
};

const getGridMasterData = (data:any = []) => {
  let masterData:any;
  try {
    masterData = localStorage.getItem(CACHE_MASTER_DATA);
    if (masterData) {
      masterData = JSON.parse(masterData);
    } else {
      masterData = {};
      data.forEach((elem:any) => masterDataItems.forEach((key) => {
        const value = getValueFromKeyPath(elem, key);
        const isValueIsNull = filteredItems.includes(value);
        if (!masterData[key]) {
          masterData[key] = [];
        }
        if (!isValueIsNull) {
          masterData[key].push(value);
        }
      }));
      Object.keys(masterData).forEach((key) => masterData[key] = [...new Set(masterData[key])].sort());
      localStorage.setItem(CACHE_MASTER_DATA, JSON.stringify(masterData));
    }
  } catch (err) {
    console.error('Error in parsing master data', err);
  }
  return masterData;
};

export {
  getGridMasterData,
  clearGridMasterData,
};
