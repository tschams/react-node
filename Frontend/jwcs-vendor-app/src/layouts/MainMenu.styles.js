import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(
  theme => ({
    drawer({ width }) {
      return {
        width,
        flexShrink: 0,
      };
    },
    drawerPaper({ width }) {
      return {
        color: theme.palette.primary.contrastText,
        width,
        whiteSpace: "nowrap",
        borderRightWidth: "1px",
        borderRightStyle: "solid",
        borderRightColor: theme.divideColor,
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
        display: "none",
      },
      "& > div:last-child > div": {
        bottom: "16px",
        position: "absolute",
      },
      "& > div:first-child > div": {
        height: "71px",
        "&:hover": {
          cursor: "auto",
        },
      },
      "& > div:nth-child(2) > div": {
        marginTop: "8px",
      },
    },
    block: {
      background: "#F28955",
      borderRadius: "4px 0 0 4px",
      position: "absolute",
      width: "6px",
      left: 0,
      top: 0,
      bottom: 0,
    },
    hideBlock: {
      display: "none",
    },
    menuListItem: {
      padding: "13px 9.5px 13px 17.5px",
      color: "rgba(255, 255, 255, 0.38)",
      margin: "0 8px",
      width: ({ navOpen }) => (navOpen ? "89%" : "75%"),
    },
    menuListItemSelected: {
      backgroundColor: "#FCEEE6",
      borderRadius: "4px",
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
        borderRadius: "4px",
        "& $menuListItemIcon": {
          fill: "#EF7232",
        },
        "& $menuListItemText": {
          color: "#EF7232",
          fontWeight: 600,
        },
        "& $hideBlock": {
          display: "inline-block",
        },
      },
      "&:active": {
        boxShadow:
          "inset -1px 2px 5px rgba(239, 114, 50, 0.15), inset 0px 2px 10px rgba(239, 114, 50, 0.08)",
      },
    },
    menuListItemText: {
      minWidth: "84px",
    },
    divider: {
      backgroundColor: theme.dividerColor,
    },
    menuListItemIcon({ navOpen }) {
      return {
        fill: "#959AA1",
        minWidth: navOpen ? "24px" : "48px",
      };
    },
    text: {
      ...theme.mixins.text,
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
