import { Vendor } from "../../db";

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {{[operation:string]:(req:Request,res:Response)=>void}} Controller
 */

/** @type {Controller} */
const controller = {
  async create(req, res) {
    // console.log("QUERY: ", req.query);
    // console.log("BODY: ", req.body);
    const item = await Vendor.create(req.body);
    res.json({
      item,
    });
  },
  async listAll(req, res) {
    const items = await Vendor.listAll();
    res.json({
      items,
    });
  },
  async update(req, res) {
    const item = await Vendor.update({
      id: req.params.id,
      ...req.body,
    });
    res.json({
      item,
    });
  },
};
export default controller;
