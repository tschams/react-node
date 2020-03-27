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
  async assignAuthRoleToUser(req, res) {
    // console.log("PARAMS: ", req.params);
    // console.log("BODY: ", req.body);
    const roles = await VendorUser.assignAuthRoleToUser(
      req.body.roleName,
      req.params.id,
    );
    if (!roles) {
      res.status(400).json({ message: "Role not found. Please create it." });
      return;
    }
    res.json({
      roles,
    });
  },

  async getAuthRolesOfUser(req, res) {
    const roles = await VendorUser.getAuthRolesOfUser(req.params.id);
    res.json({
      roles,
    });
  },

  async removeAuthRoleFromUser(req, res) {
    await VendorUser.removeAuthRoleFromUser(req.params.roleName, req.params.id);
    res.status(200).json({ ok: true });
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
