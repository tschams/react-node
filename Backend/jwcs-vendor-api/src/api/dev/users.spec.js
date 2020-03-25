import { __DEV__ } from "../../config";
import { Spec } from "../../lib/openapi";

export default __DEV__
  ? Spec.controller("dev/users", {
      description:
        "User administration for developers. " +
        "Initialize your first user here.",
      operations: {
        get: Spec.op("getUsers", {
          summary: "Get All Users",
          responses: {
            200: Spec.response("OK"),
          },
        }),
        post: Spec.op("createUser", {
          summary: "Create User",
          description:
            "Create a **Vendor** first if one doesn't exist. " +
            "Set vendorId here.\n\n" +
            "*Optionally* supply an authorization role.\n\n" +
            "**REMOVE** the `role` property if not assigning a specific role.",
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
          summary: "Gets Authorization Roles",
          responses: {
            200: Spec.response("OK"),
          },
        }),

        postAuthRole: Spec.op("createAuthRole", {
          path: "roles",
          type: "post",
          summary: "Create Authorization Role",
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
