import React from "react";

export function NotAuthorizedPage() {
  return (
    <div className="paper">
      <h1>NOT AUTHORIZED</h1>
      <p>
        Try going back and logging out. Then login as a user that has the
        "manager" role.
      </p>
      <p>
        Use the Swagger UI to assign the correct authorization role to your
        current user or create a new user with the role.
      </p>
    </div>
  );
}
