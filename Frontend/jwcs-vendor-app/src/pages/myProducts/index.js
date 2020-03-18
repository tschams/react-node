import { MyProductsPage } from "./MyProductsPage";

export const MyProductsPages = {
  home: {
    anon: false,
    path: "/my-products",
    title: "MyProducts",
    type: "PAGE_MYPRODUCTS",
    view: MyProductsPage,
  },
};
export default MyProductsPages;

export const MyProductsArea = {
  pages: MyProductsPages,
};
