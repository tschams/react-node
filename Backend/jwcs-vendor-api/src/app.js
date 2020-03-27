import express from "express";
import CORS from "cors";
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
  FRONTEND_SITE_URL,
  SITE_URL,
} from "./config";
import { apiSpec } from "./api";

export const app = express();

if (__DEV__) {
  useAPIDocs();
}
/**
 * Enable CORS. See:
 * - https://www.npmjs.com/package/cors#usage
 * - https://github.com/expressjs/cors
 * - https://www.html5rocks.com/en/tutorials/cors/
 */
app.use(
  CORS({
    maxAge: 86400, // 24 hours, in seconds.
    origin: FRONTEND_SITE_URL,
    // exposedHeaders: ["X-Total-Count"],
  }),
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(passport.initialize({ userProperty: "user" }));

/**
 * JWT authentication/authorization security check.
 * Returns true if user logged in and if user has role that is found in the
 * endpoints openapi.schema["x-security-roles"] array.
 * Otherwise, returns false.
 * @see https://github.com/cdimascio/express-openapi-validator#security-handlers
 * @param {import("express").Request} req
 */
async function AuthJWT(req) {
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
}

function listen(runningDocs) {
  return new Promise((resolve, reject) => {
    app.listen(API_PORT, err => {
      if (err) {
        console.dir(err);
        reject(err);
        return;
      }
      console.log(`Running  ${SITE_URL}`);
      console.log(`API      ${API_URL}`);
      if (runningDocs) {
        console.log(`API Docs ${API_DOCS_URL}`);
        console.log(`API Spec ${SITE_URL}/swagger.json`);
      }
      console.log("");
      resolve();
    });
  });
}

/**
 * Authenticates the JWT token, decodes the user and stores it in `req.user`.
 * Returns true if JWT token is authentic.
 */
function passportAuthJWT(req) {
  return new Promise((resolve, reject) => {
    const doAuth = passport.authenticate("jwt", (err, user, info) => {
      // console.log("AUTHD: ", err, user, info);
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

export async function start() {
  // Setup express-openapi-validator
  // See https://github.com/cdimascio/express-openapi-validator#readme
  const validator = new OpenApiValidator({
    apiSpec: apiSpec,
    operationHandlers: `${__dirname}/api`,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: {
      handlers: { AuthJWT },
    },
  });

  // Create an async promise chain starting with installing the validator.
  let starting = validator.install(app);

  // Catch development errors, print help for invalid Open-API specifications.
  if (__DEV__) {
    starting = starting.catch(writeDeveloperErrorHelp);
  }

  // After validator installs and adds routes from the apiSpec, add the final
  // app handlers for NotFound (404) and Error (500).
  // Then start the server listening for requests. If there's an error during
  // these steps, call `process.exit()`.
  starting = starting
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

      return listen(__DEV__);
    })
    .catch(err => {
      process.exit(1);
    });

  // Execute all of the steps setup above and wait here for them to finish.
  await starting;
}

function useAPIDocs() {
  useSwaggerJson();
  useSwaggerUI();
}

function useSwaggerJson() {
  // Serve the Open-API v3 specification document for the Swagger UI.
  app.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiSpec);
  });
}

function useSwaggerUI() {
  // See:
  // - https://www.npmjs.com/package/swagger-ui-express#custom-swagger-options
  // - https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/configuration.md#display
  app.use(
    API_DOCS_PATH,
    swaggerUI.serve,
    swaggerUI.setup(apiSpec, {
      swaggerOptions: {
        docExpansion: "none",
        // plugins: [
        //   {
        //     afterLoad: function(ui) {
        //       // See https://github.com/swagger-api/swagger-ui/blob/master/src/core/system.js#L344
        //       // See https://github.com/swagger-api/swagger-ui/issues/2915#issuecomment-297405865

        //       // var swaggerOptions = this;

        //       // TODO: Get auth token from localStorage, if any.

        //       // TODO: Put auth token into Swagger:
        //       // ui.authActions.authorize({ AuthJWT: { name: "AuthJWT", schema: {type:"apiKey", in: "header", name: "Authorization", description: ""}, value: "<THE TOKEN>"}});

        //       // TODO: On interval, Call ui.getState(); and get auth token from:
        //       // "auth.authorized[SCHEMA_NAME].value", by finding strings in _root.entries[]...
        //       // _root.entries[4][1]._root.entries[0][1]._root.entries[0][1]._root.entries[2][1]

        //       // TODO: On interval, save fresh auth token into localStorage.

        //       // TEST: To see if this will work... (it will!)
        //       setTimeout(function() {
        //         ui.authActions.authorize({
        //           AuthJWT: {
        //             name: "AuthJWT",
        //             schema: {
        //               type: "apiKey",
        //               in: "header",
        //               name: "Authorization",
        //               description: "",
        //             },
        //             value: "<YOUR JWT TOKEN HERE>",
        //           },
        //         });
        //       }, 1000);
        //     },
        //   },
        // ],
      },
    }),
  );
}

function writeDeveloperErrorHelp(err) {
  console.log("");
  console.dir(err);
  console.log("");
  // We still listen during dev, so the user can get to /swagger.json
  console.log("If you got `openapi.validator` errors:");
  console.log("");
  console.log(`1. Go to ${SITE_URL}/swagger.json`);
  console.log(`2. Copy the contents of the file.`);
  console.log(`3. Go to https://editor.swagger.io/`);
  console.log(`4. Paste the contents of the file. Yes, convert to YAML.`);
  console.log(
    `5. See if this helps you locate the error. ` +
      `Ignore errors about unique operationIds. ` +
      `Error line #'s go to objects that contain the invalid property, ` +
      `the don't always point to the invalid property itself...`,
  );
  console.log("");
}
