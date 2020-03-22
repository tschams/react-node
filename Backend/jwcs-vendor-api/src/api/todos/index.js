import { timeoutAsync } from "../../lib/utils";
// import { VendorTodoItem } from "../../db";

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {{[operation:string]:(req:Request,res:Response)=>void}} Controller
 */

/** @type {Controller} */
const controller = {
  async getItems(req, res) {
    // const items = await VendorTodoItem.getAll();
    await timeoutAsync();
    const items = [{ id: 1, text: "Item 1." }];
    res.json({
      items,
    });
  },
};
export default controller;
