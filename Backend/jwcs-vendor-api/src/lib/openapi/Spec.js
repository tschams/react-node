const { NODE_ENV } = process.env;
const __DEV__ = NODE_ENV === "development";

let jwtSecurityScheme = "AuthJWT";

const opTypes = [
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
];

/**
 * Builds parts of the OpenAPI specification document to describe your API.
 * ### Documentation
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md
 * https://swagger.io/docs/specification/about/
 */
export const Spec = {
  app({
    /** JWT security scheme name to add ("AuthJWT"). Set to false to disable. */
    addJWTSecurityScheme = jwtSecurityScheme,
    /** Title of the API. */
    title = "An API",
    /** Description of the API. */
    description = "An API to serve the front-end",
    /** Base URL of the running API server. */
    url = "http://localhost:3000/api/v1",
    /** Package Version of the API. */
    version = "1.0.0",
    /** @type {Array<{components:object,paths:object,tags:object[]}>} */
    modules = [],
    /** @type {Array<{[scheme:string]:any}>} */
    security = [],
    /**
     * See https://swagger.io/docs/specification/authentication/
     * @type {{[scheme:string]:{type:string,scheme:string,description:string}}}
     */
    securitySchemes = undefined,
    /**
     * Servers besides the primary server, to show in the Swagger UI.
     * @type {Array<{url:string,description:string}>}
     */
    servers = [],
    /**
     * @type {{[component:string]:any}}
     */
    components = undefined,
    /** @typeof {{[path:string]:any}} */
    paths = undefined,
    /** @typeof {Array<object>} */
    tags = [],
  }) {
    if (addJWTSecurityScheme) {
      jwtSecurityScheme = addJWTSecurityScheme;
      /** See https://swagger.io/docs/specification/authentication/ */
      securitySchemes = {
        ...securitySchemes,
        [jwtSecurityScheme]: {
          // e.g. AuthJWT: {}
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Enter a JSON Web Token (JWT) to be sent with each request " +
            "in the HTTP **Authorization** header.",
        },
      };
      security = [
        ...security,
        {
          [addJWTSecurityScheme]: [], // e.g. AuthJWT: []
        },
      ];
    }
    const moduleComponents = {};
    const modulePaths = {};
    const moduleTags = [];
    modules.forEach(m => {
      Object.assign(moduleComponents, m.components);
      Object.assign(modulePaths, m.paths);
      moduleTags.push(...m.tags);
    });
    /**
     * The OpenAPI specification for this API.
     * ### Documentation
     * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md
     * https://swagger.io/docs/specification/about/
     */
    const apiSpec = {
      openapi: "3.0.3",
      info: {
        title,
        version,
        description,
      },
      servers: [
        {
          url,
          description: "Running",
        },
        ...servers,
      ],
      components: {
        securitySchemes: {
          ...securitySchemes,
        },
        ...components,
        ...moduleComponents,
      },
      security,
      paths: {
        ...paths,
        ...modulePaths,
      },
      tags: [
        //
        ...moduleTags,
      ],
    };
    return apiSpec;
  },
  /**
   * @typedef {object} ControllerProps
   * @property {string} [description]
   * @property {any} [components]
   * @property {string} [path]
   * @property {any} [paths]
   * @property {any} [operations]
   * @property {string[]} [roles]
   * @property {Array<any>} [security]
   *
   * @param {string} modulePath
   * @param {ControllerProps} props
   */
  controller(
    modulePath,
    {
      description,
      components,
      path = `/${modulePath}`,
      paths = {},
      operations,
      roles,
      security,
    },
  ) {
    const name = modulePath // convert from "path/name" to "PathName"
      .split("/")
      .map(s => (s.length < 1 ? s : s.substr(0, 1).toUpperCase() + s.substr(1)))
      .join("");
    const tags = [
      {
        name,
        description,
      },
    ];
    const propsForAllOps = {
      "x-eov-operation-handler": modulePath,
      tags: [name],
    };
    // Create paths from operations.
    Object.keys(operations).forEach(opKey => {
      // Get our custom properties and the rest to pass onto OpenAPI.
      let {
        operationId,
        path: opPath,
        roles: opRoles = roles,
        type: opType = opKey,
        ...op
      } = operations[opKey];
      if (!opPath) {
        if (opTypes.includes(opKey)) {
          // Use controller path as the default when opKey is an opType.
          opPath = path;
        } else {
          opPath = operationId;
        }
      }
      // Validate opType. Exit if invalid.
      if (!opTypes.includes(opType)) {
        console.log("\x1b[35m%s\x1b[0m", `\nInvalid API spec: ${opKey}`);
        console.log(
          "\x1b[36m%s\x1b[0m",
          `  - Please add a "type", one of: ${opTypes.join(", ")}\n` +
            `  - or rename the operation key (${opKey}:) ` +
            `to one of those types.\n`,
        );
        return;
      }
      if (opPath.substr(0, 1) !== "/") {
        opPath = `${path}/${opPath}`;
      }
      // Use our custom props to customize the OpenAPI document.
      const rolesProps = !opRoles
        ? {}
        : {
            "x-security-roles": opRoles,
          };
      paths[opPath] = {
        ...paths[opPath],
        [opType]: {
          operationId,
          security,
          ...rolesProps,
          ...op,
        },
      };
    });
    // Assign controller props to all operations in all paths.
    Object.keys(paths).forEach(p => {
      Object.keys(paths[p]).forEach(opKey => {
        if (opTypes.includes(opKey)) {
          Object.assign(paths[p][opKey], propsForAllOps);
        }
      });
    });
    return {
      paths,
      components,
      tags,
    };
  },

  developerOnlySecurity() {
    if (__DEV__) {
      return this.disableSecurity();
    }
    throw new Error(
      "developerOnlySecurity controller deployed outside development. " +
        "Try returning Spec.emptyController() during development.",
    );
  },

  disableSecurity() {
    return []; // e.g. security: []
  },

  emptyController() {
    return {
      tags: [],
    };
  },

  get() {},

  jsonRequestBodyObject(properties, schema = { additionalProperties: false }) {
    return {
      content: Spec.jsonContentObject(properties, schema),
    };
  },

  jsonContentObject(properties, schema = { additionalProperties: false }) {
    return {
      "application/json": {
        schema: {
          type: "object",
          properties,
          ...schema,
        },
      },
    };
  },

  op(
    operationId = "unknownOperation",
    {
      summary = "",
      description = "",
      requestBody = undefined,
      parameters = undefined,
      responses = undefined,
      ...options
    },
  ) {
    return {
      operationId,
      summary,
      description,
      requestBody,
      parameters,
      responses,
      ...options,
    };
  },

  /**
   * Creates an OpenAPI parameter object to put in your list of
   * `parameters: []`.
   * @typedef {object} APIParamProps
   * @property {string} [description] Defaults to the param `name`.
   * @property {boolean} [required] Defaults to `true`.
   * @property {any} [schema] More OpenAPI Schema properties.
   *
   * @param {string} name Name of the param.
   * @param {"cookie"|"path"|"query"} [from] Defaults to `"path"`.
   * Gets mapped to OpenAPI `"in"`.
   * @param {string} [type] Defaults to `"string"`.
   * @param {APIParamProps} [props] More OpenAPI param properties.
   */
  param(
    name,
    from = "path",
    type = "string",
    { description = name, required = false, schema, ...otherParamProps } = {},
  ) {
    return {
      description,
      in: from,
      name,
      required,
      schema: {
        type,
        ...schema,
      },
      ...otherParamProps,
    };
  },
  /**
   * Creates an OpenAPI `"path"` parameter object to put in your list of
   * `parameters: []`.
   * @param {string} name Name of the param.
   * @param {string} [type] Defaults to `"string"`.
   * @param {APIParamProps} [props] More OpenAPI param properties.
   */
  pathParam(name, type = "string", props) {
    // Path props should be `required` by default.
    props = {
      required: true,
      ...props,
    };
    return Spec.param(name, "path", type, props);
  },

  /**
   * Shortcut to specify OpenAPI parameters array.
   * @param {{[name:string]:string}} params Query parameter types by name.
   * @param {boolean} [required]
   * @returns {Array<{in:string,name:string,required:boolean,schema:any}>}
   */
  query(params, required = false) {
    if (Array.isArray(params)) {
      return params;
    }
    return Object.keys(params).map(name => {
      let type = params[name];
      const allowEmptyValue = type.endsWith("?");
      if (allowEmptyValue) {
        type = type.slice(0, -1);
      }
      return {
        in: "query",
        name,
        required,
        schema: { type },
        allowEmptyValue,
      };
    });
  },

  /** @param {string} description */
  response(description) {
    return {
      description,
    };
  },
};
