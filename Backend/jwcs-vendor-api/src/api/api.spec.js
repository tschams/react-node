// Local
import { PACKAGE_VERSION, SITE_URL } from "../config";
import { Spec } from "../lib/openapi";

// Controller Specs
import auth from "./auth/auth.spec";
import devUsers from "./dev/users.spec";
import devVendors from "./dev/vendors.spec";
import todos from "./todos/todos.spec";

export const apiSpec = Spec.app({
  title: "Vendor API",
  description: "Vendor API specification.",
  url: SITE_URL,
  version: PACKAGE_VERSION,

  modules: [
    //
    auth,
    devUsers,
    devVendors,
    todos,
  ],
});
