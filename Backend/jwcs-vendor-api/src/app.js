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

/** Start the application. */
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
  // Serve the Swagger UI.
  // See:
  // - https://www.npmjs.com/package/swagger-ui-express#custom-swagger-options
  // - https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/configuration.md#display
  app.use(
    API_DOCS_PATH,
    swaggerUI.serve,
    swaggerUI.setup(apiSpec, {
      swaggerOptions: {
        docExpansion: "none",
        plugins: [useSwaggerUIAuthStoragePlugin()],
      },
    }),
  );
}

function useSwaggerUIAuthStoragePlugin() {
  /* eslint-disable */
  // prettier-ignore
  const afterLoad = function(ui) {
    // NOTE: Code inside this afterLoad function will run in the browser!
    //
    // **Therefore, you cannot use an closure variables in here!**
    // Also you should follow ES5 coding style.
    //
    // See: https://github.com/scottie1984/swagger-ui-express/blob/master/index.js#L239
    //
    // Other Notes:
    // See https://github.com/scottie1984/swagger-ui-express/issues/44
    // See https://github.com/swagger-api/swagger-ui/blob/master/src/core/system.js#L344
    // See https://github.com/swagger-api/swagger-ui/issues/2915#issuecomment-297405865

    /** The name of one of your API securitySchemes. */
    var AUTH_SCHEME = "AuthJWT";
    // var swaggerOptions = this;
    var currentAuthToken = undefined;

    setTimeout(function() {
      // Restore auth token from localStorage, if any.
      var token = localStorage.getItem(AUTH_SCHEME);
      if (token) {
        setAuthToken(token);
        console.log("Restored " + AUTH_SCHEME + " token from localStorage.");
      }
      // Start polling ui.getState() to see if the user changed tokens.
      setTimeout(checkForNewLogin, 3000);
    }, 1000);

    function checkForNewLogin() {
      var stateToken = getAuthTokenFromState();
      if (stateToken !== currentAuthToken) {
        console.log("Saved " + AUTH_SCHEME + " token to localStorage.");
        if (stateToken) {
          localStorage.setItem(AUTH_SCHEME, stateToken);
        } else {
          localStorage.removeItem(AUTH_SCHEME);
        }
        currentAuthToken = stateToken;
      }
      // Continue checking every second...
      setTimeout(checkForNewLogin, 1000);
    }

    function getAuthTokenFromState() {
      var state = ui.getState();
      // Get token from state "auth.authorized[AUTH_SCHEME].value"
      return getUIStateEntry(
        getUIStateEntry(
          getUIStateEntry(getUIStateEntry(state, "auth"), "authorized"),
          AUTH_SCHEME
        ),
        "value"
      );
    }

    function getUIStateEntry(state, name) {
      if (state && state._root && Array.isArray(state._root.entries)) {
        var entry = state._root.entries.find(e => e && e[0] === name);
        return entry ? entry[1] : undefined;
      }
      return undefined;
    }

    function setAuthToken(token) {
      var authorization = {};
      authorization[AUTH_SCHEME] = {
        name: AUTH_SCHEME,
        schema: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: "",
        },
        value: token,
      };
      var result = ui.authActions.authorize(authorization);
      currentAuthToken = token;
      return result;
    }
  };
  /* eslint-enable */
  return {
    afterLoad,
  };
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
