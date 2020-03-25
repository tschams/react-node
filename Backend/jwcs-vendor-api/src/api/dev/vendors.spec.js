import { __DEV__ } from "../../config";
import { Spec } from "../../lib/openapi";

export default __DEV__
  ? Spec.controller("dev/vendors", {
      description:
        "Development vendor administration. Initialize your first vendor here.",
      operations: {
        get: Spec.op("listAll", {
          responses: {
            200: Spec.response("OK"),
          },
        }),
        post: Spec.op("create", {
          summary: "Create Vendor",
          description: "Creates a new vendor.",
          requestBody: Spec.jsonRequestBodyObject({
            name: { type: "string", maxLength: 75 },
          }),
          // parameters: Spec.query({ otherQueryParam: "boolean" }),
          responses: {
            200: Spec.response("OK"),
          },
          // roles: ["owner"],
        }),
        put: Spec.op("update", {
          path: "{id}", // e.g. "/api/v1/dev/vendors/{id}"
          summary: "Update Vendor",
          description: "Updates a vendor.",
          parameters: [
            Spec.pathParam("id", "integer", { description: "Vendor Id" }),
          ],
          requestBody: Spec.jsonRequestBodyObject({
            name: { type: "string", maxLength: 75 },
          }),
          responses: {
            200: Spec.response("OK"),
          },
        }),
      },
      security: Spec.developerOnlySecurity(),
    })
  : Spec.emptyController();
