import React from "react";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
// Local
import {
  DashboardIcon,
  MyProductsIcon,
  OrdersIcon,
  AccountingIcon,
  ReportsIcon,
  MarketingIcon,
  CollapseIcon,
  ExpandIcon,
  CompanyLogoIcon,
} from "../components";
import { Navigation, useOnMount } from "../lib";
import Pages from "../pages";
import {
  useSelector,
  useDispatch,
  PrefActions,
  PrefSelectors,
} from "../state";
import { useStyles } from "./MainMenu.styles";
import { Masthead } from "./Masthead";
import clsx from "clsx";
import { REACT_APP_SITE_TITLE } from "../config";

function _MainMenu() {
  function getItems() {
    const menuItems = [
      {
        text: REACT_APP_SITE_TITLE,
        icon: CompanyLogoIcon,
      },
      {
        text: "Dashboard",
        icon: DashboardIcon,
        url: Pages.main.home.path,
        urlActiveIf: {
          exact: true,
        },
      },
      {
        text: "My Products",
        icon: MyProductsIcon,
        url: Pages.myProducts.home.path,
        urlActiveIf: {
          exact: true,
        },
      },
      {
        text: "Orders",
        icon: OrdersIcon,
        url: Pages.orders.home.path,
        urlActiveIf: {
          exact: true,
        },
      },
      {
        text: "Accounting",
        icon: AccountingIcon,
        url: Pages.accounting.home.path,
        urlActiveIf: {
          exact: true,
        },
      },
      {
        text: "Marketing",
        icon: MarketingIcon,
        url: Pages.marketing.home.path,
        urlActiveIf: {
          exact: true,
        },
      },
      {
        text: "Reports",
        icon: ReportsIcon,
        url: Pages.reports.home.path,
        urlActiveIf: {
          exact: true,
        },
      },
      {
        text: "Collapse",
        icon: isNavOpen ? CollapseIcon : ExpandIcon,
        onClick: ()=> dispatch(PrefActions.toggleOpenNav())
      },
    ];

    return {
      menuItems,
    };
  }

  const isNavOpen = useSelector(PrefSelectors.navOpen);
  const dispatch = useDispatch();

  const drawerWidth = 152;
  const drawerWidthClosed = 66;

  const classes = useStyles({
    isNavOpen, drawerWidth, drawerWidthClosed
  });

  const { menuItems } = React.useMemo(getItems);
  const [pageName, setPageName] = React.useState();

  useOnMount(() => {
    window.addEventListener("resize", toggleNavFromScreenSize);
    setPageName(Navigation.page.titleText);
  });

  const routeChanged = React.useCallback((route) => {
    setPageName(route.page.titleText);
  }, []);

  React.useEffect(() => {
    const remove = Navigation.onRouteChanged(routeChanged);
    return remove;
  }, [routeChanged]);

  function toggleNavFromScreenSize() {
    window.innerWidth >= 960
      ? dispatch(PrefActions.toggleOpenNav(true))
      : dispatch(PrefActions.toggleOpenNav(false));
  }

  function onMenuItemClick(item) {
    if (!item.onClick) {
      item.onClick = () => {
        Navigation.go(item.url);
        }
    }
    return item.onClick;
  }

  const menuContent = (
    <div className={classes.menuRoot}>
      <List className={classes.menuList}>
        {menuItems.map((item, i) => {
          const { text, icon: Icon, url } = item;
          /**
           * `Navigation.isActive` can only be read reliably since we're
           * re-rendering when `setPageName` is called in `routeChanged`,
           * the `Navigation.onRouteChanged` event handler...
          */
          const isActive = Navigation.isActive(url, item.urlActiveIf);

          return (
            <div key={text}>
              {i === 1 && <Divider className={classes.divider} />}
              <ListItem
                button
                className={clsx(
                  classes.menuListItem,
                  isActive && classes.menuListItemSelected,
                  !isActive &&
                    i !== 0 &&
                    i !== menuItems.lastIndex &&
                    classes.menuListItemHoverAndActive,
                )}
                onClick={onMenuItemClick(item)}
              >
                <span
                  className={clsx(
                    classes.block,
                    !isActive && classes.hideBlock,
                  )}
                ></span>
                <ListItemIcon className={classes.menuListItemIcon}>
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={text}
                  className={clsx([classes.menuListItemText, classes.text])}
                />
              </ListItem>
            </div>
          );
        })}
      </List>
    </div>
  );

  return (
    <>
    <Masthead isNavOpen={isNavOpen} pageName={pageName} drawerWidth={drawerWidth} drawerWidthClosed={drawerWidthClosed} />
      <nav className={classes.drawer} aria-label="Main menu">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {menuContent}
        </Drawer>
      </nav>
    </>
  );
}

export const MainMenu = React.memo(_MainMenu);
