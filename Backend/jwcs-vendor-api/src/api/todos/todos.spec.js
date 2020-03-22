import { Spec } from "../../lib/openapi";

export default Spec.controller("todos", {
  description: "TODOs controller.",
  operations: {
    get: Spec.op("getItems", {
      summary: "Gets a list of todos.",
      description: "Gets todos.",
      // parameters: Spec.query({ sendInvite: "boolean" }),
      responses: {
        200: Spec.response("OK"),
      },
    }),
  },
});
