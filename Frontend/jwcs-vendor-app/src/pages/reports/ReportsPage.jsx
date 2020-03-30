import React from "react";
import { Box, Grid, Typography } from "@material-ui/core";
// Local
import { AuthSelectors, useSelector } from "../../state";
import { useMobile } from "../../themes";
import { useStyles } from "./ReportsPage.styles";

function _ReportsPage() {
  // const dispatch = useDispatch();
  const userFirstName = useSelector(AuthSelectors.userFirstName);
  const classes = useStyles();
  const isMobile = useMobile();

  // useOnMount(() => {
  //   dispatch(SomeActions.getHomePageData());
  // });

  return (
    <Grid container spacing={isMobile ? 0 : 3}>
      <Grid item xs={12}>
        <Typography className={classes.title} variant="h4">
          Hey, {userFirstName}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box boxShadow={3} className={classes.contentBox}>
          REPORTS PAGE CONTENT
        </Box>
      </Grid>
    </Grid>
  );
}

export const ReportsPage = React.memo(_ReportsPage);
