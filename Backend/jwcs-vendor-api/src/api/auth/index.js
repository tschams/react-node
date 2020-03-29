import jwt from "jsonwebtoken";
// Local
import { USER_JWT_EXPIRES, USER_JWT_SECRET } from "../../config";
import passport from "../../auth/passport";
import { apiController } from "../../lib/utils";
// import { VendorUser } from "../../db";

export default apiController({
  login: [
    passport.authenticate("login", { session: false }),
    async function login(req, res) {
      // console.log("REQ: ", req);
      // console.log("QUERY: ", req.query);
      // console.log("BODY: ", req.body);

      const { user } = req;

      const token = jwt.sign(
        // To keep the token small, only sign the essential facts here.
        // Essential facts are those needed to secure an API call.
        {
          user: {
            vendorId: user.vendorId,
            id: user.id,
            roles: user.roles,
            // email isn't included here, instead - when you need it, get the
            // most recent one from the database.
          },
        },
        USER_JWT_SECRET,
        // Options for jwt.sign - https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
        {
          expiresIn: USER_JWT_EXPIRES,
        },
      );
      /**
       * NOTE: We can just call `jwt.decode` instead of `jwt.verify` here, since
       * we just created the token above and we know it's safe.
       * @type {{user:any,iat:number,exp:number}}
       */
      const tokenData = jwt.decode(token, { json: true });
      // console.log("TOKEN DATA: ", tokenData);
      // console.log("EXPIRES: ", new Date(tokenData.exp * 1000));

      // Aside from the token, you can return whatever other data you want here.
      res.json({
        token,
        expiration: tokenData.exp, // JS time epoch, in seconds.
        user: {
          vendorId: user.vendorId,
          vendorName: user.vendorName,
          id: user.id,
          email: user.email,
          roles: user.roles,
        },
      });
    },
  ],
});
