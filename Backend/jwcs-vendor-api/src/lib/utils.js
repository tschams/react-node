import crypto from "crypto";

/**
 * Creates an API controller with the given operations, adding error handling
 * for `async` operations and possibly other operations features.
 * @param {{[op:string]: import('express').RequestHandler}} operations
 */
export function apiController(operations) {
  const controller = {};
  Object.keys(operations).forEach(key => {
    const operation = operations[key];
    if (typeof operation === "function") {
      controller[key] = apiOperation(operation);
    } else {
      controller[key] = operation;
    }
  });
  return controller;
}

/**
 * Adds features to an API operation, such as error handling for `async`
 * Promise API function. *(The given operation does not have to be `async`.)*
 * @param {import('express').RequestHandler} operation
 * @returns {import('express').RequestHandler}
 */
export function apiOperation(operation) {
  return function handleAsyncError(req, res, next) {
    Promise.resolve(operation(req, res, next)).catch(next);
  };
}

/** An empty function that always returns nothing. */
export function noHandler() {
  return;
}

/**
 * Sets a timeout asynchronously, with a Promise.
 * Returns any value returned by the optional handler.
 * @template TResult
 * @param {number} [timeout] The timeout time in milliseconds.
 * @param {(...args)=>TResult} [handler] Callback which may return a value.
 * @param {any[]} [args] Arguments to pass to the `handler`.
 * @returns {TResult} The value returned by the handler, if any.
 */
export function timeoutAsync(timeout = 350, handler = noHandler, ...args) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const result = handler(...args);
      resolve(result);
    }, timeout);
  });
}

export function updateStamp() {
  return crypto.pseudoRandomBytes(32).toString("hex");
}
