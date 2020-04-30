import { MarketingPage } from "./MarketingPage";

export const MarketingPages = {
  home: {
    anon: false,
    path: "/marketing",
    title: "Marketing",
    type: "PAGE_MARKETING",
    view: MarketingPage,
  },
};
export default MarketingPages;

export const MarketingArea = {
  pages: MarketingPages,
};
