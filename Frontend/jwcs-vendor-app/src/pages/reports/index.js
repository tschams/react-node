import { ReportsPage } from "./ReportsPage";

export const ReportsPages = {
  home: {
    anon: false,
    path: "/reports",
    title: "Reports",
    type: "PAGE_REPORTS",
    view: ReportsPage,
  },
};
export default ReportsPages;

export const ReportsArea = {
  pages: ReportsPages,
};
