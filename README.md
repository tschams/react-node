# JWasser Co Supply

An application built with Node.js, React and SQL Server.

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

## Folder Structure

- [Backend/](./Backend/README.md) API servers and other backend packages.
- [Database/](./Database/README.md) A Visual Studio SQL Server Database Project
  with tools and scripts to help the DBA manage the database deployments.
- [Frontend/](./Frontend/README.md) All frontend applications.
- [References/](./References/README.md) Helpful code snippets, developer notes,
  research and a place to collect any other useful information.

## Project Naming

Individual project packages go inside one of the above folders. Use a common
prefix when naming packages that are owned by our company.

- Descriptive title: `JWasser Co Supply`
- Package name prefixes: `jwcs-`
- Abbreviation: `JWCS`

> To change any of these:

> Open the entire repository with VS Code or your favorite editor and
> run the `Replace in Files` command replacing the following strings:
>
> Also rename any files or folders that contain those strings as part of
> their name. You can use `Ctrl+P` shortcut in VS Code to find them.
