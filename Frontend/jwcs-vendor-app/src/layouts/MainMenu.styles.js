import { makeStyles } from "@material-ui/core";

const drawerWidth = 152;
const drawerWidthClosed = 66;

export const useStyles = makeStyles(
  theme => ({
    appBar(props) {
      return {
        marginLeft: props.isMenuOpen ? drawerWidth : drawerWidthClosed,
        [theme.breakpoints.up("md")]: {
          width: `calc(100% - ${
            props.isMenuOpen ? drawerWidth : drawerWidthClosed
          }px)`,
        },
      };
    },
    avatar: {
      margin: 16,
      marginTop: 32,
      padding: 24,
    },
    drawer(props) {
      return {
        [theme.breakpoints.up("md")]: {
          width: props.isMenuOpen ? drawerWidth : drawerWidthClosed,
          flexShrink: 0,
        },
      };
    },
    drawerPaper(props) {
      return {
        color: theme.palette.grey[700],
        width: props.isMenuOpen ? drawerWidth : drawerWidthClosed,
        whiteSpace: "nowrap",
        [theme.breakpoints.up("sm")]: {
          color: theme.palette.primary.contrastText,
          // backgroundColor: theme.palette.primary.dark,
          // backgroundColor: "#FFFFFF",
        },
      };
    },
    menuRoot: {
      backgroundColor: "#FFFFFF",
      height: "100%",
      overflow: "hidden",
      [theme.breakpoints.down("sm")]: {
        backgroundColor: "white",
      },
    },
    menuList: {
      height: "100%",
      [theme.breakpoints.down("sm")]: {
        backgroundColor: "white",
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
    block: {
      background: "#F28955",
      borderRadius: ".25rem 0 0 .25rem",
      position: "absolute",
      width: ".38rem",
      left: 0,
      top: 0,
      bottom: 0,
    },
    blockHover: {
      display: "none",
    },
    menuListItem(props) {
      return {
        padding: ".8rem .6rem .8rem 1.1rem",
        color: "rgba(255, 255, 255, 0.38)",
        margin: "0 .5rem",
        width: props.isMenuOpen ? "89%" : "75%",
      };
    },
    menuListItemSelected: {
      backgroundColor: "#FCEEE6",
      borderRadius: ".25rem",
      "&:hover": {
        backgroundColor: "#FCEEE6",
      },
    },
    menuListItemHoverAndActive: {
      "&:hover": {
        backgroundColor: "#FCEEE6",
        borderRadius: ".25rem",
        "& $blockHover": {
          display: "inline-block",
        },
      },
      "&:active": {
        boxShadow:
          "inset -1px 2px 5px rgba(239, 114, 50, 0.15), inset 0px 2px 10px rgba(239, 114, 50, 0.08)",
      },
    },
    menuListItemText: {
      minWidth: "5.25rem",
    },
    menuListItemIcon(props) {
      return {
        color: "unset",
        minWidth: props.isMenuOpen ? "1.5rem" : "3rem",
      };
    },
    collapseButton: {
      bottom: "10.5rem",
      position: "absolute",
      backgroundColor: "#FFFFFF",
      "&:hover": {
        backgroundColor: "#FFFFFF",
      },
    },
    text: {
      color: "#5B616B",
      lineHeight: "1rem",
      fontFamily: "Archivo",
      fontSize: ".85rem",
    },
    //
    // toolbar: theme.mixins.toolbar,
    //
    // CONSIDER: You can assign `theme.mixins.toolbar` as shown above and
    // then use it with a div to match the AppBar height, e.g.
    // <div className={classes.toolbar} />
    //
    userName: {
      marginBottom: -8,
      marginLeft: 16,
      marginTop: 0,
    },
    viewProfileText: {
      [theme.breakpoints.down("sm")]: {
        color: theme.palette.primary.main,
      },
    },
  }),
  {
    classNamePrefix: "MainMenu",
  },
);
