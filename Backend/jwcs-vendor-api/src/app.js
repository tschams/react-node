import express from "express";
// import Cors from "cors";
import bodyParser from "body-parser";
import logger from "morgan";
import passport from "./auth/passport";
import swaggerUI from "swagger-ui-express";
import { OpenApiValidator } from "express-openapi-validator";
// Local
import {
  __DEV__,
  API_DOCS_PATH,
  API_DOCS_URL,
  API_PORT,
  API_URL,
  SITE_URL,
} from "./config";
import { apiSpec } from "./api";

export const app = express();

app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(apiSpec);
});

app.use(API_DOCS_PATH, swaggerUI.serve, swaggerUI.setup(apiSpec));
// TODO: Enable CORS.
// app.use(Cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(passport.initialize({ userProperty: "user" }));

// NOTE: If you are failing OpenAPI validation, see the full spec like this:
// console.log("API SPEC: ");
// console.dir(apiSpec, { depth: null });

function passportAuthJWT(req) {
  return new Promise((resolve, reject) => {
    const doAuth = passport.authenticate("jwt", (err, user, info) => {
      console.log("AUTHD: ", err, user, info);
      if (err) {
        reject(err);
      } else if (!user) {
        resolve(false);
      }
      req.user = user;
      resolve(true);
    });
    doAuth(req);
  });
}

new OpenApiValidator({
  apiSpec: apiSpec,
  operationHandlers: `${__dirname}/api`,
  validateRequests: true,
  validateResponses: false,
  // See https://github.com/cdimascio/express-openapi-validator#%EF%B8%8F-validatesecurity-optional
  validateSecurity: {
    handlers: {
      // See https://github.com/cdimascio/express-openapi-validator#security-handlers
      async AuthJWT(req) {
        // TODO: Get decoded JWT roles. Return false if no JWT roles exist in
        // x-security-roles...
        const isAuth = await passportAuthJWT(req);
        if (!isAuth) {
          return false;
        }
        const routeRoles = req.openapi.schema["x-security-roles"];
        if (routeRoles) {
          // console.log("REQUIRED ROLES: ", routeRoles);
          // console.log("USER: ", req.user);
          const userRoles = req.user.roles;
          // Return true if at least one routeRoles exists in userRoles.
          return routeRoles.some(role => userRoles.includes(role));
        }
        return true;
      },
    },
  },
})
  .install(app)
  .then(() => {
    app.use((req, res) => {
      res.status(404).json({ error: 404, message: "Not found." });
    });

    app.use(function(err, req, res, next) {
      const { errors, stack, status = 500 } = err;
      res.status(status).json({
        error: status,
        message: "Application error.",
        errors,
        stack: __DEV__ ? stack : undefined,
      });
    });

    app.listen(API_PORT, () => {
      console.log(`Running  ${SITE_URL}`);
      console.log(`API      ${API_URL}`);
      console.log(`API Docs ${API_DOCS_URL}`);
      console.log("");
    });
  });
