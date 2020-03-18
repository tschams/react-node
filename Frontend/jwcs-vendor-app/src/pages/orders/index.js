import { OrdersPage } from "./OrdersPage";

export const OrdersPages = {
  home: {
    anon: false,
    path: "/orders",
    title: "Orders",
    type: "PAGE_ORDERS",
    view: OrdersPage,
  },
};
export default OrdersPages;

export const OrdersArea = {
  pages: OrdersPages,
};
