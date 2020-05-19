import React from "react";
import PropTypes from "prop-types";
import { useStyles } from "./Masthead.styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

function _Masthead(props) {
  const { width, pageName } = props;
  const classes = useStyles({ width });

  return (
    <AppBar position="fixed" className={classes.root}>
      <Toolbar>
        <div className={classes.text}>{pageName}</div>
      </Toolbar>
    </AppBar>
  );
}

_Masthead.propTypes = {
  width: PropTypes.number.isRequired,
  pageName: PropTypes.string.isRequired,
};

export const Masthead = React.memo(_Masthead);
