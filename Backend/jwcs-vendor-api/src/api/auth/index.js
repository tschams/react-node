// import { VendorUser } from "../../db";
import passport from "../../auth/passport";
import jwt from "jsonwebtoken";

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {{[operation:string]:(req:Request,res:Response)=>void}} Controller
 */

/** @type {Controller} */
const controller = {
  login: [
    passport.authenticate("login", { session: false }),
    async function login(req, res) {
      // console.log("REQ: ", req);
      // console.log("QUERY: ", req.query);
      // console.log("BODY: ", req.body);

      const { user } = req;

      const token = jwt.sign(
        {
          user: {
            vendorId: user.vendorId,
            id: user.id,
            email: user.email,
            roles: user.roles,
          },
        },
        "TOP_SECRET",
      );

      res.json({
        token,
        user: {
          vendorId: user.vendorId,
          id: user.id,
          email: user.email,
          roles: user.roles,
        },
      });
    },
  ],
};
export default controller;
