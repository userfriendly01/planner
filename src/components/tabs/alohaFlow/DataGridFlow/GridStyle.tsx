import { CSSObject } from 'styled-components';
import theme from './GridTheme';
export const headColor = '#167F92';
export const headTextColor = '#ffffff';
export const GridStyle = {
  rows: {
    style: {
      minHeight: '53px', // override the row height
      backgroundColor: 'transparent',
    },
  },
  cells: {
    style: {
      paddingLeft: '5px', // override the cell padding for data cells
      paddingRight: '5px',
      //wordBreak: 'break-word',
      //textAlign: 'center',

    },
  },
  table: {
    style: {
      color: theme.text.primary,
      backgroundColor: 'transparent',
      border: '1px solid #D9E4E6',
      borderRadius: '10px',
    },
  },
  tableWrapper: {
    style: {
      display: 'table',
    },
  },
  header: {
    style: {
      fontSize: '22px',
      color:headTextColor,
      backgroundColor:headColor,
      minHeight: '56px',
      paddingLeft: '8px',
      paddingRight: '8px',
    },
  },
  subHeader: {
    style: {
      backgroundColor: headColor,
      minHeight: '52px',
    },
  },
  head: {
    style: {
      color: headTextColor,
      fontSize: '14px',
      fontWeight: 500,
    },
  },
  headRow: {
    style: {
      backgroundColor: headColor,
      minHeight: '52px',
      borderBottomWidth: '1px',
      boxShadow: '0px 0px 5px 0px rgb(0 0 0 / 10%)',
      borderBottomColor: theme.divider.default,
      //borderBottomStyle: 'solid',
    },
    denseStyle: {
      minHeight: '32px',
    },
  },
  headCells: {
    style: {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
    draggingStyle: {
      cursor: 'move',
    },
  },
  pagination: {
    style: {
      borderTopWidth: 0,
    },
  },
};



// table background-color: #E7EBF0;
// border color // border-bottom-color: 1px solid #e0e0e0;
