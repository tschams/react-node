import { Spec } from "../../lib/openapi";

export default Spec.controller("auth", {
  description: "Auth controller.",
  operations: {
    post: Spec.op("login", {
      path: "login",
      summary: "Authenticate user credentials. Return access token, user info.",
      description:
        "Generates a JWT access token after authentication.\n\n" +
        "See the data contained in your token at " +
        "[https://jwt.io/](https://jwt.io/#debugger-io)\n\n",
      requestBody: Spec.jsonRequestBodyObject({
        email: { type: "string", format: "email" },
        password: { type: "string", minLength: 8 },
      }),
      // parameters: Spec.query({ propName: "boolean|string|integer" }),
      responses: {
        200: Spec.response("OK"),
      },
    }),
  },
  security: Spec.disableSecurity(),
});
