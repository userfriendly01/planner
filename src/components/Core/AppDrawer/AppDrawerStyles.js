const drawerWidth = 220;
const modalDrawerWidth = 240;

export const styles = theme => ({
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    height: '100vh',
    backgroundColor: '#eeeeee',
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9
    }
  },
  drawerPaperModal: {
    width: modalDrawerWidth
  },
  link: {
    textDecoration: 'none'
  },
  sideNav: {
    [theme.breakpoints.up('sm')]: {
      marginTop: 48,
    },
  }
});