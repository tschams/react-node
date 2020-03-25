import { VendorTodo } from "../../db";

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {{[operation:string]:(req:Request,res:Response)=>void}} Controller
 */

/** @type {Controller} */
const controller = {
  async createItem(req, res) {
    // console.log("QUERY: ", req.query);
    // console.log("BODY: ", req.body);
    const { vendorId, id: userId } = req.user;
    const item = await VendorTodo.create({
      ...req.body,
      vendorId,
      createdByVendorUserId: userId,
      updatedByVendorUserId: userId,
    });
    res.json({
      item,
    });
  },
  async listAll(req, res) {
    const items = await VendorTodo.listForVendor({
      vendorId: req.user.vendorId,
    });
    res.json({
      items,
    });
  },
  async removeItem(req, res) {
    await VendorTodo.remove(req.user.vendorId, req.params.id);
    res.status(200).end();
  },
  async updateItem(req, res) {
    const { id: itemId } = req.params;
    const { vendorId, id: userId } = req.user;
    const item = await VendorTodo.update({
      ...req.body,
      id: itemId,
      vendorId,
      updatedByVendorUserId: userId,
    });
    res.json({
      item,
    });
  },
};
export default controller;
