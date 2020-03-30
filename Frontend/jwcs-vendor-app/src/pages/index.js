// import { DevArea } from "./dev";
import { AuthArea } from "./auth";
import { MainArea } from "./main";
import { MyProductsArea } from "./myProducts";
import { OrdersArea } from "./orders";
import { AccountingArea } from "./accounting";
import { MarketingArea } from "./marketing";
import { ReportsArea } from "./reports";

import { MainLayout } from "../layouts";

export const Pages = {
  // dev: DevArea,
  auth: AuthArea.pages,
  main: MainArea.pages,
  myProducts: MyProductsArea.pages,
  orders: OrdersArea.pages,
  accounting: AccountingArea.pages,
  marketing: MarketingArea.pages,
  reports: ReportsArea.pages,
};
export default Pages;

export const AppArea = {
  areas: [
    // DevArea,
    AuthArea,
    MainArea,
    MyProductsArea,
    OrdersArea,
    AccountingArea,
    MarketingArea,
    ReportsArea,
  ],
  layouts: {
    default: {
      path: "/",
      view: MainLayout,
    },
  },
};

// #region Typedefs
/** Page definition extend for this app.
 * @typedef {object} PageDefinitionEx
 * @property {string[]} [roles] Roles allowed to access the page.
 * @property {string} titleText Title of the page without the site name suffix.
 */
/** Combine PageDefinition and PageDefinitionEx to make Page.
 * @typedef {import("../lib/routing").PageDefinition & PageDefinitionEx} Page
 */
// #endregion
