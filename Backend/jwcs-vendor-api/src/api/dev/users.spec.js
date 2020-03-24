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
          summary: "Create User",
          description:
            "Creates a new user. " +
            "*Optionally* supply the first role to add them to.",
          requestBody: Spec.jsonRequestBodyObject({
            vendorId: { type: "integer" },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
            role: { type: "string" },
          }),
          // parameters: Spec.query({ sendInvite: "boolean" }),
          responses: {
            200: Spec.response("OK"),
          },
          // roles: ["admin"],
        }),

        getAuthRoles: Spec.op("getAuthRoles", {
          path: "roles", // e.g. /dev/users/roles
          type: "get",
          summary: "Gets a list of authorization roles.",
          responses: {
            200: Spec.response("OK"),
          },
        }),

        postAuthRole: Spec.op("createAuthRole", {
          path: "roles",
          type: "post",
          summary: "Creates a authorization role.",
          requestBody: Spec.jsonRequestBodyObject({
            name: { type: "string" },
          }),
          responses: {
            200: Spec.response("OK"),
          },
        }),
      },
      security: Spec.developerOnlySecurity(),
    })
  : Spec.emptyController();
