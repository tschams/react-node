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
    /** Development URL of the API. */
    url = "http://localhost:3000",
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
     * Servers besides the development server, to show in the Swagger UI.
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
          description: "Development server",
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
    Object.keys(operations).forEach(opType => {
      // Get our custom properties and the rest to pass onto OpenAPI.
      let { path: opPath = path, roles: opRoles = roles, ...op } = operations[
        opType
      ];
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

  jsonRequestBodyObject(properties) {
    return {
      content: Spec.jsonContentObject(properties),
    };
  },

  jsonContentObject(properties) {
    return {
      "application/json": {
        schema: {
          type: "object",
          properties,
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
      return {
        in: "query",
        name,
        required,
        schema: {
          type: params[name],
        },
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
