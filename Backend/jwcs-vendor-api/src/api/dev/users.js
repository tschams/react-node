import { VendorUser } from "../../db";

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {{[operation:string]:(req:Request,res:Response)=>void}} Controller
 */

/** @type {Controller} */
const controller = {
  async createUser(req, res) {
    // console.log("QUERY: ", req.query);
    // console.log("BODY: ", req.body);
    const item = await VendorUser.create(req.body.email, req.body.password);
    res.json({
      item,
    });
  },
  async getUsers(req, res) {
    const items = await VendorUser.getAll();
    res.json({
      items,
    });
  },
};
export default controller;
