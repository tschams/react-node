import { Spec } from "../../lib/openapi";

export default Spec.controller("auth", {
  description: "Auth controller.",
  operations: {
    post: Spec.op("login", {
      path: "login",
      summary: "Generates an access token.",
      description: "Generates access token.",
      requestBody: Spec.jsonRequestBodyObject({
        email: { type: "string", format: "email" },
        password: { type: "string", minLength: 8 },
      }),
      // parameters: Spec.query({ sendInvite: "boolean" }),
      responses: {
        200: Spec.response("OK"),
      },
    }),
  },
  security: Spec.disableSecurity(),
});
