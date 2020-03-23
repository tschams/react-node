# Vendor API

## DEVELOPERS NOTE

**Only open the `Backend/jwcs-vendor-api` with VS Code for now.**

Then to run the app:

- Create a `.env.local` file in `jwcs-vendor-api`.
- Copy the DB settings from `.env` into your `.env.local` and point them
  to a test database.
- Open a terminal inside of `jwcs-vendor-api` and run `yarn install`.
- Run `yarn start`.
- Navigate your browser to http://localhost:3401/api-docs
- Use Swagger to **Create a user**.
- Use Swagger to **Login**.
- Use Swagger to **Authenticate** (button at top right of page) with your token.
  (Don't include quotes when pasting token value).
- Use Swagger to get the **Todos** list now that you're logged in.
- Logout (button at top right of page again).
- Try listing **Todos** again, you'll get an _Unauthorized_ error.
