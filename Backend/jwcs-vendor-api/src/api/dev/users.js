import { VendorAuthRole, VendorUser } from "../../db";

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {{[operation:string]:(req:Request,res:Response)=>void}} Controller
 */

/** @type {Controller} */
const controller = {
  async createAuthRole(req, res) {
    const item = await VendorAuthRole.create(req.body);
    res.json({
      item,
    });
  },
  async createUser(req, res) {
    // console.log("QUERY: ", req.query);
    // console.log("BODY: ", req.body);
    const item = await VendorUser.create(req.body);
    res.json({
      item,
    });
  },
  async getAuthRoles(req, res) {
    const items = await VendorAuthRole.listAll();
    res.json({
      items,
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
