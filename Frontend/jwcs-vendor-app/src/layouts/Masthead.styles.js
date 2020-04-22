import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(
  theme => ({
    root: {
      marginLeft: (props) => props.isNavOpen ? 152 : 66,
      width: (props) => `calc(100% - ${props.isNavOpen ? 152 : 66}px)`,
      backgroundColor: "#DFE2E6",
      borderRadius: 0,
      height: "4.5rem",
      boxShadow: "none"
    },
    text: {
      color: "#5B616B",
      position: "absolute",
      left: "16px",
      fontWeight: "bold",
      fontSize: "26px",
      lineHeight: "28px",
    },
  }),
  {
    classNamePrefix: "Masthead",
  },
);
