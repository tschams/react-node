import { __DEV__ } from "../../config";
import { Spec } from "../../lib/openapi";

export default __DEV__
  ? Spec.controller("dev/users", {
      description:
        "Development user administration. Initialize your first user here.",
      operations: {
        get: Spec.op("getUsers", {
          responses: {
            200: Spec.response("OK"),
          },
        }),
        post: Spec.op("createUser", {
          summary: "Creates a new user.",
          description: "Create User",
          requestBody: Spec.jsonRequestBodyObject({
            vendorId: { type: "integer" },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
          }),
          // parameters: Spec.query({ sendInvite: "boolean" }),
          responses: {
            200: Spec.response("OK"),
          },
          // roles: ["admin"],
        }),
      },
      security: Spec.developerOnlySecurity(),
    })
  : Spec.emptyController();
