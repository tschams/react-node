import { AccountingPage } from "./AccountingPage";

export const AccountingPages = {
  home: {
    anon: false,
    path: "/accounting",
    title: "Accounting",
    type: "PAGE_ACCOUNTING",
    view: AccountingPage,
  },
};
export default AccountingPages;

export const AccountingArea = {
  pages: AccountingPages,
};
