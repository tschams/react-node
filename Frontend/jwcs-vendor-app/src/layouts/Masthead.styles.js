import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(
  theme => ({
    root(props) {
      const { width } = props;

      return {
        marginLeft: width,
        width: `calc(100% - ${width}px)`,
        backgroundColor: "#DFE2E6",
        borderRadius: 0,
        height: "72px",
        boxShadow: "none",
      };
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
