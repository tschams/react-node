import { makeStyles } from "@material-ui/core";

const drawerWidth = 152;
const drawerWidthClosed = 66;

export const useStyles = makeStyles(
  theme => ({
    drawer(props) {
      return {
        width: props.isNavOpen ? drawerWidth : drawerWidthClosed,
        flexShrink: 0,
      };
    },
    drawerPaper(props) {
      return {
        color: theme.palette.primary.contrastText,
        width: props.isNavOpen ? drawerWidth : drawerWidthClosed,
        whiteSpace: "nowrap",
      };
    },
    menuRoot: {
      backgroundColor: "#FFFFFF",
      height: "100%",
      overflow: "hidden",
    },
    menuList: {
      height: "100%",
      padding: 0,
      "& > div:last-child > div, & > div:first-child > div": {
        backgroundColor: "#FFFFFF",
        "&:hover": {
          backgroundColor: "#FFFFFF",
        },
      },
      "& > div:last-child > span, & > div:first-child > span": {
        display: "none"
      },
      "& > div:last-child > div": {
        bottom: "1rem",
        position: "absolute",
      },
      "& > div:first-child > div": {
        height: "4.5rem",
        "&:hover": {
          cursor: "auto"
        },
      },
      "& > div:nth-child(2) > div": {
        marginTop: ".5rem"
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
    menuListItem: {
        padding: ".8rem .6rem .8rem 1.1rem",
        color: "rgba(255, 255, 255, 0.38)",
        margin: "0 .5rem",
        width: props => props.isNavOpen ? "89%" : "75%",
    },
    menuListItemSelected: {
      backgroundColor: "#FCEEE6",
      borderRadius: ".25rem",
      "&:hover": {
        backgroundColor: "#FCEEE6",
      },
      "& $menuListItemText": {
        color: "#EF7232",
        fontWeight: 600,
      },
      "& $menuListItemIcon": {
        fill: "#EF7232",
      },
    },
    menuListItemHoverAndActive: {
      "&:hover": {
        backgroundColor: "#FCEEE6",
        borderRadius: ".25rem",
        "& $menuListItemIcon": {
          fill: "#EF7232",
        },
        "& $menuListItemText": {
          color: "#EF7232",
          fontWeight: 600,
        },
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
        fill: "#959AA1",
        minWidth: props.isNavOpen ? "1.5rem" : "3rem",
      };
    },
    text: {
      ...theme.mixins.text
    },
    //
    // toolbar: theme.mixins.toolbar,
    //
    // CONSIDER: You can assign `theme.mixins.toolbar` as shown above and
    // then use it with a div to match the AppBar height, e.g.
    // <div className={classes.toolbar} />
    //
  }),
  {
    classNamePrefix: "MainMenu",
  },
);
