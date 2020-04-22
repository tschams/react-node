import React from "react";
import { useStyles } from "./Masthead.styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

function _Masthead(props) {
  const classes = useStyles(props.isNavOpen);

  return (
    <AppBar position="fixed" className={classes.root} >
      <Toolbar>
        <div className={classes.text}>{props.pageName}</div>
      </Toolbar>
    </AppBar>
  );
}

export const Masthead = React.memo(_Masthead);
