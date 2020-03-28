import { Spec } from "../../lib/openapi";

export default Spec.controller("todos", {
  //
  // SECURITY: User must have the "manager" role to do anything with Todos.
  //
  roles: ["manager"],
  description: "TODOs controller.",
  operations: {
    post: Spec.op("create", {
      summary: "Create Todo Item",
      requestBody: Spec.jsonRequestBodyObject({
        title: { type: "string" },
        done: { type: "boolean" },
      }),
      responses: {
        200: Spec.response("OK"),
      },
    }),
    get: Spec.op("find", {
      summary: "Find Todos by Vendor",
      parameters: Spec.query({ title: "string?" }),
      responses: {
        200: Spec.response("OK"),
      },
    }),
    getById: Spec.op("getById", {
      summary: "Get Todo by Id",
      path: "{id}",
      type: "get",
      parameters: [Spec.pathParam("id", "integer", { description: "Todo Id" })],
      responses: {
        200: Spec.response("OK"),
      },
    }),
    delete: Spec.op("remove", {
      summary: "Remove Todo by Id",
      path: "{id}",
      parameters: [Spec.pathParam("id", "integer", { description: "Todo Id" })],
      responses: {
        200: Spec.response("OK"),
      },
      //
      // SECURITY: User must have the "supervisor" role to delete a Todo.
      //
      roles: ["supervisor"],
    }),
    put: Spec.op("update", {
      summary: "Update Todo by Id",
      path: "{id}", // e.g. "/api/v1/todos/{id}"
      parameters: [Spec.pathParam("id", "integer", { description: "Todo Id" })],
      requestBody: Spec.jsonRequestBodyObject({
        title: { type: "string" },
        done: { type: "boolean" },
        concurrencyStamp: { type: "string" },
      }),
      responses: {
        200: Spec.response("OK"),
      },
    }),
  },
});
