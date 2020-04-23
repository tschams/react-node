import React from "react";
import PropTypes from 'prop-types';
import { useStyles } from "./Masthead.styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

function _Masthead(props) {
  const {isNavOpen, drawerOpen, drawerClosed} = props;
  const classes = useStyles({isNavOpen, drawerOpen, drawerClosed});

  return (
    <AppBar position="fixed" className={classes.root} >
      <Toolbar>
        <div className={classes.text}>{props.pageName}</div>
      </Toolbar>
    </AppBar>
  );
}

_Masthead.propTypes = {
  isNavOpen: PropTypes.bool.isRequired,
  drawerOpen: PropTypes.number.isRequired,
  drawerClosed: PropTypes.number.isRequired,
};

export const Masthead = React.memo(_Masthead);
